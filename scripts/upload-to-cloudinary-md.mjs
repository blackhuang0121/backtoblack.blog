// 批次壓縮照片+上傳 Cloudinary+建立新 Markdown 文章

import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// 從命令行參數獲取 post_id
const postId = process.argv[2];
if (!postId) {
  console.error('❌ 用法：node scripts/upload-to-cloudinary-md.mjs <post_id>');
  console.error('   例如：node scripts/upload-to-cloudinary-md.mjs paris');
  process.exit(1);
}

const srcDir = `/Users/e0121n/Pictures/Fujifilm/${postId}_selected`;           // 精選圖資料夾
const outDir = `/Users/e0121n/Pictures/Fujifilm/${postId}_selected_compressed`;       // 壓縮資料夾
const resizeWidth = 1920;
const jpegQuality = 80;
const cloudFolder = postId;               // Cloudinary 目錄
const markdownPath = `./posts/${postId}.md`; // Markdown 文章檔案

// 檢查圖片資料夾是否存在
if (!fs.existsSync(srcDir)) {
  console.error(`❌ 找不到圖片資料夾：${srcDir}`);
  process.exit(1);
}

// 檢查 markdown 檔案是否存在
if (!fs.existsSync(markdownPath)) {
  console.error(`❌ 找不到 markdown 檔案：${markdownPath}`);
  console.error('   請先執行：node scripts/create-markdown.mjs <post_id>');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 讀取並解析現有 markdown 的 frontmatter
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

async function compressUploadAndGenerateMarkdown() {
  // 讀取現有的 frontmatter 和 body
  const { meta: postMeta, body: existingBody } = readAndParseFrontmatter(markdownPath);
  
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const files = fs.readdirSync(srcDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  const imageMarkdowns = [];
  let firstImageUrl = '';

  console.log(`📤 開始處理 ${postId}...`);
  console.log(`找到 ${files.length} 張圖片`);

  for (const [i, file] of files.entries()) {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(outDir, file.replace(/\.(JPG|JPEG|PNG)$/i, '.jpg'));

    // 1. 壓縮
    try {
      await sharp(inputPath)
        .rotate()
        .resize({ width: resizeWidth, height: resizeWidth, fit: 'inside' })
        .jpeg({ quality: jpegQuality })
        .toFile(outputPath);
      console.log(`  ✓ 壓縮完成 (${i + 1}/${files.length})`);
    } catch (err) {
      console.error(`  ✗ 壓縮失敗: ${inputPath}`, err.message);
      continue;
    }

    // 2. 上傳 Cloudinary
    let imgUrl = '';
    try {
      const result = await cloudinary.uploader.upload(outputPath, {
        folder: cloudFolder,
        public_id: path.parse(file).name,
        tags: postMeta.tags,
        context: {
          alt: file,
          caption: file
        }
      });
      imgUrl = result.secure_url;
      console.log(`  ✓ 上傳完成: ${imgUrl.substring(0, 60)}...`);
      // 第一張圖當 cover
      if (i === 0) firstImageUrl = imgUrl;
    } catch (e) {
      console.error(`  ✗ 上傳失敗: ${outputPath}`, e.message);
      continue;
    }

    // 3. 產生 markdown 語法
    imageMarkdowns.push(`![${file}](${imgUrl})`);
  }

  // 4. 更新 meta.cover（如果有新圖片）
  if (firstImageUrl) {
    postMeta.cover = firstImageUrl;
    console.log(`✓ 更新 cover: ${firstImageUrl.substring(0, 60)}...`);
  }

  // 5. 產生 YAML frontmatter
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

  // 6. 合併 markdown 文章（保持現有內文 + 追加圖片）
  const newMarkdown = postMetaToYaml(postMeta) +
    existingBody +
    imageMarkdowns.join('\n') + '\n';

  fs.writeFileSync(markdownPath, newMarkdown);
  console.log(`✓ Markdown 文章已更新: ${markdownPath}`);
}

compressUploadAndGenerateMarkdown();
