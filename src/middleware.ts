import { rateLimiter } from "@/lib/rate-limiter";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const ip = req.ip ?? "127.0.0.1";

    try {
        const { success } = await rateLimiter.limit(ip);
        if (!success)
            return new NextResponse("You are writing messages too fast!!");
        return NextResponse.next();
    } catch (error) {
        new NextResponse("Sorry! Something went wrong. Please try again!");
    }
}

export const config = {
    matcher: "/api/message/:path*",
};
