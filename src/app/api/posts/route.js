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
 *         description: 依發布日期排序（預設：newest）
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [trips, essays]
 *         description: 篩選分類
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: 篩選國家（需完全符合，例如：荷蘭）
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
 *                     example: rotterdam-windmill
 *                   title:
 *                     type: string
 *                     example: 荷蘭｜鹿特丹小孩堤坊與白色風車
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-07-09"
 *                   description:
 *                     type: string
 *                     example: 萊登到鹿特丹，初訪小孩堤坊的多重風車群，騎單車、拍照片與搭公車的日常。
 *                   cover:
 *                     type: string
 *                     format: uri
 *                     example: https://live.staticflickr.com/65535/53976641147_443bbea667_b.jpg
 *                   category:
 *                     type: string
 *                     enum: [trips, essays]
 *                     example: trips
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: [歐洲, 荷蘭, 鹿特丹, 風車]
 *                   city:
 *                     type: string
 *                     example: 鹿特丹
 *                   country:
 *                     type: string
 *                     example: 荷蘭
 *       400:
 *         description: 日期格式錯誤（需為 YYYY-MM-DD）
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "published_after 格式錯誤，請使用 YYYY-MM-DD"
 *       404:
 *         description: 查無符合條件的文章
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "查無符合條件的文章"
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Failed to fetch posts"
 */
import { getPostsList } from "@/lib/notion.js";

export const runtime = "nodejs";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort") || "newest";
    const category = searchParams.get("category");
    const country = searchParams.get("country");
    const publishedAfter = searchParams.get("published_after");
    const publishedBefore = searchParams.get("published_before");

    if (publishedAfter && !DATE_REGEX.test(publishedAfter))
      return Response.json({ error: "published_after 格式錯誤，請使用 YYYY-MM-DD" }, { status: 400 });
    if (publishedBefore && !DATE_REGEX.test(publishedBefore))
      return Response.json({ error: "published_before 格式錯誤，請使用 YYYY-MM-DD" }, { status: 400 });

    let posts = await getPostsList();

    if (category) posts = posts.filter((p) => p.category === category);
    if (country) posts = posts.filter((p) => p.country === country);
    if (publishedAfter) posts = posts.filter((p) => p.date >= publishedAfter);
    if (publishedBefore) posts = posts.filter((p) => p.date <= publishedBefore);

    if (posts.length === 0)
      return Response.json({ error: "查無符合條件的文章" }, { status: 404 });

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
