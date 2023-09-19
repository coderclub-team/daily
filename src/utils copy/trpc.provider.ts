import { AppRouter } from '@/pages/server/routers/app.router';
import { createTRPCReact } from '@trpc/react-query';

 
export const trpc = createTRPCReact();

