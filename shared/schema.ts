// © Eileen Alden, 2025. All rights reserved. This software and its components are the original work of Eileen Alden, developed without compensation. No rights are granted or implied for use or distribution without a signed agreement.

import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  decimal,
  timestamp,
  jsonb,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Future multi-tenant support
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  brandName: text("brand_name"), // e.g., "Oakland/East Bay", "Austin", "Atlanta"
  heroTitle: text("hero_title"), // Custom hero title override
  heroSubtitle: text("hero_subtitle"), // Custom hero subtitle
  primaryColor: text("primary_color").default("#ea580c"), // Orange-500 default
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").notNull().default("filmmaker"), // filmmaker, provider, admin
  organizationId: integer("organization_id").default(1),
  profileComplete: boolean("profile_complete").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const filmmakers = pgTable("filmmakers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  companyName: text("company_name"),
  bio: text("bio"),
  experience: text("experience"),
  portfolio: text("portfolio"),
  preferredGenres: text("preferred_genres").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Resource Providers (location agents, crew, cast, service providers)
export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  businessName: text("business_name"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  bio: text("bio"),
  specialties: text("specialties").array(),
  insuranceInfo: jsonb("insurance_info"), // Insurance details for liability coverage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calendar availability for resources
export const resourceAvailability = pgTable("resource_availability", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").notNull(),
  date: timestamp("date").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  notes: text("notes"), // e.g., "Booked for commercial shoot", "Maintenance day"
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizations.id).default(1),
  providerId: integer("provider_id").notNull(),
  type: text("type").notNull(), // location, crew, cast, service, craft-service
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"), // For crew: dp, sound, etc. For cast: actor, extra, etc.
  images: text("images").array(),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }),
  priceType: text("price_type").default("day"), // day, hour, project
  location: text("location"),
  availability: jsonb("availability"), // Calendar data
  amenities: text("amenities").array(),
  equipment: text("equipment").array(),
  specialties: text("specialties").array(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").default(1), // Future-proofed for multi-tenant
  filmmakerId: integer("filmmaker_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // feature, short, commercial, music_video, documentary
  genre: text("genre"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  shootDates: jsonb("shoot_dates"), // Array of date ranges
  location: text("location"),
  requirements: jsonb("requirements"), // Specific needs
  status: text("status").default("planning"), // planning, casting, production, post, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  resourceId: integer("resource_id").notNull(),
  matchScore: decimal("match_score", { precision: 3, scale: 2 }),
  status: text("status").default("pending"), // pending, liked, passed, contacted
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  resourceId: integer("resource_id").notNull(),
  filmmakerId: integer("filmmaker_id").notNull(),
  providerId: integer("provider_id").notNull(),
  message: text("message"),
  status: text("status").default("pending"), // pending, accepted, declined
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  
  // Foreign keys
  senderId: varchar("sender_id").notNull().references(() => users.id),
  recipientId: varchar("recipient_id").notNull().references(() => users.id),
  resourceId: integer("resource_id").references(() => resources.id),
  inquiryId: integer("inquiry_id").references(() => inquiries.id),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "message", "inquiry", "booking"
  title: text("title").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  
  // Foreign keys
  userId: varchar("user_id").notNull().references(() => users.id),
  messageId: integer("message_id").references(() => messages.id),
});

// Insert schemas
export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProviderSchema = createInsertSchema(providers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResourceAvailabilitySchema = createInsertSchema(resourceAvailability).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertFilmmakerSchema = createInsertSchema(filmmakers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  rating: true,
  reviewCount: true,
}).extend({
  organizationId: z.number().optional(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
}).extend({
  organizationId: z.number().optional(),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Types
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Provider = typeof providers.$inferSelect;
export type InsertProvider = z.infer<typeof insertProviderSchema>;

export type ResourceAvailability = typeof resourceAvailability.$inferSelect;
export type InsertResourceAvailability = z.infer<typeof insertResourceAvailabilitySchema>;

export type Filmmaker = typeof filmmakers.$inferSelect;
export type InsertFilmmaker = z.infer<typeof insertFilmmakerSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
