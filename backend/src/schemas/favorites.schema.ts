import { z } from 'zod';

export const addFavoriteSchema = z.object({
  cryptoId: z.string().min(1, 'cryptoId is required'),
});
