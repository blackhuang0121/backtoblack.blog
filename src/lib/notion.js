import { getCache, setCache } from "./cache.js";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const HEADERS = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

function mapPostPage(page) {
  const p = page.properties;
  return {
    id: p["ID"]?.rich_text[0]?.plain_text || "",
    title: p["Title"]?.title[0]?.plain_text || "",
    date: p["Publish Date"]?.date?.start || "",
    description: p["Description"]?.rich_text[0]?.plain_text || "",
    cover: p["Cover"]?.url || "",
    category: p["Category"]?.select?.name || "",
    tags: p["Tags"]?.multi_select?.map((t) => t.name) || [],
    city: p["City"]?.select?.name || "",
    country: p["Country"]?.select?.name || "",
  };
}

function mapPhotoPage(page) {
  const p = page.properties;
  return {
    id: p["ID"]?.rich_text[0]?.plain_text || "",
    title: p["Title"]?.title[0]?.plain_text || "",
    date: p["Publish Date"]?.date?.start || "",
    description: p["Description"]?.rich_text[0]?.plain_text || "",
    cover: p["Cover"]?.url || "",
    category: "photos",
    tags: p["Tags"]?.multi_select?.map((t) => t.name) || [],
    city: p["City"]?.select?.name || "",
    country: p["Country"]?.select?.name || "",
  };
}

async function queryDatabase(typeFilter) {
  const results = [];
  let cursor;

  do {
    const body = {
      filter: {
        and: [
          { property: "Type", select: { equals: typeFilter } },
          { property: "Status", status: { does_not_equal: "Draft" } },
        ],
      },
      ...(cursor ? { start_cursor: cursor } : {}),
    };

    const res = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      { method: "POST", headers: HEADERS, body: JSON.stringify(body) }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Notion API error: ${err.message}`);
    }

    const data = await res.json();
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  return results;
}

export async function getPostsList() {
  const cached = getCache("posts");
  if (cached) return cached;

  const pages = await queryDatabase("Post");
  const posts = pages.map(mapPostPage);
  setCache("posts", posts);
  return posts;
}

export async function getPhotosList() {
  const cached = getCache("photos");
  if (cached) return cached;

  const pages = await queryDatabase("Photo");
  const photos = pages.map(mapPhotoPage);
  setCache("photos", photos);
  return photos;
}
