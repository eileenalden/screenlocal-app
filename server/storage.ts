// © Eileen Alden, 2025. All rights reserved. This software and its components are the original work of Eileen Alden, developed without compensation. No rights are granted or implied for use or distribution without a signed agreement.

import {
  organizations,
  users,
  filmmakers,
  resources,
  projects,
  matches,
  inquiries,
  type Organization,
  type InsertOrganization,
  type User,
  type InsertUser,
  type Filmmaker,
  type InsertFilmmaker,
  type Resource,
  type InsertResource,
  type Project,
  type InsertProject,
  type Match,
  type InsertMatch,
  type Inquiry,
  type InsertInquiry,
} from "@shared/schema";

export interface IStorage {
  // Organizations
  getOrganization(id: number): Promise<Organization | undefined>;
  getOrganizationBySlug(slug: string): Promise<Organization | undefined>;
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  updateOrganization(id: number, updates: Partial<InsertOrganization>): Promise<Organization | undefined>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Filmmakers
  getFilmmaker(id: number): Promise<Filmmaker | undefined>;
  getFilmmakerByUserId(userId: number): Promise<Filmmaker | undefined>;
  createFilmmaker(filmmaker: InsertFilmmaker): Promise<Filmmaker>;
  updateFilmmaker(id: number, updates: Partial<InsertFilmmaker>): Promise<Filmmaker | undefined>;

  // Resources
  getResource(id: number): Promise<Resource | undefined>;
  getResources(filters?: {
    type?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
  }): Promise<Resource[]>;
  getResourcesByProvider(providerId: number): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, updates: Partial<InsertResource>): Promise<Resource | undefined>;

  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByFilmmaker(filmmakerId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;

  // Matches
  getMatch(id: number): Promise<Match | undefined>;
  getMatchesByProject(projectId: number): Promise<Match[]>;
  getMatchesByResource(resourceId: number): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, updates: Partial<InsertMatch>): Promise<Match | undefined>;

  // Inquiries
  getInquiry(id: number): Promise<Inquiry | undefined>;
  getInquiriesByProject(projectId: number): Promise<Inquiry[]>;
  getInquiriesByProvider(providerId: number): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: number, updates: Partial<InsertInquiry>): Promise<Inquiry | undefined>;
}

export class MemStorage implements IStorage {
  private organizations: Map<number, Organization>;
  private users: Map<number, User>;
  private filmmakers: Map<number, Filmmaker>;
  private resources: Map<number, Resource>;
  private projects: Map<number, Project>;
  private matches: Map<number, Match>;
  private inquiries: Map<number, Inquiry>;
  private currentId: number;

  constructor() {
    this.organizations = new Map();
    this.users = new Map();
    this.filmmakers = new Map();
    this.resources = new Map();
    this.projects = new Map();
    this.matches = new Map();
    this.inquiries = new Map();
    this.currentId = 1;
    this.initializeWithSampleData();
  }

