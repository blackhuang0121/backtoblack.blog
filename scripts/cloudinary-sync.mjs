// 壓縮圖片 + 上傳 Cloudinary + 更新 Post Markdown 或 Photo JSON

import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// 解析命令行參數
const contentId = process.argv[2]; // id（對應 Notion 的 ID 欄位）
const folderName = process.argv[3]; // 可選：自訂資料夾名稱（不含 _selected 後綴）

if (!contentId) {
  console.error('❌ 用法：node scripts/cloudinary-sync.mjs <id> [folder_name]');
  console.error('   例如：node scripts/cloudinary-sync.mjs paris');
  console.error('   例如：node scripts/cloudinary-sync.mjs porto_guide porto_2025  (共用照片)');
  process.exit(1);
}

// 自動判斷 type（檢查 markdown 或 galleries.json）
let type = null;
const markdownPath = `./posts/${contentId}.md`;
const galleriesPath = './src/app/photos/data/galleries.json';

if (fs.existsSync(markdownPath)) {
  type = 'post';
} else if (fs.existsSync(galleriesPath)) {
  // 檢查 galleries.json 是否有該 ID
  const galleries = JSON.parse(fs.readFileSync(galleriesPath, 'utf-8'));
  if (galleries.find(g => g.id === contentId)) {
    type = 'photo';
  }
}

if (!type) {
  console.error(`❌ 找不到 ID="${contentId}" 的 Post 或 Photo`);
  console.error('   請先執行：node scripts/notion-database-sync.mjs');
  process.exit(1);
}

// 圖片資料夾設定
// 如果有指定 folderName，使用它；否則使用 contentId
const actualFolderName = folderName || contentId;
const srcDir = `/Users/e0121n/Pictures/Blog/${actualFolderName}_selected`;
const outDir = `/Users/e0121n/Pictures/Blog/Creatives/${actualFolderName}_selected_compressed`;
const resizeWidth = 1920;
const jpegQuality = 80;
const cloudFolder = contentId; // Cloudinary 資料夾名稱

// 檢查圖片資料夾是否存在
if (!fs.existsSync(srcDir)) {
  console.error(`❌ 找不到圖片資料夾：${srcDir}`);
  process.exit(1);
}

// Cloudinary 設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 主函數
async function syncCloudinary() {
  console.log(`\n🚀 開始處理 ${type}: ${contentId}\n`);

  if (type === 'post') {
    await syncPostImages();
  } else if (type === 'photo') {
    await syncPhotoImages();
  }
}

// ========================================
// Post 處理：壓縮 → 上傳 → 更新 Markdown
// ========================================
async function syncPostImages() {
  const markdownPath = `./posts/${contentId}.md`;

  // 檢查 markdown 檔案是否存在
  if (!fs.existsSync(markdownPath)) {
    console.error(`❌ 找不到 markdown 檔案：${markdownPath}`);
    console.error('   請先執行：node scripts/notion-database-sync.mjs');
    process.exit(1);
  }

  // 讀取現有 frontmatter 和 body
  const { meta: postMeta, body: existingBody } = readAndParseFrontmatter(markdownPath);

  // 準備壓縮資料夾
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  const imageMarkdowns = [];
  let firstImageUrl = '';

  console.log(`📸 找到 ${files.length} 張圖片\n`);

  for (const [i, file] of files.entries()) {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(outDir, file.replace(/\.(JPG|JPEG|PNG)$/i, '.jpg'));

    // 1. 壓縮圖片
    try {
      await sharp(inputPath)
        .rotate() // 自動根據 EXIF 校正方向
        .resize({ width: resizeWidth, height: resizeWidth, fit: 'inside' })
        .jpeg({ quality: jpegQuality })
        .toFile(outputPath);
      console.log(`  ✓ [${i + 1}/${files.length}] 壓縮完成: ${file}`);
    } catch (err) {
      console.error(`  ✗ [${i + 1}/${files.length}] 壓縮失敗: ${file}`, err.message);
      continue;
    }

    // 2. 上傳到 Cloudinary
    let imgUrl = '';
    try {
      const result = await cloudinary.uploader.upload(outputPath, {
        folder: cloudFolder,
        public_id: path.parse(file).name,
        tags: postMeta.tags || [],
        context: {
          alt: file,
          caption: file
        }
      });
      imgUrl = result.secure_url;
      console.log(`  ✓ [${i + 1}/${files.length}] 上傳完成: ${imgUrl.substring(0, 60)}...`);

      // 第一張圖當 cover
      if (i === 0) firstImageUrl = imgUrl;
    } catch (e) {
      console.error(`  ✗ [${i + 1}/${files.length}] 上傳失敗: ${file}`, e.message);
      continue;
    }

    // 3. 產生 markdown 圖片語法
    imageMarkdowns.push(`![${file}](${imgUrl})`);
  }

  // 4. 更新 meta.cover（如果有新圖片）
  if (firstImageUrl) {
    postMeta.cover = firstImageUrl;
    console.log(`\n✓ 更新 cover: ${firstImageUrl.substring(0, 60)}...`);
  }

  // 5. 合併 markdown 文章（保持現有內文 + 追加圖片）
  const newMarkdown = postMetaToYaml(postMeta) +
    existingBody +
    '\n' + imageMarkdowns.join('\n\n') + '\n';

  fs.writeFileSync(markdownPath, newMarkdown);
  console.log(`✓ Markdown 文章已更新: ${markdownPath}`);
  console.log(`\n✨ Post "${contentId}" 處理完成！`);
}

