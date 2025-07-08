// components/CategoryCards.js
'use client';
import { useState } from 'react';
import Image from 'next/image';

const categories = [
    {
        title: '旅遊',
        desc: '放慢腳步，感受那途經每個地方的活力',
        emoji: '🏞️',
        img: '/img/DSCF2135.JPG',
        color: 'bg-cyan-900 text-white',
    },
    {
        title: '拍照',
        desc: '喜歡拍出的成品帶上如底片特有的顆粒感',
        emoji: '📷',
        img: '/img/DSCF5227.JPG',
        color: 'bg-white border-2 border-cyan-900 text-cyan-900',
    },
    {
        title: '隨筆',
        desc: '用文字咀嚼所見所想，紀錄片刻',
        emoji: '✍️',
        img: '/img/DSCF4058.JPG',
        color: 'bg-white border-2 border-cyan-900 text-cyan-900',
    },
];

export default function CategoryCards() {
    const [hoverIdx, setHoverIdx] = useState(0);

    return (
        <div className="w-full max-w-5xl px-4 mt-8 mx-auto">
            <div className="flex flex-col gap-6 w-full md:w-1/2">
                {categories.map((cat, idx) => (
                    <div
                        key={cat.title}
                        className={
                            `rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-200 ` +
                            cat.color +
                            (hoverIdx === idx ? ' scale-105 ring-4 ring-cyan-200' : '')
                        }
                        onMouseEnter={() => setHoverIdx(idx)}
                        onMouseLeave={() => setHoverIdx(0)}
                    >
                        <div className="text-lg font-bold flex items-center gap-2">
                            <span>{cat.emoji}</span>
                            <span>{cat.title}</span>
                        </div>
                        <div className="mt-2 text-base">
                            {cat.desc}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full h-[260px] md:h-[400px] max-w-md rounded-2xl overflow-hidden shadow-xl">
                    <Image
                        src={categories[hoverIdx].img}
                        alt={categories[hoverIdx].title}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
