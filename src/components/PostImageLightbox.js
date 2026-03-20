'use client';
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Image from "next/image";

export default function ImageLightbox({ src, alt, width, height, allImages = [], currentIndex = 0, ...props }) {
    const [open, setOpen] = useState(false);

    // 如果有傳入 allImages，使用所有圖片；否則只顯示單張
    const slides = allImages.length > 0 
        ? allImages.map(img => ({
            src: img.src,
            alt: img.alt || '',
            width: img.width || 1600,
            height: img.height || 900,
          }))
        : [{ src, alt, width: width || 1600, height: height || 900 }];

    return (
        <>
            {/* 圖片本身，點擊時打開 lightbox */}
            <Image
                src={src}
                alt={alt}
                width={width || 1600}
                height={height || 900}
                onClick={() => setOpen(true)}
                style={{
                    cursor: "zoom-in",
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "contain",
                    objectPosition: "center",
                }}
            />
            {/* Lightbox，支援多圖瀏覽 */}
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={slides}
                index={currentIndex}
                plugins={[Zoom, Thumbnails]}
                animation={{ zoom: 500 }}
                carousel={{
                    padding: 0,
                    spacing: 0,
                    imageFit: "contain",
                }}
                styles={{
                    container: { backgroundColor: "rgba(0, 0, 0, .95)" },
                    slide: { padding: "0" },
                }}
                zoom={{
                    scrollToZoom: true,
                    maxZoomPixelRatio: 3,
                }}
                thumbnails={{
                    position: "bottom",
                    width: 120,
                    height: 80,
                    border: 1,
                    borderRadius: 4,
                    padding: 4,
                    gap: 16,
                    showToggle: true,
                }}
            />
        </>
    );
}