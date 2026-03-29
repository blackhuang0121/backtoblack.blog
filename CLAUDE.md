# backtoblack.blog — Project Context

## Tech Stack
- **Next.js 15** (App Router, SSG) + **React 19** + **Tailwind CSS 4**
- Deployed on **Vercel**
- No TypeScript — plain JavaScript throughout

## Project Structure
```
src/
  app/
    page.js                    # Homepage
    posts/[slug]/page.js       # Individual post
    category/[category]/page.js
    photos/[gallery]/page.js
    photos/data/galleries.json # All photo gallery data (~1600 lines)
  components/                  # Shared React components
posts/                         # Markdown blog posts (YAML frontmatter + content)
scripts/                       # Automation scripts (see below)
public/img/                    # Local images (pre-upload)
```

## Content Types

### Blog Posts (`posts/*.md`)
YAML frontmatter fields: `title`, `draft`, `date`, `travel_date`, `cover`, `description`, `category`, `tags`, `city`, `country`

Categories: `trips` | `essays`

### Photo Galleries (`src/app/photos/data/galleries.json`)
Each entry has: `id`, `title`, `date`, `travel_date`, `cover`, `description`, `category`, `tags`, `city`, `country`, `images[]`

Category: `photos`

## Automation Scripts

| Script                        | Purpose                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| `notion-database-sync.mjs`    | Notion DB → Markdown posts or gallery JSON                                  |
| `cloudinary-sync.mjs`         | Compress images (Sharp) → upload to Cloudinary → update markdown/JSON URLs  |
| `sync-metadata-to-gsheet.cjs` | Post metadata → Google Sheets (triggered by GitHub Actions on push to main) |

Content pipeline: **Notion → `posts/` or `galleries.json` → Cloudinary → Next.js build**

## Environment Variables (`.env`, not committed)
- `CLOUDINARY_*` — image CDN credentials
- `NOTION_*` — Notion API key + database ID

## Key Conventions
- Traditional Chinese (繁體中文) content
- Images served from Cloudinary (`res.cloudinary.com`) — Flickr is being phased out
- `draft: true` in frontmatter = excluded from build
- Path alias `@/*` maps to `src/*`
- Always respond in Traditional Chinese (繁體中文)
