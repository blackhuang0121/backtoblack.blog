import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Posts from "@/components/Posts";
import PhotoGallery from "@/components/PhotoGallery";
import { getAllPostsMeta } from "../../posts/[slug]/getAllPostsMeta";
import galleries from "@/app/photos/data/galleries.json";

export default function CategoryPage({ params }) {
    const category = decodeURIComponent(params.category);
    if (category === "photos") {
        const filtered = galleries.filter(g => g.category === "photos");
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // 時間排序
        return <PhotoGallery galleries={filtered} title="我的相簿" />;
    }

    // 文章類，原本的寫法
    const allPosts = getAllPostsMeta();
    const filtered = allPosts.filter((post) => post.category === category);

    return <Posts posts={filtered} title={category + " 文章列表"} />;
}
