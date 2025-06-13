import {
  users,
  filmmakers,
  resources,
  projects,
  matches,
  inquiries,
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
  private users: Map<number, User>;
  private filmmakers: Map<number, Filmmaker>;
  private resources: Map<number, Resource>;
  private projects: Map<number, Project>;
  private matches: Map<number, Match>;
  private inquiries: Map<number, Inquiry>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.filmmakers = new Map();
    this.resources = new Map();
    this.projects = new Map();
    this.matches = new Map();
    this.inquiries = new Map();
    this.currentId = 1;
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
