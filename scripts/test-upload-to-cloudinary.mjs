import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const imageDir = './images/osaka2025'; // 換成你圖片資料夾路徑

async function uploadAllImages() {
  const files = fs.readdirSync(imageDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  const uploadResults = [];

  for (const file of files) {
    const filePath = path.join(imageDir, file);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "2025-osaka" // Cloudinary 目錄，可自訂
      });
      uploadResults.push({
        src: result.secure_url,
        alt: path.parse(file).name // 用檔名當 alt，可自訂
      });
      console.log('Uploaded:', result.secure_url);
    } catch (e) {
      console.error('Failed:', file, e.message);
    }
  }

  // 產生 json 清單（你也可以改寫成 append 到現有相簿 json 檔）
  fs.writeFileSync('./images/osaka2025-cloudinary.json', JSON.stringify(uploadResults, null, 2));
  console.log('所有圖片已上傳完畢！網址清單已寫入 json！');
}

uploadAllImages();
