import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "backtoblack.blog API",
      version: "1.0.1",
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
  },
  apis: [path.join(process.cwd(), "src/app/api/**/*.js")],
};

export const swaggerSpec = swaggerJsdoc(options);
