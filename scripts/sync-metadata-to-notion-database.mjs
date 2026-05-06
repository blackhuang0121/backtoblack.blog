// repo → Notion：將 posts/*.md 和 galleries.json 的 metadata 同步回 Notion Database
// 只同步 draft=false 的已發佈內容；存在則更新，不存在則新增

import { Client } from '@notionhq/client';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 支援單一 DB（NOTION_DATABASE_ID）或分開的 Posts/Photos DB
const POSTS_DB_ID = process.env.NOTION_POSTS_DB_ID || process.env.NOTION_DATABASE_ID;
const PHOTOS_DB_ID = process.env.NOTION_PHOTOS_DB_ID || process.env.NOTION_DATABASE_ID;

if (!process.env.NOTION_API_KEY) {
    console.error('❌ 缺少 NOTION_API_KEY 環境變數');
    process.exit(1);
}
if (!POSTS_DB_ID || !PHOTOS_DB_ID) {
    console.error('❌ 缺少 Notion Database ID（NOTION_DATABASE_ID 或 NOTION_POSTS_DB_ID / NOTION_PHOTOS_DB_ID）');
    process.exit(1);
}

// 從 Notion Database 取得所有 pages，回傳 { id → pageId } map
async function buildIdMap(dbId) {
    const map = {};
    let cursor;
    do {
        const resp = await notion.databases.query({
            database_id: dbId,
            start_cursor: cursor,
        });
        for (const page of resp.results) {
            const id = page.properties['ID']?.rich_text?.[0]?.plain_text;
            if (id) map[id] = page.id;
        }
        cursor = resp.has_more ? resp.next_cursor : null;
    } while (cursor);
    return map;
}

// 建立 Post 的 Notion properties
function buildPostProperties(meta, id) {
    const props = {
        'Title': { title: [{ text: { content: meta.title || '' } }] },
        'ID': { rich_text: [{ text: { content: id } }] },
        'Category': meta.category ? { select: { name: meta.category } } : { select: null },
        'Tags': { multi_select: (meta.tags || []).map(t => ({ name: t })) },
        'Description': { rich_text: [{ text: { content: meta.description || '' } }] },
        'Type': { select: { name: 'Post' } },
    };
    if (meta.date) props['Publish Date'] = { date: { start: meta.date } };
    if (meta.travel_date) props['Travel Date'] = { date: { start: meta.travel_date } };
    if (meta.city) props['City'] = { select: { name: meta.city } };
    if (meta.country) props['Country'] = { select: { name: meta.country } };
    if (meta.cover) props['Cover'] = { url: meta.cover };
    return props;
}

// 建立 Photo 的 Notion properties
function buildPhotoProperties(gallery) {
    const imagesJson = JSON.stringify(gallery.images || []);
    // Notion rich_text 單一 block 上限 2000 字，超出則截斷
    const imagesContent = imagesJson.length > 1990
        ? imagesJson.substring(0, 1990) + '…'
        : imagesJson;

    const props = {
        'Title': { title: [{ text: { content: gallery.title || '' } }] },
        'ID': { rich_text: [{ text: { content: gallery.id } }] },
        'Category': gallery.category ? { select: { name: gallery.category } } : { select: null },
        'Tags': { multi_select: (gallery.tags || []).map(t => ({ name: t })) },
        'Description': { rich_text: [{ text: { content: gallery.description || '' } }] },
        'Images': { rich_text: [{ text: { content: imagesContent } }] },
        'Type': { select: { name: 'Photo' } },
    };
    if (gallery.date) props['Publish Date'] = { date: { start: gallery.date } };
    if (gallery.travel_date) props['Travel Date'] = { date: { start: gallery.travel_date } };
    if (gallery.city) props['City'] = { select: { name: gallery.city } };
    if (gallery.country) props['Country'] = { select: { name: gallery.country } };
    if (gallery.cover) props['Cover'] = { url: gallery.cover };
    return props;
}

