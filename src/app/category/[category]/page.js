import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Posts from "@/components/Posts";
import PhotoGallery from "@/components/PhotoGallery";
import galleries from "@/app/photos/data/galleries.json";

export default function CategoryPage({ params }) {
    const category = decodeURIComponent(params.category);
    if (category === "photos") {
        const filtered = galleries.filter(g => g.category === "photos");
        return <PhotoGallery galleries={filtered} title="我的相簿" />;
    }

    // 文章類，原本的寫法
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

    const filtered = allPosts.filter((post) => post.category === category);

    return <Posts posts={filtered} title={category + " 文章列表"} />;
}

// export default async function CategoryPage({ params }) {
//     const postsDir = path.join(process.cwd(), "posts");
//     const filenames = fs.readdirSync(postsDir);

//     const allPosts = filenames.map((file) => {
//         const filePath = path.join(postsDir, file);
//         const fileContents = fs.readFileSync(filePath, "utf-8");
//         const { data } = matter(fileContents);
//         return {
//             slug: file.replace(/\.md$/, ""),
//             ...data,
//         };
//     });

//     const category = decodeURIComponent(params.category);
//     const filtered = allPosts.filter(
//         post => post.category === category
//     );

//     return <Posts posts={filtered} title={category + " 文章列表"} />;
// }