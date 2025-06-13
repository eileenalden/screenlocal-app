import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function calculateMatchScore(
  project: any,
  resource: any
): number {
  let score = 0;
  
  // Budget compatibility (30% weight)
  if (project.budget && resource.pricePerDay) {
    const dailyBudget = project.budget / 10; // Assume 10-day shoot
    const resourcePrice = parseFloat(resource.pricePerDay);
    if (resourcePrice <= dailyBudget) {
      score += 0.3;
    } else if (resourcePrice <= dailyBudget * 1.2) {
      score += 0.2;
    }
  }
  
  // Location match (20% weight)
  if (project.location && resource.location) {
    if (resource.location.toLowerCase().includes(project.location.toLowerCase())) {
      score += 0.2;
    }
  }
  
  // Type compatibility (25% weight)
  if (project.type && resource.type) {
    // Add logic for project type to resource type matching
    score += 0.25;
  }
  
  // Availability (25% weight)
  if (resource.isActive) {
    score += 0.25;
  }
  
  return Math.min(score, 1.0);
}

export function getResourceTypeColor(type: string): string {
  switch (type) {
    case "location":
      return "bg-blue-100 text-blue-800";
    case "crew":
      return "bg-green-100 text-green-800";
    case "cast":
      return "bg-purple-100 text-purple-800";
    case "service":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
