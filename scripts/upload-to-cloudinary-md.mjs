// 批次壓縮照片+上傳 Cloudinary+建立新 Markdown 文章

import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const srcDir = '/Users/e0121n/Pictures/Fujifilm/f1_autralia_grand_prix_2023_selected';           // 精選圖資料夾
const outDir = '/Users/e0121n/Pictures/Fujifilm/f1_autralia_grand_prix_2023_selected_compressed';       // 壓縮資料夾
const resizeWidth = 1920;
const jpegQuality = 80;
const cloudFolder = 'f1_autralia_grand_prix_2023';               // Cloudinary 目錄
const markdownOutput = './posts/f1_autralia_grand_prix_2023.md'; // 輸出 markdown 文章檔案

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// metadata 欄位
const postMeta = {
  title: '荷蘭｜2025 國王節',
  draft: true,
  date: '2025-07-24',
  travel_date: '2023-04-01',
  cover: '', // 等下自動塞第一張圖網址
  description: '從 Netlix F1 紀錄片 Drive to Survive 到親臨現場一睹賽況，夢迴 2023 年 F1 澳洲大獎賽！',
  category: 'trips',
  tags: ['大洋洲', 'Australia', 'Melbourne', 'F1'],
  city: 'Melbourne',
  country: 'Australia'
};

async function compressUploadAndGenerateMarkdown() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const files = fs.readdirSync(srcDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  const imageMarkdowns = [];
  let firstImageUrl = '';

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
      console.log('壓縮完成:', outputPath);
    } catch (err) {
      console.error('壓縮失敗:', inputPath, err);
      continue;
    }

    // 2. 上傳 Cloudinary
    let imgUrl = '';
    try {
      const result = await cloudinary.uploader.upload(outputPath, {
        folder: cloudFolder,
        public_id: path.parse(file).name,
        tags: postMeta.tags, // <== 直接這樣寫，Cloudinary 支援 tags: 陣列
        context: {
          alt: file,
          caption: file
        }
      });
      imgUrl = result.secure_url;
      console.log('已上傳:', imgUrl);
      // 第一張圖當 cover
      if (i === 0) firstImageUrl = imgUrl;
    } catch (e) {
      console.error('上傳失敗:', outputPath, e.message);
      continue;
    }

    // 3. 產生 markdown 語法
    imageMarkdowns.push(`![${file}](${imgUrl})`);
  }

  // 4. 塞進 meta.cover
  postMeta.cover = firstImageUrl;

  // 5. 產生 YAML frontmatter
  function postMetaToYaml(m) {
    // tags 陣列要有中括號，其他直接 key: value
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

  // 6. 合併 markdown 文章
  const markdown = postMetaToYaml(postMeta) +
    '\n文章內文從這裡開始寫\n\n' +
    imageMarkdowns.join('\n') + '\n';

  fs.writeFileSync(markdownOutput, markdown);
  console.log('新 markdown 文章已建立:', markdownOutput);
}

compressUploadAndGenerateMarkdown();