// ========================================
// Photo 處理：壓縮 → 上傳 → 更新 JSON
// ========================================
async function syncPhotoImages() {
  const galleriesPath = './src/app/photos/data/galleries.json';

  // 檢查 galleries.json 是否存在
  if (!fs.existsSync(galleriesPath)) {
    console.error(`❌ 找不到 galleries.json：${galleriesPath}`);
    console.error('   請先執行：node scripts/notion-database-sync.mjs');
    process.exit(1);
  }

  // 讀取現有 galleries.json
  let galleries = JSON.parse(fs.readFileSync(galleriesPath, 'utf-8'));

  // 檢查是否存在該 photo
  const photoIndex = galleries.findIndex(g => g.id === contentId);
  if (photoIndex === -1) {
    console.error(`❌ 在 galleries.json 找不到 id="${contentId}" 的相簿`);
    console.error('   請先執行：node scripts/notion-database-sync.mjs');
    process.exit(1);
  }

  const photo = galleries[photoIndex];

  // 準備壓縮資料夾
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  const uploadResults = [];

  console.log(`📸 找到 ${files.length} 張圖片\n`);

  for (const [i, file] of files.entries()) {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(outDir, file.replace(/\.(JPG|JPEG|PNG)$/i, '.jpg'));

    // 1. 壓縮圖片
    try {
      await sharp(inputPath)
        .rotate() // 自動根據 EXIF 校正方向
        .resize({ width: resizeWidth, height: resizeWidth, fit: 'inside' })
        .jpeg({ quality: jpegQuality })
        .toFile(outputPath);
      console.log(`  ✓ [${i + 1}/${files.length}] 壓縮完成: ${file}`);
    } catch (err) {
      console.error(`  ✗ [${i + 1}/${files.length}] 壓縮失敗: ${file}`, err.message);
      continue;
    }

    // 2. 上傳到 Cloudinary
    try {
      const result = await cloudinary.uploader.upload(outputPath, {
        folder: cloudFolder,
        public_id: path.parse(file).name,
        tags: photo.tags || [],
        context: {
          alt: file,
          caption: file
        }
      });
      uploadResults.push({
        src: result.secure_url,
        alt: file
      });
      console.log(`  ✓ [${i + 1}/${files.length}] 上傳完成: ${result.secure_url.substring(0, 60)}...`);
    } catch (e) {
      console.error(`  ✗ [${i + 1}/${files.length}] 上傳失敗: ${file}`, e.message);
      continue;
    }
  }

  // 3. 更新 photo 的 cover 和 images
  if (uploadResults.length > 0) {
    galleries[photoIndex].cover = uploadResults[0].src;
    galleries[photoIndex].images = uploadResults;
    console.log(`\n✓ 更新 cover: ${uploadResults[0].src.substring(0, 60)}...`);
    console.log(`✓ 更新 images: ${uploadResults.length} 張圖片`);
  }

  // 4. 寫回 galleries.json
  fs.writeFileSync(galleriesPath, JSON.stringify(galleries, null, 2));
  console.log(`✓ galleries.json 已更新: ${galleriesPath}`);
  console.log(`\n✨ Photo "${contentId}" 處理完成！`);
}

// ========================================
// 輔助函數：解析 Markdown Frontmatter
// ========================================
function readAndParseFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);

  if (!match) {
    console.error('❌ 無法解析 frontmatter');
    process.exit(1);
  }

  const frontmatterStr = match[1];
  const body = match[2];

  // 簡單的 YAML 解析
  const meta = {};
  frontmatterStr.split('\n').forEach(line => {
    if (!line.trim()) return;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // 處理陣列 [...]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1)
        .split(',')
        .map(v => v.trim().replace(/^"|"$/g, ''));
    } else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else {
      value = value.replace(/^"|"$/g, '');
    }

    meta[key] = value;
  });

  return { meta, body };
}

// ========================================
// 輔助函數：產生 YAML Frontmatter
// ========================================
function postMetaToYaml(m) {
  let yaml = '---\n';
  for (const [k, v] of Object.entries(m)) {
    if (Array.isArray(v)) {
      yaml += `${k}: [${v.map(e => `"${e}"`).join(', ')}]\n`;
    } else if (typeof v === 'boolean') {
      yaml += `${k}: ${v}\n`;
    } else {
      yaml += `${k}: "${v}"\n`;
    }
  }
  yaml += '---\n';
  return yaml;
}

// 執行主函數
syncCloudinary().catch(err => {
  console.error('\n❌ 錯誤:', err.message);
  process.exit(1);
});
