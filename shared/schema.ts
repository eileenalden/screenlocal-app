// © Eileen Alden, 2025. All rights reserved. This software and its components are the original work of Eileen Alden, developed without compensation. No rights are granted or implied for use or distribution without a signed agreement.

import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizations.id),
  username: text("username").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("filmmaker"), // filmmaker, provider, admin
  profileComplete: boolean("profile_complete").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const filmmakers = pgTable("filmmakers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  companyName: text("company_name"),
  bio: text("bio"),
  experience: text("experience"),
  portfolio: text("portfolio"),
  preferredGenres: text("preferred_genres").array(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizations.id),
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
  organizationId: integer("organization_id").notNull().references(() => organizations.id),
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

// Insert schemas
export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFilmmakerSchema = createInsertSchema(filmmakers).omit({
  id: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  rating: true,
  reviewCount: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

// Types
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

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
