/**
 * @swagger
 * /api/photos:
 *   get:
 *     summary: 取得所有圖庫列表
 *     description: 返回所有已發佈圖庫（Status != Draft）的摘要清單
 *     tags:
 *       - Photos
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
 *         description: 成功取得圖庫列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: photo-001
 *                   title:
 *                     type: string
 *                     example: 東京街景
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2026-01-15
 *                   description:
 *                     type: string
 *                   cover:
 *                     type: string
 *                     format: uri
 *                   category:
 *                     type: string
 *                     enum: [photos]
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
import { getPhotosList } from "@/lib/notion.js";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort") || "newest";

    let photos = await getPhotosList();

    photos = photos.sort((a, b) =>
      sort === "oldest"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

    if (limit) photos = photos.slice(0, parseInt(limit));

    return Response.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return Response.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}
