// components/HeroImage.js
'use client';
import Image from 'next/image';

export default function HeroImage() {
    return (
        <div className="relative w-full h-[280px] md:h-[400px] flex items-center justify-center overflow-hidden">
            <Image
                src="/img/DSCF5553.JPG"
                alt="Hello Paris"
                fill
                className="object-cover object-center brightness-90"
                priority
            />
            <div className="z-10 absolute inset-0 flex items-center justify-center">
                <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
                    <span className="text-base md:text-lg mr-2">👋 嗨嗨你好！歡迎來到部落格</span>
                </h1>
            </div>
        </div>
    );
}