  private initializeWithSampleData() {
    // Create Oakland organization
    this.createOrganization({
      name: "Oakland Film Commission",
      slug: "oakland",
      city: "Oakland",
      state: "California",
      isActive: true,
    });

    // Sample Oakland locations
    this.createResource({
      providerId: 1,
      type: "location",
      title: "Historic Lake Merritt Boathouse",
      description: "Beautiful waterfront venue with panoramic lake views. Perfect for romantic scenes, events, and establishing shots of Oakland's crown jewel.",
      category: "outdoor",
      images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "450",
      priceType: "day",
      location: "Lake Merritt, Oakland",
      amenities: ["Parking", "Restrooms", "Catering Kitchen", "Power Access"],
      isActive: true
    });

    this.createResource({
      providerId: 2,
      type: "location", 
      title: "Downtown Oakland Warehouse Studio",
      description: "10,000 sq ft industrial space with high ceilings, exposed brick, and flexible lighting setup. Ideal for commercials, music videos, and indie films.",
      category: "studio",
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "800",
      priceType: "day",
      location: "Downtown Oakland",
      amenities: ["Green Screen", "Lighting Grid", "Loading Dock", "Client Lounge"],
      isActive: true
    });

    this.createResource({
      providerId: 3,
      type: "location",
      title: "Victorian House in West Oakland",
      description: "Authentic 1890s Victorian home with period details intact. Multiple rooms available for filming with beautiful natural light.",
      category: "house",
      images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "600",
      priceType: "day",
      location: "West Oakland",
      amenities: ["Period Furniture", "Multiple Rooms", "Garden", "Parking"],
      isActive: true
    });

    // Sample crew members
    this.createResource({
      providerId: 4,
      type: "crew",
      title: "Marcus Chen - Director of Photography",
      description: "Award-winning DP with 12 years experience in narrative and commercial work. Specializes in natural lighting and handheld cinematography.",
      category: "dp",
      images: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "750",
      priceType: "day",
      location: "Oakland",
      specialties: ["RED Camera", "Steadicam", "Drone Operation", "Color Grading"],
      isActive: true
    });

    this.createResource({
      providerId: 5,
      type: "crew",
      title: "Sofia Rodriguez - Sound Engineer",
      description: "Professional sound recordist and mixer with expertise in dialogue recording and post-production audio.",
      category: "sound",
      images: ["https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "500",
      priceType: "day",
      location: "Oakland",
      specialties: ["Boom Operation", "Wireless Systems", "Post Mixing", "Location Recording"],
      equipment: ["Sound Devices MixPre", "Sennheiser Wireless", "Boom Poles", "Monitor Speakers"],
      isActive: true
    });

    // Sample cast members
    this.createResource({
      providerId: 6,
      type: "cast",
      title: "James Thompson - Lead Actor",
      description: "Versatile actor with theater background and film credits. Strong emotional range and improvisational skills.",
      category: "lead-male",
      images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "400",
      priceType: "day",
      location: "Oakland",
      specialties: ["Drama", "Comedy", "Action", "Voice Acting"],
      isActive: true
    });

    this.createResource({
      providerId: 7,
      type: "cast",
      title: "Maya Patel - Supporting Actress",
      description: "Character actress with extensive commercial and independent film experience. Particularly strong in dramatic roles.",
      category: "supporting",
      images: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "300",
      priceType: "day",
      location: "Oakland",
      specialties: ["Character Work", "Accents", "Physical Comedy", "Period Pieces"],
      isActive: true
    });

    // Sample services
    this.createResource({
      providerId: 8,
      type: "service",
      title: "Bay Area Equipment Rentals",
      description: "Full-service camera and lighting rental house with delivery to Oakland locations. Professional-grade equipment for all production sizes.",
      category: "equipment",
      images: ["https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "200",
      priceType: "day",
      location: "Oakland",
      equipment: ["ARRI Cameras", "LED Panels", "Tripods", "Monitors", "Audio Gear"],
      isActive: true
    });

    this.createResource({
      providerId: 9,
      type: "service",
      title: "Oakland Post Production",
      description: "Complete post-production services including editing, color correction, sound design, and finishing for all types of content.",
      category: "post",
      images: ["https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "150",
      priceType: "hour",
      location: "Oakland",
      specialties: ["Avid", "Premiere Pro", "DaVinci Resolve", "Pro Tools"],
      isActive: true
    });

    // Sample craft services
    this.createResource({
      providerId: 10,
      type: "craft-service",
      title: "Set Catering by Maria",
      description: "Professional on-set catering with fresh, locally-sourced meals. Accommodates all dietary restrictions and preferences.",
      category: "catering",
      images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "80",
      priceType: "person",
      location: "Oakland",
      amenities: ["Vegetarian Options", "Gluten-Free", "Setup/Cleanup", "Disposable Service"],
      isActive: true
    });

    this.createResource({
      providerId: 11,
      type: "craft-service",
      title: "Oakland Coffee Cart Co.",
      description: "Mobile espresso cart service for film sets. Professional barista-quality coffee and tea service to keep your crew energized.",
      category: "coffee",
      images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      pricePerDay: "250",
      priceType: "day",
      location: "Oakland",
      amenities: ["Espresso Machine", "Variety of Teas", "Pastries", "All Day Service"],
      isActive: true
    });
  }

  // Organizations
  async getOrganization(id: number): Promise<Organization | undefined> {
    return this.organizations.get(id);
  }

  async getOrganizationBySlug(slug: string): Promise<Organization | undefined> {
    return Array.from(this.organizations.values()).find(org => org.slug === slug);
  }

  async createOrganization(insertOrganization: InsertOrganization): Promise<Organization> {
    const id = this.currentId++;
    const organization: Organization = { 
      ...insertOrganization, 
      id,
      createdAt: new Date(),
    };
    this.organizations.set(id, organization);
    return organization;
  }

  async updateOrganization(id: number, updates: Partial<InsertOrganization>): Promise<Organization | undefined> {
    const organization = this.organizations.get(id);
    if (!organization) return undefined;
    
    const updatedOrganization = { ...organization, ...updates };
    this.organizations.set(id, updatedOrganization);
    return updatedOrganization;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Filmmakers
  async getFilmmaker(id: number): Promise<Filmmaker | undefined> {
    return this.filmmakers.get(id);
  }

  async getFilmmakerByUserId(userId: number): Promise<Filmmaker | undefined> {
    return Array.from(this.filmmakers.values()).find(f => f.userId === userId);
  }

  async createFilmmaker(insertFilmmaker: InsertFilmmaker): Promise<Filmmaker> {
    const id = this.currentId++;
    const filmmaker: Filmmaker = { ...insertFilmmaker, id };
    this.filmmakers.set(id, filmmaker);
    return filmmaker;
  }

  async updateFilmmaker(id: number, updates: Partial<InsertFilmmaker>): Promise<Filmmaker | undefined> {
    const filmmaker = this.filmmakers.get(id);
    if (!filmmaker) return undefined;
    const updated = { ...filmmaker, ...updates };
    this.filmmakers.set(id, updated);
    return updated;
  }

  // Resources
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResources(filters?: {
    type?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
  }): Promise<Resource[]> {
    let result = Array.from(this.resources.values()).filter(r => r.isActive);

    if (filters) {
      if (filters.type) {
        result = result.filter(r => r.type === filters.type);
      }
      if (filters.category) {
        result = result.filter(r => r.category === filters.category);
      }
      if (filters.location) {
        result = result.filter(r => r.location?.toLowerCase().includes(filters.location!.toLowerCase()));
      }
      if (filters.minPrice !== undefined) {
        result = result.filter(r => r.pricePerDay && parseFloat(r.pricePerDay) >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        result = result.filter(r => r.pricePerDay && parseFloat(r.pricePerDay) <= filters.maxPrice!);
      }
    }

    return result;
  }

  async getResourcesByProvider(providerId: number): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(r => r.providerId === providerId);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.currentId++;
    const resource: Resource = { 
      ...insertResource, 
      id,
      rating: "0",
      reviewCount: 0
    };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: number, updates: Partial<InsertResource>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;
    const updated = { ...resource, ...updates };
    this.resources.set(id, updated);
    return updated;
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByFilmmaker(filmmakerId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.filmmakerId === filmmakerId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updated = { ...project, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  // Matches
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchesByProject(projectId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(m => m.projectId === projectId);
  }

  async getMatchesByResource(resourceId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(m => m.resourceId === resourceId);
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = this.currentId++;
    const match: Match = { 
      ...insertMatch, 
      id,
      createdAt: new Date()
    };
    this.matches.set(id, match);
    return match;
  }

  async updateMatch(id: number, updates: Partial<InsertMatch>): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    const updated = { ...match, ...updates };
    this.matches.set(id, updated);
    return updated;
  }

  // Inquiries
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async getInquiriesByProject(projectId: number): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(i => i.projectId === projectId);
  }

  async getInquiriesByProvider(providerId: number): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(i => i.providerId === providerId);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id,
      createdAt: new Date()
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async updateInquiry(id: number, updates: Partial<InsertInquiry>): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;
    const updated = { ...inquiry, ...updates };
    this.inquiries.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
