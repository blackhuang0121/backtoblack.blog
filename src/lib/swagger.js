import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "backtoblack.blog API",
      version: "1.1.0",
      description: "部落格內容的 Open API 資源，提供文章與圖庫資料",
    },
    tags: [{ name: "Posts" }, { name: "Photos" }],
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? process.env.SITE_URL || "https://backtoblackblog.vercel.app"
            : "http://localhost:3000",
        description:
          process.env.NODE_ENV === "production" ? "Production" : "Development",
      },
    ],
    paths: {
      "/api/posts": {
        get: {
          summary: "取得所有文章列表",
          description: "返回所有已發佈文章（Status != Draft）的摘要清單",
          tags: ["Posts"],
          parameters: [
            {
              in: "query",
              name: "limit",
              schema: { type: "integer" },
              description: "限制回傳筆數（預設：全部）",
            },
            {
              in: "query",
              name: "sort",
              schema: { type: "string", enum: ["newest", "oldest"] },
              description: "依發布日期排序（預設：newest）",
            },
            {
              in: "query",
              name: "category",
              schema: { type: "string", enum: ["trips", "essays"] },
              description: "篩選分類",
            },
            {
              in: "query",
              name: "country",
              schema: { type: "string" },
              description: "篩選國家（需完全符合，例如：荷蘭）",
            },
            {
              in: "query",
              name: "published_after",
              schema: { type: "string", format: "date" },
              description: "篩選發布日期在此日期之後（含），格式 YYYY-MM-DD",
            },
            {
              in: "query",
              name: "published_before",
              schema: { type: "string", format: "date" },
              description: "篩選發布日期在此日期之前（含），格式 YYYY-MM-DD",
            },
          ],
          responses: {
            200: {
              description: "成功取得文章列表",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "rotterdam-windmill" },
                        title: { type: "string", example: "荷蘭｜鹿特丹小孩堤坊與白色風車" },
                        date: { type: "string", format: "date", example: "2024-07-09" },
                        description: { type: "string", example: "萊登到鹿特丹，初訪小孩堤坊的多重風車群，騎單車、拍照片與搭公車的日常。" },
                        cover: { type: "string", format: "uri", example: "https://live.staticflickr.com/65535/53976641147_443bbea667_b.jpg" },
                        category: { type: "string", enum: ["trips", "essays"], example: "trips" },
                        tags: { type: "array", items: { type: "string" }, example: ["歐洲", "荷蘭", "鹿特丹", "風車"] },
                        city: { type: "string", example: "鹿特丹" },
                        country: { type: "string", example: "荷蘭" },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "日期格式錯誤（需為 YYYY-MM-DD）",
              content: {
                "application/json": {
                  schema: { type: "object", properties: { error: { type: "string" }, status: { type: "integer" } } },
                  example: { error: "published_after 格式錯誤，請使用 YYYY-MM-DD", status: 400 },
                },
              },
            },
            404: {
              description: "查無符合條件的文章",
              content: {
                "application/json": {
                  schema: { type: "object", properties: { error: { type: "string" }, status: { type: "integer" } } },
                  example: { error: "查無符合條件的文章", status: 404 },
                },
              },
            },
            500: {
              description: "伺服器錯誤",
              content: {
                "application/json": {
                  schema: { type: "object", properties: { error: { type: "string" }, status: { type: "integer" } } },
                  example: { error: "Failed to fetch posts", status: 500 },
                },
              },
            },
          },
        },
      },
      "/api/photos": {
        get: {
          summary: "取得所有圖庫列表",
          description: "返回所有已發佈圖庫（Status != Draft）的摘要清單",
          tags: ["Photos"],
          parameters: [
            {
              in: "query",
              name: "limit",
              schema: { type: "integer" },
              description: "限制回傳筆數（預設：全部）",
            },
            {
              in: "query",
              name: "sort",
              schema: { type: "string", enum: ["newest", "oldest"] },
              description: "依發布日期排序（預設：newest）",
            },
            {
              in: "query",
              name: "country",
              schema: { type: "string" },
              description: "篩選國家（需完全符合，例如：香港）",
            },
            {
              in: "query",
              name: "published_after",
              schema: { type: "string", format: "date" },
              description: "篩選發布日期在此日期之後（含），格式 YYYY-MM-DD",
            },
            {
              in: "query",
              name: "published_before",
              schema: { type: "string", format: "date" },
              description: "篩選發布日期在此日期之前（含），格式 YYYY-MM-DD",
            },
          ],
          responses: {
            200: {
              description: "成功取得圖庫列表",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "Hong-Kong2022" },
                        title: { type: "string", example: "2024 香港" },
                        date: { type: "string", format: "date", example: "2023-02-28" },
                        description: { type: "string", example: "香港・香港" },
                        cover: { type: "string", format: "uri", example: "https://live.staticflickr.com/65535/54647286995_3b2fc393f0_b.jpg" },
                        category: { type: "string", enum: ["photos"], example: "photos" },
                        tags: { type: "array", items: { type: "string" }, example: ["攝影", "香港"] },
                        city: { type: "string", example: "香港" },
                        country: { type: "string", example: "中國" },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "日期格式錯誤（需為 YYYY-MM-DD）",
              content: {
                "application/json": {
                  schema: { type: "object", properties: { error: { type: "string" }, status: { type: "integer" } } },
                  example: { error: "published_after 格式錯誤，請使用 YYYY-MM-DD", status: 400 },
                },
              },
            },
            404: {
              description: "查無符合條件的圖庫",
              content: {
                "application/json": {
                  schema: { type: "object", properties: { error: { type: "string" }, status: { type: "integer" } } },
                  example: { error: "查無符合條件的圖庫", status: 404 },
                },
              },
            },
            500: {
              description: "伺服器錯誤",
              content: {
                "application/json": {
                  schema: { type: "object", properties: { error: { type: "string" }, status: { type: "integer" } } },
                  example: { error: "Failed to fetch photos", status: 500 },
                },
              },
            },
          },
        },
      },
    },
  },
  // apis: [path.join(process.cwd(), "src/app/api/**/*.js")],
  // 備註：Vercel 部署後原始碼不存在於執行環境，glob 掃描會失敗。
  // 若未來改用其他能讀取原始檔案的部署環境，可移除上方 paths 定義，改回啟用此行。

  // swagger-jsdoc 需要 apis 欄位存在，不能完全省略，否則會報錯。
  // 給空陣列 [] 的意思是「不掃描任何檔案」，讓 swagger-jsdoc 只讀 definition 裡直接定義的 paths。
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
