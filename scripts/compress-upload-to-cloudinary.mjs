// 本腳本自動將精選資料夾所有 jpg/png 圖片，resize 壓縮後另存新資料夾，再批次上傳 Cloudinary，產生 json 網址清單

import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const srcDir = '/Users/e0121n/Pictures/Fujifilm/Hamburg_selected';   // 精選原圖資料夾
const outDir = '/Users/e0121n/Pictures/Fujifilm/Hamburg_selected_compressed';        // 壓縮後新資料夾
const resizeWidth = 1920;                       // 長邊像素，可調整
const jpegQuality = 80;                         // 壓縮畫質，可調整
const cloudFolder = 'Hamburg-2025';               // Cloudinary 雲端相簿目錄

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 要 append/覆蓋進去的 galleries.json 路徑
const galleriesPath = './src/app/photos/data/galleries.json';
// 當前要新增/更新的相簿欄位
const albumId = 'Hamburg-2025';
const albumTitle = '十日德國獨旅之二：漢堡';
const albumDraft = false;
const albumDate = '2025-07-22';
const albumTravelDate = '2025-04-12';
// const albumCover = ... // <<== 這行不用在外面宣告
const albumDescription = 'FujiFilm X-T30 II | 18-55mm & 27mm | Eterna Daily';
const albumCategory = 'photos';
const albumTags = ['攝影', '德國', '漢堡'];
const albumCity = 'Hamburg';
const albumCountry = 'Germany';

async function compressAndUploadAll() {
  // 準備壓縮後資料夾
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const files = fs.readdirSync(srcDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  const uploadResults = [];

  for (const file of files) {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(outDir, file.replace(/\.(JPG|JPEG|PNG)$/i, '.jpg'));

    // 1. 壓縮&縮圖
    try {
      await sharp(inputPath)
        .rotate() // <== 新增這行，自動根據 EXIF 校正方向
        .resize({ width: resizeWidth, height: resizeWidth, fit: 'inside' }) // 長邊(寬或高)最大 1920px
        .jpeg({ quality: jpegQuality })
        .toFile(outputPath);
      console.log('壓縮完成:', outputPath);
    } catch (err) {
      console.error('壓縮失敗:', inputPath, err);
      continue;
    }

    // 2. 上傳到 Cloudinary
    try {
      const result = await cloudinary.uploader.upload(outputPath, {
        folder: cloudFolder,
        public_id: path.parse(file).name,
        tags: albumTags, // <== 直接這樣寫，Cloudinary 支援 tags: 陣列
        context: {
          alt: file,
          caption: file
        }
      });
      uploadResults.push({
        src: result.secure_url,
        alt: file
        // path.parse(file).name
      });
      console.log('已上傳:', result.secure_url);
    } catch (e) {
      console.error('上傳失敗:', outputPath, e.message);
    }
  }

  // 3. 讀取 galleries.json，append/覆蓋 album
  let galleries = [];
  if (fs.existsSync(galleriesPath)) {
    galleries = JSON.parse(fs.readFileSync(galleriesPath, 'utf-8'));
  }

  // 檢查有沒有重複 id，相同就覆蓋，沒有就 append
  const idx = galleries.findIndex(a => a.id === albumId);
  const albumCover = uploadResults.length > 0 ? uploadResults[0].src : '';
  const newAlbum = {
    id: albumId,
    title: albumTitle,
    draft: albumDraft,
    date: albumDate,
    travel_date: albumTravelDate,
    cover: albumCover,
    description: albumDescription,
    category: albumCategory,
    tags: albumTags,
    city: albumCity,
    country: albumCountry,
    images: uploadResults
  };
  if (idx >= 0) {
    galleries[idx] = newAlbum;
    console.log('覆蓋現有相簿:', albumId);
  } else {
    galleries.push(newAlbum);
    console.log('新增新相簿:', albumId);
  }

  // 4. 直接更新現有相簿 json 的 images 欄位
  fs.writeFileSync(galleriesPath, JSON.stringify(galleries, null, 2));
  console.log('所有圖片已壓縮+上傳，網址已寫入現有 json 檔的 images 欄位！');
}

compressAndUploadAll();
