import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Posts({ posts, title = "全部文章" }) {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
            <Header />
            <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
                <h1 className="text-2xl font-bold mb-8">{title}</h1>
                <div className="flex flex-col gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/posts/${post.slug}`}
                            className="flex bg-neutral-800 rounded-xl overflow-hidden shadow hover:scale-105 transition w-full max-w-3xl"
                        >
                            {/* 左側 Cover 圖片 */}
                            <div className="w-48 h-36 flex-shrink-0 relative">
                                {post.cover && (
                                    <Image
                                        src={post.cover}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            {/* 右側內容 */}
                            <div className="flex flex-col justify-between p-6 min-w-0 w-2/3">
                                <div>
                                    <h2 className="text-lg font-bold mb-1">{post.title}</h2>
                                    <div className="text-gray-400 text-xs mb-2 flex gap-4">
                                        <span>旅行日期：{post.travel_date}</span>
                                        <span>發文日期：{post.date}</span>
                                    </div>
                                    <div className="text-sm text-gray-300 mb-2">{post.description}</div>
                                </div>
                                <div className="text-gray-400 text-xs">
                                    {post.city}・{post.country}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
