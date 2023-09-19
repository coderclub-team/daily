//write a nextjs middleware function

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {PrismaClient} from '@prisma/client'

 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  console.log(`Incoming request: ${request.method} ${request.url}`)
}
 

export const config = {
  matcher: '/api/:path*',
}