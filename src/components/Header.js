'use client';
import SidebarMenu from "./SidebarMenu";
import Link from 'next/link';

export default function Header() {
    return (
        // <header className="py-8 text-center border-b bg-neutral-900">
        //     <div className="w-full max-w-6xl mx-auto px-6 flex flex-col">
        //         {/* row1: logo + SidebarMenu（橫排，兩側對齊） */}
        //         <div className="mb-4 text-left">
        //             {/* 左側 LOGO */}
        //             <div>
        //                 <Link href="/" className="block w-fit">
        //                     <h1 className="text-3xl font-bold mb-2 transition-colors duration-200 hover:text-yellow-400 cursor-pointer">
        //                         BacktoBlack.blog
        //                     </h1>
        //                 </Link>
        //                 <h2 className="text-lg">
        //                     嗨嗨這裡是天母黑人的部落格，不定期更新中😎
        //                 </h2>
        //             </div>
        //             {/* 右側 SidebarMenu */}
        //             <SidebarMenu />
        //         </div>
        //         {/* row2: Nav 按鈕列（下方一行，置中） */}
        //         <nav className="flex items-center justify-center gap-8 mt-8">
        //             <div className="flex gap-8">
        //                 <Link href="/category/trips" className="px-4 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white text-xl md:text-2xl font-extrabold flex items-center gap-2 shadow-xl transition-all duration-200">
        //                     🧳 旅遊 Trips
        //                 </Link>
        //                 <Link href="/category/photos" className="px-4 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white text-xl md:text-2xl font-extrabold flex items-center gap-2 shadow-xl transition-all duration-200">
        //                     📸 攝影 Photos
        //                 </Link>
        //                 <Link href="/category/essays" className="px-4 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white text-xl md:text-2xl font-extrabold flex items-center gap-2 shadow-xl transition-all duration-200">
        //                     🖋️ 隨筆 Essays
        //                 </Link>
        //                 <Link href="/about" className="px-4 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white text-xl md:text-2xl font-extrabold flex items-center gap-2 shadow-xl transition-all duration-200">
        //                     🖋️ 關於 About
        //                 </Link>
        //             </div>
        //         </nav>

        //     </div>
        // </header>
        <header className="py-8 border-b bg-neutral-900 text-white">
            {/* 上方 LOGO 與副標 */}
            <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center">
                <Link href="/" className="block w-fit">
                    <h1 className="text-3xl font-bold mb-2 transition-colors duration-200 hover:text-yellow-400">
                        BacktoBlack.blog
                    </h1>
                </Link>
                <h2 className="text-base md:text-lg font-bold text-white text-center">
                    嗨嗨這裡是天母黑人的部落格，不定期更新中😎
                </h2>
                <SidebarMenu />
            </div>
            {/* 導覽列 Nav */}
            <nav className="hidden md:flex flex-row gap-8 justify-center mt-8">
                <div className="flex gap-3 flex-wrap justify-center">
                    <Link
                        href="/category/trips"
                        className="px-2 py-1 text-base md:text-xl transition-colors hover:text-yellow-400"
                    >
                        🧳 旅遊 Trips
                    </Link>
                    <Link
                        href="/category/photos"
                        className="px-2 py-1 text-base md:text-xl transition-colors hover:text-yellow-400"
                    >
                        📸 攝影 Photos
                    </Link>
                    <Link
                        href="/category/essays"
                        className="px-2 py-1 text-base md:text-xl transition-colors hover:text-yellow-400"
                    >
                        🖋️ 隨筆 Essays
                    </Link>
                    <Link
                        href="/about"
                        className="px-2 py-1 text-base md:text-xl transition-colors hover:text-yellow-400"
                    >
                        🖋️ 關於 About
                    </Link>
                </div>
            </nav>
        </header>
    );
}
