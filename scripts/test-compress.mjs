import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcDir = '/Users/e0121n/Pictures/Fujifilm/Osaka_selected';   // 精選原圖資料夾
const outDir = '/Users/e0121n/Pictures/Fujifilm/Osaka_selected_compressed';        // 壓縮後新資料夾
const resizeWidth = 1920;                       // 長邊像素，可調整
const jpegQuality = 80;                         // 壓縮畫質，可調整

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const files = fs.readdirSync(srcDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));

for (const file of files) {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(outDir, file.replace(/\.(JPG|JPEG|PNG)$/i, '.jpg'));
    sharp(inputPath)
        .rotate() // <== 新增這行，自動根據 EXIF 校正方向
        .resize({ width: resizeWidth })
        .jpeg({ quality: jpegQuality })
        .toFile(outputPath)
        .then(() => {
            console.log('壓縮完成:', outputPath);
        })
        .catch(err => {
            console.error('壓縮失敗:', inputPath, err);
        });
}
