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
 *         description: 依發布日期排序（預設：newest）
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: 篩選國家（需完全符合，例如：香港）
 *       - in: query
 *         name: published_after
 *         schema:
 *           type: string
 *           format: date
 *         description: 篩選發布日期在此日期之後（含）
 *       - in: query
 *         name: published_before
 *         schema:
 *           type: string
 *           format: date
 *         description: 篩選發布日期在此日期之前（含）
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
 *                     example: Hong-Kong2022
 *                   title:
 *                     type: string
 *                     example: 2024 香港
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2023-02-28"
 *                   description:
 *                     type: string
 *                     example: 香港・香港
 *                   cover:
 *                     type: string
 *                     format: uri
 *                     example: https://live.staticflickr.com/65535/54647286995_3b2fc393f0_b.jpg
 *                   category:
 *                     type: string
 *                     enum: [photos]
 *                     example: photos
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: [攝影, 香港]
 *                   city:
 *                     type: string
 *                     example: 香港
 *                   country:
 *                     type: string
 *                     example: 中國
 *       400:
 *         description: 日期格式錯誤（需為 YYYY-MM-DD）
 *       404:
 *         description: 查無符合條件的圖庫
 *       500:
 *         description: 伺服器錯誤
 */
import { getPhotosList } from "@/lib/notion.js";

export const runtime = "nodejs";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort") || "newest";
    const country = searchParams.get("country");
    const publishedAfter = searchParams.get("published_after");
    const publishedBefore = searchParams.get("published_before");

    if (publishedAfter && !DATE_REGEX.test(publishedAfter))
      return Response.json({ error: "published_after 格式錯誤，請使用 YYYY-MM-DD" }, { status: 400 });
    if (publishedBefore && !DATE_REGEX.test(publishedBefore))
      return Response.json({ error: "published_before 格式錯誤，請使用 YYYY-MM-DD" }, { status: 400 });

    let photos = await getPhotosList();

    if (country) photos = photos.filter((p) => p.country === country);
    if (publishedAfter) photos = photos.filter((p) => p.date >= publishedAfter);
    if (publishedBefore) photos = photos.filter((p) => p.date <= publishedBefore);

    if (photos.length === 0)
      return Response.json({ error: "查無符合條件的圖庫" }, { status: 404 });

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
