import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Posts from "@/components/Posts";

export const dynamic = "force-static"; // SSG

export default function PostListPage() {
    const postsDir = path.join(process.cwd(), "posts");
    const filenames = fs.readdirSync(postsDir);

    // const posts = filenames.map((file) => {
    //     const filePath = path.join(postsDir, file);
    //     const fileContents = fs.readFileSync(filePath, "utf-8");
    //     const { data } = matter(fileContents);
    //     return {
    //         slug: file.replace(/\.md$/, ""),
    //         ...data,
    //     };
    // }).sort((a, b) => new Date(b.date) - new Date(a.date));

    // 先拿到所有 metadata
    const posts = filenames.map((file) => {
        const filePath = path.join(postsDir, file);
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContents);
        return {
            slug: file.replace(/\.md$/, ""),
            ...data,
        };
    });

    // **重點：確保排序！**
    const sortedPosts = posts
        .filter(post => !!post.date) // 避免有 undefined
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return <Posts posts={sortedPosts} title="全部文章" />;
}
