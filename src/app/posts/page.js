import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Posts from "@/components/Posts";
import { getAllPostsMeta } from "./[slug]/getAllPostsMeta";

export const dynamic = "force-static"; // SSG

export default function PostListPage() {
    const posts = getAllPostsMeta();

    return (
        <Posts posts={posts} title="全部文章" />
    );
}
