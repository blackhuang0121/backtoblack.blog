'use client';
import { useState } from "react";
import galleries from "@/app/photos/data/galleries.json";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import ImageLightbox from "@/components/ImageLightbox";
import PhotoAlbum from "react-photo-album";

export default function GalleryPage({ params }) {
    const photos = (gallery.images || []).map(img => ({
        src: img.src,
        width: img.src.includes("1025") ? 1025 : 679,
        height: img.src.includes("1025") ? 679 : 1024,
        alt: img.alt || gallery.title,
    }));

    const [lightboxIndex, setLightboxIndex] = useState(-1);
    //   if (!gallery) return <div>Not found</div>;



    // **排序，並找 index**
    const sortedGalleries = galleries.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentIdx = sortedGalleries.findIndex(g => g.id === params.gallery);

    // **找前後一輯**
    const prevGallery = currentIdx < sortedGalleries.length - 1 ? sortedGalleries[currentIdx + 1] : null;
    const nextGallery = currentIdx > 0 ? sortedGalleries[currentIdx - 1] : null;

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto py-8">
                <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8 shadow">
                    <Image
                        src={gallery.cover}
                        alt={gallery.title}
                        width={1920}
                        height={600}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="bg-neutral-900 text-white p-6 rounded-xl mb-8 shadow">
                    <h1 className="text-2xl font-bold mb-2">{gallery.title}</h1>
                    <div className="text-gray-400 text-xs mb-2 flex gap-4">
                        <span>拍攝日期：{gallery.travel_date}</span>
                        <span>發佈日期：{gallery.date}</span>
                    </div>
                    <div className="mb-2">{gallery.description}</div>
                    <div className="text-gray-400 text-xs">
                        {gallery.city}・{gallery.country}
                    </div>
                </div>
                <hr className="my-8 border-gray-700" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <PhotoAlbum
                        layout="rows"
                        photos={photos}
                        onClick={({ index }) => setLightboxIndex(index)}
                        renderPhoto={({ photo, imageProps }) => (
                            <Image
                                {...imageProps}
                                className="rounded-xl object-cover hover:brightness-90 transition"
                                style={{ cursor: "zoom-in" }}
                            />
                        )}
                    />
                    {lightboxIndex >= 0 && (
                        <ImageLightbox
                            src={photos[lightboxIndex].src}
                            alt={photos[lightboxIndex].alt}
                            onClose={() => setLightboxIndex(-1)}
                        />
                    )}
                </div>

                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    這裡假設你的 gallery 有一個 images: [] 屬性，存所有照片
                    {(gallery.images || []).map((img) => (
                        <ImageLightbox
                            key={img.src}
                            src={img.src}
                            width={400}          // 這裡你可以根據你需求自訂寬度
                            height={300}         // 高度建議配合 w-60 h-44 的比例，或用 16:9 (如 400/225)
                            alt={img.alt || gallery.title}
                            className="rounded-xl object-cover w-full h-52"
                        />
                    ))}
                </div> */}
                {/* 這裡可做下滑自動加載更多的設計 */}
            </main>
            <div className="border-t border-gray-700 pt-8 mx-4 md:mx-12">
                <div className="flex flex-row justify-between items-center mb-6">
                    <div className="w-full md:w-auto text-left">
                        {prevGallery && (
                            <Link href={`/photos/${prevGallery.id}`} className="font-bold hover:text-yellow-400">
                                ← 上一輯：{prevGallery.title}
                            </Link>
                        )}
                    </div>
                    <div>
                        {nextGallery && (
                            <Link href={`/photos/${nextGallery.id}`} className="font-bold hover:text-yellow-400">
                                下一輯：{nextGallery.title} →
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <Link href="/photos" className="text-white font-bold duration-200 hover:text-yellow-400">
                        查看所有相簿
                    </Link>
                    <Link href="/" className="text-white font-bold duration-200 hover:text-yellow-400">
                        回到首頁
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    );
}
