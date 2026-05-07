"use client";

import { useEffect } from "react";

export default function ApiDocs() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js";
    script.onload = () => {
      window.SwaggerUIBundle({
        url: "/api/swagger.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [
          window.SwaggerUIBundle.presets.apis,
          window.SwaggerUIBundle.SwaggerUIStandalonePreset,
        ],
        plugins: [window.SwaggerUIBundle.plugins.DownloadUrl],
        layout: "BaseLayout",
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      style={{ minHeight: "100vh", background: "#fff" }}
      id="swagger-ui"
    />
  );
}
