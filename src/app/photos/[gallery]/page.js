import galleries from "@/app/photos/data/galleries.json";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function GalleryPage({ params }) {
    const gallery = galleries.find(g => g.id === params.gallery);
    if (!gallery) return <div>Not found</div>;

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto py-8">
                <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8 shadow">
                    <Image
                        src={gallery.cover}
                        alt={gallery.title}
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
                    {/* 這裡假設你的 gallery 有一個 images: [] 屬性，存所有照片 */}
                    {(gallery.images || []).map((img) => (
                        <Image
                            key={img.src}
                            src={img.src}
                            alt={img.alt || gallery.title}
                            className="rounded-xl object-cover w-full h-52"
                        />
                    ))}
                </div>
                {/* 這裡可做下滑自動加載更多的設計 */}
            </main>
            <Footer />
        </>
    );
}
