import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { NotFoundError } from "@/server/errors/AppError";
import { db } from "@/services";

export const GET = apiHandler(
  async (_req: NextRequest, { params }) => {
    const { slug } = await params!;
    const product = await db.products.getProductBySlug(slug) || await db.products.getProductById(slug);
    if (!product) {
      throw new NotFoundError(`Product '${slug}'`);
    }

    return await db.products.getProductReviews(product.id);
  },
  { contextName: "ReviewsAPI" }
);

export const POST = apiHandler(
  async (req: NextRequest, { params }) => {
    const { slug } = await params!;
    const body = await req.json();

    const product = await db.products.getProductBySlug(slug) || await db.products.getProductById(slug);
    if (!product) {
      throw new NotFoundError(`Product '${slug}'`);
    }

    const validated = validateRequest(body, [
      { field: "userName", required: true, type: "string", min: 2 },
      { field: "rating", required: true, type: "number", min: 1, max: 5 },
      { field: "comment", required: true, type: "string", min: 5 },
    ]);

    return await db.products.addReview(product.id, {
      userId: body.userId || `guest-${Date.now()}`,
      userName: validated.userName,
      rating: validated.rating,
      comment: validated.comment,
    });
  },
  { contextName: "ReviewsAPI" }
);
