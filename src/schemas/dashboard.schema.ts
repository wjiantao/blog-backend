import { z } from "zod";

export const dashboardSummaryQuerySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    range: z.enum(["7d", "30d", "90d"]).optional(),
  }),
});
