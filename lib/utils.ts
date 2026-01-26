import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency (EUR) with 2 decimal places
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

/**
 * Formats a date to a nice readable string (French style, since target market is EU/France)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Truncates text with ellipsis if too long
 */
export function truncate(str: string, length: number = 100): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}
