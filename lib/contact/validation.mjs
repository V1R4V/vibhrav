import { z } from 'zod';

export const safeLine = (value) => !/[\r\n\x00-\x1f\x7f]/.test(value);
export const fields = z.object({
  name: z.string().trim().min(2, 'Please enter at least 2 characters.').max(100, 'Use 100 characters or fewer.').refine(safeLine, 'Please use a single line.'),
  email: z.string().trim().max(254, 'Use 254 characters or fewer.').email('Please enter a valid email address.').refine(safeLine),
  message: z.string().trim().min(20, 'Please enter at least 20 characters.').max(5000, 'Use 5,000 characters or fewer.').refine((value) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value), 'Please remove unsupported characters.'),
  website: z.string().max(0).optional(),
  challenge: z.string().max(256),
}).strict();
