/*
 * © Eileen Alden, 2025
 * All rights reserved.
 */

import OpenAI from "openai";
import type { Resource } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface SearchFilters {
  type: string;
  category?: string;
  location?: string;
  priceRange?: { min: number; max: number };
  keywords: string[];
  amenities?: string[];
  equipment?: string[];
  specialties?: string[];
}

export async function performAISearch(
  resourceType: string,
  serviceSubtype: string | undefined,
  description: string,
  allResources: Resource[]
): Promise<Resource[]> {
  try {
    // Use GPT-4o-mini for cost efficiency
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a film production resource matching expert. Convert natural language descriptions into search criteria for Oakland-based film resources.

Resource types: location, crew, cast, services
Service subtypes: pre-production, equipment-rental, craft-services, post-production

Return JSON with these fields:
- keywords: array of relevant search terms
- location: specific Oakland area if mentioned
- priceRange: {min, max} if budget mentioned
- amenities: array for locations (parking, lighting, etc)
- equipment: array for equipment needs
- specialties: array for crew/cast skills
- category: specific category if clear

Example input: "I need a vintage warehouse in West Oakland with good natural lighting and parking for a music video shoot"
Example output: {
  "keywords": ["vintage", "warehouse", "music video", "industrial"],
  "location": "West Oakland",
  "amenities": ["natural lighting", "parking", "large space"],
  "category": "warehouse"
}`
        },
        {
          role: "user",
          content: `Resource type: ${resourceType}${serviceSubtype ? `, Service subtype: ${serviceSubtype}` : ''}
Description: ${description}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
      temperature: 0.3
    });

    const aiFilters: SearchFilters = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    // Filter resources based on AI-generated criteria
    let filteredResources = allResources.filter(resource => {
      // Basic type matching
      if (resource.type !== resourceType) return false;

      // Service subtype matching
      if (resourceType === 'services' && serviceSubtype) {
        if (!resource.category || resource.category !== serviceSubtype) return false;
      }

      // Keyword matching in title and description
      if (aiFilters.keywords && aiFilters.keywords.length > 0) {
        const searchText = `${resource.title} ${resource.description}`.toLowerCase();
        const hasKeyword = aiFilters.keywords.some(keyword => 
          searchText.includes(keyword.toLowerCase())
        );
        if (!hasKeyword) return false;
      }

      // Location matching
      if (aiFilters.location && resource.location) {
        if (!resource.location.toLowerCase().includes(aiFilters.location.toLowerCase())) {
          return false;
        }
      }

      // Price range matching
      if (aiFilters.priceRange && resource.pricePerDay) {
        const price = parseFloat(resource.pricePerDay);
        if (price < aiFilters.priceRange.min || price > aiFilters.priceRange.max) {
          return false;
        }
      }

      // Category matching
      if (aiFilters.category && resource.category) {
        if (!resource.category.toLowerCase().includes(aiFilters.category.toLowerCase())) {
          return false;
        }
      }

      // Amenities matching for locations
      if (aiFilters.amenities && resource.amenities) {
        const hasAmenity = aiFilters.amenities.some(amenity =>
          resource.amenities?.some(ra => ra.toLowerCase().includes(amenity.toLowerCase()))
        );
        if (!hasAmenity) return false;
      }

      // Equipment matching
      if (aiFilters.equipment && resource.equipment) {
        const hasEquipment = aiFilters.equipment.some(equip =>
          resource.equipment?.some(re => re.toLowerCase().includes(equip.toLowerCase()))
        );
        if (!hasEquipment) return false;
      }

      // Specialties matching for crew/cast
      if (aiFilters.specialties && resource.specialties) {
        const hasSpecialty = aiFilters.specialties.some(specialty =>
          resource.specialties?.some(rs => rs.toLowerCase().includes(specialty.toLowerCase()))
        );
        if (!hasSpecialty) return false;
      }

      return true;
    });

    // Score and sort results by relevance
    const scoredResources = filteredResources.map(resource => {
      let score = 0;
      const searchText = `${resource.title} ${resource.description}`.toLowerCase();

      // Keyword matching score
      if (aiFilters.keywords) {
        aiFilters.keywords.forEach(keyword => {
          if (searchText.includes(keyword.toLowerCase())) {
            score += keyword.length > 3 ? 3 : 1; // Longer keywords are more specific
          }
        });
      }

      // Location exact match bonus
      if (aiFilters.location && resource.location) {
        if (resource.location.toLowerCase().includes(aiFilters.location.toLowerCase())) {
          score += 5;
        }
      }

      // Title keyword bonus
      if (aiFilters.keywords) {
        const titleText = resource.title.toLowerCase();
        aiFilters.keywords.forEach(keyword => {
          if (titleText.includes(keyword.toLowerCase())) {
            score += 2;
          }
        });
      }

      return { ...resource, searchScore: score };
    });

    // Sort by score (highest first) and return top matches
    return scoredResources
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 20) // Limit to top 20 results
      .map(({ searchScore, ...resource }) => resource); // Remove search score from final result

  } catch (error) {
    console.error("AI search error:", error);
    // Fallback to simple text search
    return allResources.filter(resource => {
      if (resource.type !== resourceType) return false;
      
      const searchText = `${resource.title} ${resource.description}`.toLowerCase();
      const queryText = description.toLowerCase();
      
      return searchText.includes(queryText) || 
             queryText.split(' ').some(word => word.length > 2 && searchText.includes(word));
    }).slice(0, 10);
  }
}