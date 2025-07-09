import Header from "./Header";
import Footer from "./Footer";
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-neutral-900 text-white p-8 rounded-xl flex items-center justify-center">
                <div className="max-w-3xl bg-gray-800 rounded-xl p-8">
                    <h1 className="text-3xl font-bold mb-4">About</h1>
                    <p className="mb-6 text-gray-300">
                        嗨嗨👋 我是黃啟豪！熱衷拍照，終於從底片踏入數位的坑，也拿去歐洲拍了拍。拉花學了大半年年總算有了些成果，最愛英國難得的晴天與漫步在日本的街道。
                    </p>
                    <div className="flex items-center gap-8 mb-8">
                        <Image src="/img/DSCF4465.JPG" alt="我的照片" className="w-24 h-24 rounded-full object-cover" />
                        <div className="space-y-1">
                            <p>
                                <a href="mailto:huhu76543212001@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">
                                    huhu76543212001@gmail.com
                                </a>
                            </p>
                            <p>
                                <a href="https://instagram.com/black_huang_0121" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">
                                    Instagram: black_huang_0121
                                </a>
                            </p>
                            <p>
                                <a href="https://instagram.com/blackhuang.jpg" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">
                                    Instagram for Photos: blackhuang.jpg
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
