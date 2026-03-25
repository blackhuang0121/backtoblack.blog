// 從 Notion 讀取 metadata，建立 Post Markdown 或 Photo JSON

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Notion API 設定
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });
const databaseId = process.env.NOTION_DATABASE_ID;

async function createMarkdown() {
    const postId = process.argv[2];  // 現在是可選參數

    try {
        // 用 REST API 查詢 database
        const queryUrl = `https://api.notion.com/v1/databases/${databaseId}/query`;
        const queryResponse = await fetch(queryUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const queryData = await queryResponse.json();

        if (!queryResponse.ok) {
            console.error('❌ 無法連接到 database:', queryData);
            process.exit(1);
        }

        console.log('✅ 成功連接到 database:', databaseId);

        const allPages = queryData.results;

        // 篩選 Status = Draft 的 pages（如果有指定 postId 則再篩選）
        const draftPages = allPages.filter(p => {
            const pageStatus = p.properties['Status']?.status?.name;
            const pagePostId = p.properties['ID']?.rich_text?.[0]?.plain_text;

            // 如果有指定 postId，則必須同時符合 Status=Draft 和 Post ID
            if (postId) {
                return pageStatus === 'Draft' && pagePostId === postId;
            }
            // 沒指定 postId，只要 Status=Draft 就符合
            return pageStatus === 'Draft';
        });

        console.log(`\n📋 找到 ${draftPages.length} 筆 Status=Draft 的資料（總共 ${allPages.length} 筆）：`);
        draftPages.forEach((page, index) => {
            const postIdValue = page.properties['ID']?.rich_text?.[0]?.plain_text || '(無)';
            const titleValue = page.properties['Title']?.title?.[0]?.plain_text || '(無標題)';
            console.log(`  ${index + 1}. ID: "${postIdValue}" | Title: "${titleValue}"`);
        });

        if (draftPages.length === 0) {
            console.error(`\n❌ 找不到 Status=Draft 的資料${postId ? ` (ID: ${postId})` : ''}`);
            process.exit(1);
        }

        // 批次建立檔案
        let postCreated = 0, postSkipped = 0, postError = 0;
        let photoCreated = 0, photoSkipped = 0, photoError = 0;

        console.log('\n🚀 開始處理資料...\n');

        for (const page of draftPages) {
            try {
                const properties = page.properties;
                const pagePostId = properties['ID']?.rich_text?.[0]?.plain_text;
                const pageType = properties['Type']?.select?.name;

                if (!pagePostId) {
                    console.warn(`⚠️  跳過：沒有 ID 的資料`);
                    if (pageType === 'Post') postSkipped++;
                    else if (pageType === 'Photo') photoSkipped++;
                    continue;
                }

                // 根據 Type 決定處理方式
                if (pageType === 'Post') {
                    const result = await createPostMarkdown(page, pagePostId);
                    if (result === 'created') postCreated++;
                    else if (result === 'skipped') postSkipped++;
                    else if (result === 'error') postError++;
                } else if (pageType === 'Photo') {
                    const result = await updatePhotoJson(page, pagePostId);
                    if (result === 'created') photoCreated++;
                    else if (result === 'skipped') photoSkipped++;
                    else if (result === 'error') photoError++;
                } else {
                    console.warn(`⚠️  跳過：未知的 Type "${pageType}"`);
                }
            } catch (error) {
                console.error(`❌ 處理失敗：${error.message}`);
            }
        }

        // 顯示統計結果
        console.log('\n' + '='.repeat(50));
        console.log(`📊 執行結果：`);
        console.log(`   📝 Post - 成功：${postCreated} | 跳過：${postSkipped} | 失敗：${postError}`);
        console.log(`   📷 Photo - 成功：${photoCreated} | 跳過：${photoSkipped} | 失敗：${photoError}`);
        console.log('='.repeat(50));

        if (postCreated > 0 || photoCreated > 0) {
            console.log('\n✨ 準備就緒！可以開始編輯了');
        }
    } catch (error) {
        console.error('❌ 錯誤:', error.message);
        process.exit(1);
    }
}

// 建立 Post Markdown
async function createPostMarkdown(page, pagePostId) {
    try {
        const properties = page.properties;
        const title = properties['Title']?.title?.[0]?.plain_text || properties['Name']?.title?.[0]?.plain_text || '無標題';
        const category = properties['Category']?.select?.name || '';
        const tags = properties['Tags']?.multi_select?.map(t => t.name) || [];
        const date = properties['Publish Date']?.date?.start || new Date().toISOString().split('T')[0];
        const description = properties['Description']?.rich_text?.[0]?.plain_text || '';
        const status = properties['Status']?.status?.name || 'Draft';
        const travelDate = properties['Travel Date']?.date?.start || '';
        const city = properties['City']?.select?.name || '';
        const country = properties['Country']?.select?.name || '';

        // 檢查 markdown 是否存在
        const markdownPath = `./posts/${pagePostId}.md`;
        if (fs.existsSync(markdownPath)) {
            console.log(`⚠️  跳過 Post：${markdownPath} 已存在`);
            return 'skipped';
        }

        // 讀取 Notion 頁面大綱
        const pageContent = await fetchPageContent(page.id);

        // 生成 frontmatter
        const frontmatter = generateFrontmatter({
            title,
            draft: status === 'Draft',
            date,
            travel_date: travelDate,
            cover: '',
            description,
            category,
            tags,
            city,
            country
        });

        const markdown = frontmatter + pageContent;

        fs.writeFileSync(markdownPath, markdown);
        console.log(`✅ 已建立 Post：${markdownPath} - ${title}`);
        return 'created';
    } catch (error) {
        console.error(`❌ 建立 Post 失敗：${error.message}`);
        return 'error';
    }
}

// 更新 Photo JSON
async function updatePhotoJson(page, pagePostId) {
    try {
        const properties = page.properties;
        const title = properties['Title']?.title?.[0]?.plain_text || '無標題';
        const description = properties['Description']?.rich_text?.[0]?.plain_text || '';
        const date = properties['Publish Date']?.date?.start || new Date().toISOString().split('T')[0];
        const travelDate = properties['Travel Date']?.date?.start || '';
        const tags = properties['Tags']?.multi_select?.map(t => t.name) || [];
        const city = properties['City']?.select?.name || '';
        const country = properties['Country']?.select?.name || '';
        const status = properties['Status']?.status?.name || 'Draft';

        // 讀取現有 galleries.json
        const galleriesPath = './src/app/photos/data/galleries.json';
        let galleries = [];
        
        if (fs.existsSync(galleriesPath)) {
            const content = fs.readFileSync(galleriesPath, 'utf-8');
            galleries = JSON.parse(content);
        }

        // 檢查是否已存在
        const existingIndex = galleries.findIndex(g => g.id === pagePostId);
        if (existingIndex !== -1) {
            console.log(`⚠️  跳過 Photo："${pagePostId}" 已存在於 galleries.json`);
            return 'skipped';
        }

        // 新增 Photo 資料（比照現有結構）
        galleries.push({
            id: pagePostId,
            title: title,
            draft: status === 'Draft',
            date: date,
            travel_date: travelDate,
            cover: '',  // 之後由圖片上傳 script 設定（第一張圖片）
            description: description,
            category: 'photos',
            tags: tags,
            city: city,
            country: country,
            images: []  // 之後由圖片上傳 script 填入
        });

        // 確保目錄存在
        const dir = './src/app/photos/data';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(galleriesPath, JSON.stringify(galleries, null, 2));
        console.log(`✅ 已新增 Photo：${pagePostId} - ${title}`);
        return 'created';
    } catch (error) {
        console.error(`❌ 更新 Photo JSON 失敗：${error.message}`);
        return 'error';
    }
}

function generateFrontmatter(meta) {
    let yaml = '---\n';
    for (const [k, v] of Object.entries(meta)) {
        if (Array.isArray(v)) {
            // 過濾掉空字串，確保空陣列輸出 []
            const filtered = v.filter(e => e && e.trim() !== '');
            yaml += `${k}: [${filtered.map(e => `"${e}"`).join(', ')}]\n`;
        } else if (typeof v === 'boolean') {
            yaml += `${k}: ${v}\n`;
        } else {
            yaml += `${k}: "${v}"\n`;
        }
    }
    yaml += '---\n';
    return yaml;
}

// 讀取 Notion 頁面大綱並轉換成 Markdown
async function fetchPageContent(pageId) {
    try {
        const mdblocks = await n2m.pageToMarkdown(pageId);
        const mdString = n2m.toMarkdownString(mdblocks);
        return mdString.parent || '\n## 標題\n\n文章內文從這裡開始編輯\n\n';
    } catch (error) {
        return '\n## 標題\n\n文章內文從這裡開始編輯\n\n';
    }
}

createMarkdown().catch(console.error);
