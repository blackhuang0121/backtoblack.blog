// components/PhotoGalleryList.js
import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";
import Image from "next/image";

export default function PhotoGalleryList({ galleries, title = "我的相簿" }) {
    return (
        <>
            <Header />
            <main className="w-full flex flex-col items-center py-10">
                <h1 className="text-2xl font-bold mb-8">{title}</h1>
                <div className="flex flex-col gap-8">
                    {galleries.map((g) => (

                        <Link
                            key={g.id}
                            href={`/photos/${g.id}`}
                            className="flex bg-neutral-800 rounded-xl overflow-hidden shadow hover:scale-105 transition w-full max-w-4xl mx-auto h-48"
                        >
                            {/* 左側圖片 - 固定寬度，高度填滿卡片 */}
                            <div className="w-60 flex-shrink-0 relative h-full">
                                <Image
                                    src={g.cover}
                                    alt={g.title}
                                    fill
                                    sizes="240px"
                                    className="object-cover"
                                />
                            </div>
                            {/* 右側內容 */}
                            <div className="flex flex-col justify-between p-6 min-w-0 flex-1">
                                <h2 className="text-lg font-bold mb-1">{g.title}</h2>
                                <div className="text-gray-400 text-xs mb-2 flex gap-4">
                                    <span>拍攝日期：{g.travel_date}</span>
                                    <span>發佈日期：{g.date}</span>
                                </div>
                                <div className="text-sm text-gray-300 mb-2">{g.description}</div>
                                <div className="text-gray-400 text-xs">{g.city}・{g.country}</div>
                            </div>
                        </Link>

                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}
