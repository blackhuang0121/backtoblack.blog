'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';


export default function SidebarMenu() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* always show hamburger button */}
            <button
                className="fixed top-6 right-6 z-40 p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-2xl shadow-md"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
            >
                <FontAwesomeIcon icon={faBars} />
            </button>
            {/* 半透明遮罩 */}
            <div
                className={`fixed inset-0 bg-black/30 z-30 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setOpen(false)}
            />
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-96 bg-black text-white z-40 shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <span className="font-bold text-2xl">BacktoBlack.blog</span>
                    <button className="text-3xl" onClick={() => setOpen(false)} aria-label="Close menu">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <nav className="flex flex-col gap-6 p-6">
                    <Link href="/category/trips" className="text-xl font-medium hover:text-cyan-400" onClick={() => setOpen(false)}>
                        🧳 旅遊 Trips
                    </Link>
                    <Link href="/category/photos" className="text-xl font-medium hover:text-cyan-400" onClick={() => setOpen(false)}>
                        📸 攝影 Photos
                    </Link>
                    <Link href="/category/essays" className="text-xl font-medium hover:text-cyan-400" onClick={() => setOpen(false)}>
                        🖋️ 隨筆 Essays
                    </Link>
                    <Link href="/about" className="text-xl font-medium hover:text-cyan-400" onClick={() => setOpen(false)}>
                        🙋‍♂️ 關於 About
                    </Link>
                </nav>
            </aside>
        </>
    );
}
