// Next.js 的全域設定檔（config file），你所有的 Next.js 專案都會有這個檔案
// 功能像是：
// 設定圖片來源白名單（image domains）
// 自訂 API routes、redirects、rewrites
// 環境變數（env）
// 自訂 webpack 設定
// SSR/SSG 優化...

/** @type {import('next').NextConfig} */
const nextConfig = {};

// next.config.mjs (ESM)
export default {
    images: {
        domains: [
            "live.staticflickr.com",
            "staging-jubilee.flickr.com",
            "https://res.cloudinary.com",
        ],
    },
};
