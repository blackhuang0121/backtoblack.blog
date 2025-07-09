import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image';

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
                    <div className="flex flex-row items-center gap-8 w-fit mt-8">
                        <Image
                            src="/img/DSCF4465.JPG"
                            alt="我的照片"
                            width={96}    // 單位是 px，根據實際照片可調大一點
                            height={96}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <div className="space-y-1 flex flex-col">
                            <a
                                href="mailto:huhu76543212001@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-yellow-400 no-underline"
                            >
                                huhu76543212001@gmail.com
                            </a>
                            <a
                                href="https://instagram.com/black_huang0121"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-yellow-400 no-underline"
                            >
                                Instagram: black_huang_0121
                            </a>
                            <a
                                href="https://instagram.com/blackhuang.jpg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-yellow-400 no-underline"
                            >
                                Instagram for Photos: blackhuang.jpg
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
