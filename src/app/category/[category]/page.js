import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Posts from "@/components/Posts";

export default async function CategoryPage({ params }) {
    const postsDir = path.join(process.cwd(), "posts");
    const filenames = fs.readdirSync(postsDir);

    const allPosts = filenames.map((file) => {
        const filePath = path.join(postsDir, file);
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContents);
        return {
            slug: file.replace(/\.md$/, ""),
            ...data,
        };
    });

    const category = decodeURIComponent(params.category);
    const filtered = allPosts.filter(
        post => post.category === category
    );

    return <Posts posts={filtered} title={category + " 文章列表"} />;
}
