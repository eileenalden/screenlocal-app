import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResourceSchema, insertProjectSchema, insertMatchSchema, insertInquirySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Resources endpoints
  app.get("/api/resources", async (req, res) => {
    try {
      const { type, category, location, minPrice, maxPrice } = req.query;
      const filters: any = {};
      
      if (type) filters.type = type as string;
      if (category) filters.category = category as string;
      if (location) filters.location = location as string;
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);

      const resources = await storage.getResources(filters);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      res.status(400).json({ message: "Invalid resource data" });
    }
  });

  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const { filmmakerId } = req.query;
      
      if (filmmakerId) {
        const projects = await storage.getProjectsByFilmmaker(parseInt(filmmakerId as string));
        res.json(projects);
      } else {
        res.status(400).json({ message: "FilmmakerId is required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  // Matches endpoints
  app.get("/api/matches/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const matches = await storage.getMatchesByProject(projectId);
      
      // Get full resource data for each match
      const matchesWithResources = await Promise.all(
        matches.map(async (match) => {
          const resource = await storage.getResource(match.resourceId);
          return { ...match, resource };
        })
      );
      
      res.json(matchesWithResources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const validatedData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validatedData);
      res.status(201).json(match);
    } catch (error) {
      res.status(400).json({ message: "Invalid match data" });
    }
  });

  app.patch("/api/matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const updatedMatch = await storage.updateMatch(id, { status });
      
      if (!updatedMatch) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.json(updatedMatch);
    } catch (error) {
      res.status(500).json({ message: "Failed to update match" });
    }
  });

  // Inquiries endpoints
  app.get("/api/inquiries", async (req, res) => {
    try {
      const { projectId, providerId } = req.query;
      
      if (projectId) {
        const inquiries = await storage.getInquiriesByProject(parseInt(projectId as string));
        res.json(inquiries);
      } else if (providerId) {
        const inquiries = await storage.getInquiriesByProvider(parseInt(providerId as string));
        res.json(inquiries);
      } else {
        res.status(400).json({ message: "ProjectId or ProviderId is required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(400).json({ message: "Invalid inquiry data" });
    }
  });

  // Statistics endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const allResources = await storage.getResources();
      const stats = {
        locations: allResources.filter(r => r.type === 'location').length,
        crew: allResources.filter(r => r.type === 'crew').length,
        cast: allResources.filter(r => r.type === 'cast').length,
        services: allResources.filter(r => r.type === 'service').length,
        craftServices: allResources.filter(r => r.type === 'craft-service').length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // AI matching algorithm (simplified)
  app.post("/api/ai-match", async (req, res) => {
    try {
      const { projectDescription, projectType, budget } = req.body;
      
      // Simple matching based on keywords and budget
      const allResources = await storage.getResources();
      const keywords = projectDescription.toLowerCase().split(' ');
      
      const matches = allResources
        .map(resource => {
          let score = 0;
          
          // Check description for keywords
          keywords.forEach(keyword => {
            if (resource.description.toLowerCase().includes(keyword)) score += 0.1;
            if (resource.title.toLowerCase().includes(keyword)) score += 0.2;
          });
          
          // Budget compatibility
          if (resource.pricePerDay && budget) {
            const price = parseFloat(resource.pricePerDay);
            const budgetNum = parseFloat(budget);
            if (price <= budgetNum * 0.3) score += 0.3; // Within 30% of budget per resource
          }
          
          // Type matching bonus
          if (projectType === 'commercial' && resource.type === 'location') score += 0.2;
          if (projectType === 'feature' && resource.type === 'crew') score += 0.2;
          
          return { resource, score };
        })
        .filter(match => match.score > 0.1)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);
      
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "AI matching failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
