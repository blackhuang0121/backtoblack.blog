import { swaggerSpec } from "@/lib/swagger.js";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(swaggerSpec);
}
