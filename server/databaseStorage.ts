import {
  users,
  filmmakers,
  resources,
  projects,
  matches,
  inquiries,
  messages,
  notifications,
  providers,
  resourceAvailability,
  organizations,
  type User,
  type UpsertUser,
  type Filmmaker,
  type InsertFilmmaker,
  type Provider,
  type InsertProvider,
  type ResourceAvailability,
  type InsertResourceAvailability,
  type Resource,
  type InsertResource,
  type Project,
  type InsertProject,
  type Match,
  type InsertMatch,
  type Inquiry,
  type InsertInquiry,
  type Message,
  type InsertMessage,
  type Notification,
  type InsertNotification,
  type Organization,
  type InsertOrganization,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Organizations
  async getOrganization(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async getOrganizationBySlug(slug: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug));
    return org;
  }

  async createOrganization(organization: InsertOrganization): Promise<Organization> {
    const [org] = await db.insert(organizations).values(organization).returning();
    return org;
  }

  async updateOrganization(id: number, updates: Partial<InsertOrganization>): Promise<Organization | undefined> {
    const [org] = await db.update(organizations).set(updates).where(eq(organizations.id, id)).returning();
    return org;
  }

  // Users (IMPORTANT: these user operations are mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  // Providers
  async getProvider(id: number): Promise<Provider | undefined> {
    const [provider] = await db.select().from(providers).where(eq(providers.id, id));
    return provider;
  }

  async getProviderByUserId(userId: string): Promise<Provider | undefined> {
    const [provider] = await db.select().from(providers).where(eq(providers.userId, userId));
    return provider;
  }

  async createProvider(provider: InsertProvider): Promise<Provider> {
    const [newProvider] = await db.insert(providers).values(provider).returning();
    return newProvider;
  }

  async updateProvider(id: number, updates: Partial<InsertProvider>): Promise<Provider | undefined> {
    const [provider] = await db.update(providers).set({ ...updates, updatedAt: new Date() }).where(eq(providers.id, id)).returning();
    return provider;
  }

  // Filmmakers
  async getFilmmaker(id: number): Promise<Filmmaker | undefined> {
    const [filmmaker] = await db.select().from(filmmakers).where(eq(filmmakers.id, id));
    return filmmaker;
  }

  async getFilmmakerByUserId(userId: string): Promise<Filmmaker | undefined> {
    const [filmmaker] = await db.select().from(filmmakers).where(eq(filmmakers.userId, userId));
    return filmmaker;
  }

  async createFilmmaker(filmmaker: InsertFilmmaker): Promise<Filmmaker> {
    const [newFilmmaker] = await db.insert(filmmakers).values(filmmaker).returning();
    return newFilmmaker;
  }

  async updateFilmmaker(id: number, updates: Partial<InsertFilmmaker>): Promise<Filmmaker | undefined> {
    const [filmmaker] = await db.update(filmmakers).set({ ...updates, updatedAt: new Date() }).where(eq(filmmakers.id, id)).returning();
    return filmmaker;
  }

  // Calendar Availability
  async getResourceAvailability(resourceId: number, startDate: Date, endDate: Date): Promise<ResourceAvailability[]> {
    return await db.select()
      .from(resourceAvailability)
      .where(and(
        eq(resourceAvailability.resourceId, resourceId),
        gte(resourceAvailability.date, startDate),
        lte(resourceAvailability.date, endDate)
      ));
  }

  async updateResourceAvailability(availability: InsertResourceAvailability): Promise<ResourceAvailability> {
    const [updated] = await db.insert(resourceAvailability)
      .values({ ...availability, lastUpdated: new Date() })
      .onConflictDoUpdate({
        target: [resourceAvailability.resourceId, resourceAvailability.date],
        set: {
          isAvailable: availability.isAvailable,
          notes: availability.notes,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return updated;
  }

  async getLastCalendarUpdate(resourceId: number): Promise<Date | null> {
    const [latest] = await db.select({ lastUpdated: resourceAvailability.lastUpdated })
      .from(resourceAvailability)
      .where(eq(resourceAvailability.resourceId, resourceId))
      .orderBy(desc(resourceAvailability.lastUpdated))
      .limit(1);
    return latest?.lastUpdated || null;
  }

  // Resources
  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async getResources(filters?: {
    type?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
  }): Promise<Resource[]> {
    if (filters?.type) {
      return await db.select().from(resources).where(eq(resources.type, filters.type));
    }
    
    return await db.select().from(resources);
  }

  async getResourcesByProvider(providerId: number): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.providerId, providerId));
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async updateResource(id: number, updates: Partial<InsertResource>): Promise<Resource | undefined> {
    const [resource] = await db.update(resources).set(updates).where(eq(resources.id, id)).returning();
    return resource;
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectsByFilmmaker(filmmakerId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.filmmakerId, filmmakerId));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return project;
  }

  // Matches
  async getMatch(id: number): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }

  async getMatchesByProject(projectId: number): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.projectId, projectId));
  }

  async getMatchesByResource(resourceId: number): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.resourceId, resourceId));
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async updateMatch(id: number, updates: Partial<InsertMatch>): Promise<Match | undefined> {
    const [match] = await db.update(matches).set(updates).where(eq(matches.id, id)).returning();
    return match;
  }

  // Inquiries
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry;
  }

  async getInquiriesByProject(projectId: number): Promise<Inquiry[]> {
    return await db.select().from(inquiries).where(eq(inquiries.projectId, projectId));
  }

  async getInquiriesByProvider(providerId: number): Promise<Inquiry[]> {
    return await db.select().from(inquiries).where(eq(inquiries.providerId, providerId));
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db.insert(inquiries).values(inquiry).returning();
    return newInquiry;
  }

  async updateInquiry(id: number, updates: Partial<InsertInquiry>): Promise<Inquiry | undefined> {
    const [inquiry] = await db.update(inquiries).set(updates).where(eq(inquiries.id, id)).returning();
    return inquiry;
  }

  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async getMessagesByUser(userId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.senderId, userId));
  }

  async getConversation(senderId: string, recipientId: string, resourceId?: number): Promise<Message[]> {
    const conditions = [
      eq(messages.senderId, senderId),
      eq(messages.recipientId, recipientId)
    ];
    
    if (resourceId) {
      conditions.push(eq(messages.resourceId, resourceId));
    }
    
    return await db.select().from(messages)
      .where(and(...conditions))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [message] = await db.update(messages).set({ isRead: true }).where(eq(messages.id, id)).returning();
    return message;
  }

  // Notifications
  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId));
  }

  async getUnreadNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [notification] = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
    return notification;
  }
}