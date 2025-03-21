import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (boolean | string | undefined | null)[]) {
  return twMerge(clsx(inputs));
}
