import { z } from 'zod';
import { baseProcedure, router } from '../trpc';

export const customerRouter = router({
  all: baseProcedure.query(({ ctx }) => {
    return ctx.customer.findMany({
      orderBy: {
        created_at: 'asc',
      },
    });
  }),
  byId: baseProcedure.query(({ ctx }) => {
    return ctx.customer.findMany({
      orderBy: {
        created_at: 'asc',
      },
    });
  }),
  
//   add: baseProcedure
//     .input(
//       z.object({
//         id: z.string().optional(),
//         text: z.string().min(1),
//       }),
//     )
//     .mutation(async ({ ctx, input }) => {
      
//       const todo = await ctx.customer.create({
//         data: input,
//       });
//       return todo;
//     }),
//   edit: baseProcedure
//     .input(
//       z.object({
//         id: z.string().uuid(),
//         data: z.object({
//           completed: z.boolean().optional(),
//           text: z.string().min(1).optional(),
//         }),
//       }),
//     )
//     .mutation(async ({ ctx, input }) => {
//       const { id, data } = input;
//       const todo = await ctx.customer.update({
//         where: { id },
//         data,
//       });
//       return todo;
//     }),
 
  delete: baseProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input: id }) => {
      await ctx.customer.delete({ where: { id } });
      return id;
    }),
 
});
