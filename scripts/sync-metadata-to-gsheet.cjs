// 分成多個工作表，且欄位、排序、分類過濾
// fs file system 讀取、寫入、編輯、刪除資料
// path 處理檔案路徑字串
// gray-matter 把 markdown 上面的 --- metadata 區塊抓出來，轉成 JS 物件。

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { google } = require('googleapis');

async function authorize() {
    const credentials = JSON.parse(process.env.GOOGLE_SHEET_CREDENTIALS);
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
    const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        scopes
    );
    return google.sheets({ version: 'v4', auth });
}

// 解析所有 Markdown frontmatter
function getPostsMeta(postsDir) {
    return fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.md'))
        .map(file => {
            const filePath = path.join(postsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(content);
            data.filename = file;
            data.id = file.replace(/\.md$/, ''); // 去掉 .md 當作 id（slug）
            return data;
        });
}

function getPhotosMeta(filePath) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (Array.isArray(json)) {
        json.forEach(obj => {
            obj.filename = path.basename(filePath);
            if (!obj.title && obj.id) obj.title = obj.id;
        });
        return json;
    }
    json.filename = path.basename(filePath);
    if (!json.title && json.id) {
        json.title = json.id;
    }
    return [json]; // 保持回傳 array 型別
}
// 將物件陣列轉成 Sheet 二維陣列
function toSheetRows(dataArr, columns) {
    if (!dataArr.length) return [];
    const keys = columns ? columns : Object.keys(dataArr[0]);
    const rows = dataArr.map(obj => keys.map(k => {
        const val = obj[k];
        if (Array.isArray(val)) return val.join(',');
        return val ?? "";
    }));
    return [keys, ...rows];
}

function sortByDateAsc(dataArr) {
    return [...dataArr].sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
    });
}

async function updateSheet(sheet, sheetId, sheetName, values) {
    // 先清空再寫入
    await sheet.spreadsheets.values.clear({
        spreadsheetId: sheetId,
        range: sheetName
    });
    await sheet.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: sheetName,
        valueInputOption: "RAW",
        resource: { values }
    });
}

async function main() {
    // Debug: 印出 credentials 的所有 key（不會印出 value，安全！）
    try {
        const debugCredentials = JSON.parse(process.env.GOOGLE_SHEET_CREDENTIALS);
        console.log('[Debug] credentials keys:', Object.keys(debugCredentials));
    } catch (e) {
        console.error('[Debug] GOOGLE_SHEET_CREDENTIALS parse failed', e);
        process.exit(1);
    }

    const posts = getPostsMeta('./posts');
    const photos = getPhotosMeta('./src/app/photos/data/galleries.json');

    // 欄位定義
    const postCols = ['title', 'draft', 'date', 'travel_date', 'category', 'tags', 'country', 'city', 'filename'];
    const photoCols = ['id', ...postCols];
    const allCols = ['id', ...postCols, 'type'];

    // 資料準備
    const postsSorted = sortByDateAsc(posts);
    const photosSorted = sortByDateAsc(photos);
    const postsRows = toSheetRows(postsSorted, postCols);
    const photosRows = toSheetRows(photosSorted, photoCols);

    // all 表
    const postsWithType = postsSorted.map(post => ({ ...post, type: 'post' }));
    const photosWithType = photosSorted.map(photo => ({ ...photo, type: 'photo' }));
    const allRows = toSheetRows(sortByDateAsc([...postsWithType, ...photosWithType]), allCols);

    const SHEET_ID = process.env.SHEET_ID;
    const sheet = await authorize();

    // 只需寫入一次
    await updateSheet(sheet, SHEET_ID, 'All', allRows);
    await updateSheet(sheet, SHEET_ID, 'Posts', postsRows);
    await updateSheet(sheet, SHEET_ID, 'Photos', photosRows);

    console.log('已同步 All、Posts、Photos 三個工作表！');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