// 更新現有 Notion page
async function updatePage(pageId, properties) {
    await notion.pages.update({ page_id: pageId, properties });
}

// 新增 Notion page
async function createPage(dbId, properties) {
    await notion.pages.create({
        parent: { database_id: dbId },
        properties,
    });
}

// 同步所有 Posts
async function syncPosts(idMap) {
    const postsDir = './posts';
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    console.log(`\n📝 處理 Posts (${files.length} 個)`);

    let updated = 0, added = 0, skipped = 0, errored = 0;

    for (const file of files) {
        const id = path.basename(file, '.md');
        try {
            const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
            const { data: meta } = matter(content);

            if (meta.draft !== false) {
                console.log(`⏭️  跳過草稿: ${id}`);
                skipped++;
                continue;
            }

            const properties = buildPostProperties(meta, id);

            if (idMap[id]) {
                await updatePage(idMap[id], properties);
                console.log(`✏️  更新: ${id}`);
                updated++;
            } else {
                await createPage(POSTS_DB_ID, properties);
                console.log(`➕ 新增: ${id}`);
                added++;
            }
        } catch (err) {
            console.error(`❌ 失敗: ${id} — ${err.message}`);
            errored++;
        }
    }

    return { updated, added, skipped, errored };
}

// 同步所有 Photos
async function syncPhotos(idMap) {
    const galleriesPath = './src/app/photos/data/galleries.json';
    const galleries = JSON.parse(fs.readFileSync(galleriesPath, 'utf-8'));
    console.log(`\n🖼️  處理 Photos (${galleries.length} 個)`);

    let updated = 0, added = 0, skipped = 0, errored = 0;

    for (const gallery of galleries) {
        try {
            if (gallery.draft !== false) {
                console.log(`⏭️  跳過草稿: ${gallery.id}`);
                skipped++;
                continue;
            }

            const properties = buildPhotoProperties(gallery);

            if (idMap[gallery.id]) {
                await updatePage(idMap[gallery.id], properties);
                console.log(`✏️  更新: ${gallery.id}`);
                updated++;
            } else {
                await createPage(PHOTOS_DB_ID, properties);
                console.log(`➕ 新增: ${gallery.id}`);
                added++;
            }
        } catch (err) {
            console.error(`❌ 失敗: ${gallery.id} — ${err.message}`);
            errored++;
        }
    }

    return { updated, added, skipped, errored };
}

async function main() {
    console.log('🔄 開始同步 repo 內容到 Notion Database...');

    // 取得現有 Notion pages
    const postsMap = await buildIdMap(POSTS_DB_ID);
    const photosMap = PHOTOS_DB_ID === POSTS_DB_ID ? postsMap : await buildIdMap(PHOTOS_DB_ID);

    const postTotal = Object.keys(postsMap).length;
    const photoTotal = PHOTOS_DB_ID === POSTS_DB_ID
        ? '（共用同一 Database）'
        : `${Object.keys(photosMap).length} pages`;

    console.log(`📋 Notion Posts Database: ${postTotal} pages`);
    console.log(`📋 Notion Photos Database: ${photoTotal}`);

    const postResult = await syncPosts(postsMap);
    const photoResult = await syncPhotos(photosMap);

    console.log('\n' + '='.repeat(50));
    console.log('📊 執行結果：');
    console.log(`   📝 Post  — 更新：${postResult.updated} | 新增：${postResult.added} | 跳過：${postResult.skipped} | 失敗：${postResult.errored}`);
    console.log(`   🖼️  Photo — 更新：${photoResult.updated} | 新增：${photoResult.added} | 跳過：${photoResult.skipped} | 失敗：${photoResult.errored}`);
    console.log('='.repeat(50));
    console.log('\n✅ 同步完成');
}

main().catch(err => {
    console.error('❌ 錯誤:', err.message);
    process.exit(1);
});
