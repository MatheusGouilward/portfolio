import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date as "MAY 18, 2026" — uppercase, comma-separated.
 * Used in /craft, /thoughts and /now.
 */
export function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase()
}
