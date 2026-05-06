/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: 取得所有文章列表
 *     description: 返回所有已發佈文章（Status != Draft）的摘要清單
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 限制回傳筆數（預設：全部）
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *         description: 排序方式（預設：newest）
 *     responses:
 *       200:
 *         description: 成功取得文章列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: post-001
 *                   title:
 *                     type: string
 *                     example: 日本之旅
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2026-01-15
 *                   description:
 *                     type: string
 *                   cover:
 *                     type: string
 *                     format: uri
 *                     example: https://res.cloudinary.com/...
 *                   category:
 *                     type: string
 *                     enum: [trips, essays]
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *       500:
 *         description: 伺服器錯誤
 */
import { getPostsList } from "@/lib/notion.js";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort") || "newest";

    let posts = await getPostsList();

    posts = posts.sort((a, b) =>
      sort === "oldest"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

    if (limit) posts = posts.slice(0, parseInt(limit));

    return Response.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
