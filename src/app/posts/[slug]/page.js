import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // 可換成你喜歡的 highlight 樣式
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { getAllPostsMeta } from './getAllPostsMeta'; // 或你自己的方法
import ImageLightbox from "@/components/ImageLightbox";

export default function PostPage({ params }) {
    // 取得所有文章 meta 並按發佈日期排序（新到舊）
    const posts = getAllPostsMeta().sort((a, b) => new Date(b.date) - new Date(a.date));

    // 找目前這篇的 index
    const currentIdx = posts.findIndex(post => post.slug === params.slug);

    // 找上一篇/下一篇
    const prevPost = currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null;
    const nextPost = currentIdx > 0 ? posts[currentIdx - 1] : null;

    // 取得當前文章內容
    const filePath = path.join(process.cwd(), 'posts', `${params.slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return (
        <>
            <Header />

            <div className="min-h-screen bg-neutral-900 text-white">
                {/* Cover 圖片 */}
                {data.cover && (
                    <Image
                        src={data.cover}
                        alt={data.title}
                        width={1920}
                        height={600}
                        className="w-full h-[320px] md:h-[560px] object-cover mb-6"
                    />
                    // 封面置中，留白寫法：mb-6 w-full max-h-[400px] object-cover rounded-xl shadow
                )}
                <div className="prose mx-auto px-4 mt-2 text-white">
                    <h1>{data.title}</h1>
                    {data.description && (
                        <p className="text-lg text-gray-400 mb-2">{data.description}</p>
                    )}
                    {data.tags && (
                        <div className="flex gap-2 mb-4">
                            {data.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 text-xs rounded bg-yellow-600 text-white">{tag}</span>
                            ))}
                        </div>
                    )}
                    {data.travel_date && (
                        <span className="mr-2">
                            <span className="font-semibold">旅行時間：</span>{data.travel_date}
                        </span>
                    )}
                    {/* 撰寫日期 */}
                    {data.date && (
                        <span className="mr-2">
                            <span className="font-semibold">發文日期：</span>{data.date}
                        </span>
                    )}
                    {/* 地點 */}
                    {data.city && <>・{data.city}</>}
                    {data.country && <>・{data.country}</>}
                    <hr className="my-10 border-gray-600" />

                    <div className="prose prose-invert max-w-3xl mx-auto">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}
                            components={{
                                img: ({ node, ...props }) => (
                                    <ImageLightbox src={props.src} alt={props.alt} />
                                ),
                            }}
                        >{content}</ReactMarkdown>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 mx-4 md:mx-12">
                    <div className="flex flex-row justify-between items-center mb-6">
                        <div className="w-full md:w-auto text-left">
                            {prevPost && (
                                <Link href={`/posts/${prevPost.slug}`} className="text-white font-bold duration-200 hover:text-yellow-400">
                                    👈 上一篇：{prevPost.title}
                                </Link>
                            )}
                        </div>
                        <div>
                            {nextPost && (
                                <Link href={`/posts/${nextPost.slug}`} className="text-white font-bold duration-200 hover:text-yellow-400">
                                    下一篇：{nextPost.title} 👉
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <Link href="/posts" className="text-white font-bold duration-200 hover:text-yellow-400">
                            查看所有文章
                        </Link>
                        <Link href="/" className="text-white font-bold duration-200 hover:text-yellow-400">
                            回到首頁
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export async function generateStaticParams() {
    const postsDir = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDir);
    return filenames.map((file) => ({
        slug: file.replace(/\.md$/, ''),
    }));
}
