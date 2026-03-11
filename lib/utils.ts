import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// simple decryption helper; assumes base64 encoding of stored passwords
export function decryptPassword(encrypted: string): string {
  try {
    return atob(encrypted);
  } catch {
    return encrypted;
  }
}
