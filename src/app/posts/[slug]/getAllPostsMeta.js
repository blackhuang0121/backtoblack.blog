import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 取得所有 posts 資訊
export function getAllPostsMeta() {
    const postsDir = path.join(process.cwd(), 'posts');
    const files = fs.readdirSync(postsDir);

    const posts = files
        .filter((file) => file.endsWith('.md'))
        .map((file) => {
            const slug = file.replace(/\.md$/, '');
            const filePath = path.join(postsDir, file);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(fileContents);
            return {
                ...data,
                slug, // 方便生成連結
            };
        })

        // 避免有沒有 date 的（例如暫存檔、草稿）出現在清單
        .filter((post) => !!post.date && !post.draft)
        // 重點：統一新到舊排序！
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return posts;
}
