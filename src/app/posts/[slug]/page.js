import ReactMarkdown from 'react-markdown';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default async function PostPage({ params }) {
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
                        width={400}          // 這裡你可以根據你需求自訂寬度
                        height={300}         // 高度建議配合 w-60 h-44 的比例，或用 16:9 (如 400/225)
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
                        <ReactMarkdown>{content}</ReactMarkdown>
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
