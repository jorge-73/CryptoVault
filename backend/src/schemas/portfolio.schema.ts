import { z } from 'zod';

export const addHoldingSchema = z.object({
  cryptoId: z.string().min(1, 'cryptoId is required'),
  coinName: z.string().min(1, 'coinName is required'),
  coinSymbol: z.string().min(1, 'coinSymbol is required'),
  coinImage: z.string().optional(),
  amount: z.number().positive('amount must be positive'),
  entryPrice: z.number().positive('entryPrice must be positive'),
});

export const updateHoldingSchema = z.object({
  amount: z.number().positive('amount must be positive').optional(),
  entryPrice: z.number().positive('entryPrice must be positive').optional(),
});

export type AddHoldingInput = z.infer<typeof addHoldingSchema>;
export type UpdateHoldingInput = z.infer<typeof updateHoldingSchema>;
