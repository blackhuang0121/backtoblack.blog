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

### notion-database-sync.mjs
從 Notion 同步 Status=Draft 的項目到本地

```bash
npm run notion-sync                  # 同步所有 Draft（Post → .md, Photo → galleries.json）
npm run notion-sync -- <id>          # 只同步指定 ID
```

> `--` 是 npm 的分隔符，後面的參數會傳給 script（等同 `node scripts/notion-database-sync.mjs <id>`）。
> `<id>` 對應 Notion 頁面的 **ID 欄位**，與本機資料夾名稱無關。

- Post 類型 → 建立 `posts/<id>.md`（含 frontmatter）
- Photo 類型 → 新增一筆到 `src/app/photos/data/galleries.json`
- 檔案已存在時會跳過（不覆蓋）

### cloudinary-sync.mjs
壓縮圖片 → 上傳 Cloudinary → 更新文件

```bash
npm run cloudinary-sync -- <id>                    # 使用 <id>_selected 資料夾
npm run cloudinary-sync -- <id> <folderName>       # 使用 <folderName>_selected（共用照片）
```

- 圖片來源：`~/Pictures/Blog/<folderName>_selected/`
- 壓縮輸出：`~/Pictures/Blog/Creatives/<folderName>_selected_compressed/`
- 自動判斷 Post / Photo，分別更新 `.md` 或 `galleries.json`
- 第一張圖自動設為 `cover`

### sync-metadata-to-gsheet.cjs
同步元數據到 Google Sheets（由 GitHub Actions 自動觸發，通常不需手動執行）

Content pipeline: **Notion → `posts/` or `galleries.json` → Cloudinary → Next.js build**

## Environment Variables (`.env`, not committed)
- `CLOUDINARY_*` — image CDN credentials
- `NOTION_*` — Notion API key + database ID

## Branch Strategy

### Long-term Branches (persistent)
- **`main`** — Production-ready code, merged from `dev` periodically
- **`dev`** — Development & infrastructure work (reusable across tasks)
- **`content`** — Blog posts & photo galleries (reusable across tasks)

### Short-term Feature Branches
- **`feature/*`** — Single feature per branch (e.g., `feature/dark-mode`)
- Each feature branch → PR to `main` → delete after merge

### Worktree Workflow (Claude + dev)
- Each development task: create new worktree from `dev` → work → PR to `dev` → delete worktree
- Content tasks: create new worktree from `content` → work → PR to `content` → delete worktree
- Feature work: create new worktree from main → work → PR to `main` → delete worktree

## Git Collaboration Workflow
- Always work in a dedicated Claude branch created via worktree (e.g., `claude/vibrant-pare`)
- Workflow: `git add .` → `git commit` → `git push origin [branch]` → Create PR to **target branch** (`dev`, `content`, or `main`)
- **Never push directly to any protected branch** — all changes go through PR review
- This ensures clear commit history and gives you opportunity to review changes before merge
- After merge, the worktree and its branch are deleted

## Collaboration

`Cowork.md` 是 Cowork session 與 Code session 的任務交接文件。
每次 Code session 開始時，請先讀取 `Cowork.md`，確認是否有待執行的任務，完成後將任務移至「已完成」區塊。

## Key Conventions
- Traditional Chinese (繁體中文) content
- Images served from Cloudinary (`res.cloudinary.com`) — Flickr is being phased out
- `draft: true` in frontmatter = excluded from build
- Path alias `@/*` maps to `src/*`
- Always respond in Traditional Chinese (繁體中文)
