import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // ✅ only import, no export!

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // ✅ only exporting handlers