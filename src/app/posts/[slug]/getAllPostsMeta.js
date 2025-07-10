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
        });

    return posts;
}
