'use client';
import { useState } from "react";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Image from "next/image";

export default function PhotoAlbumGallery({ images }) {
    const [index, setIndex] = useState(-1);

    // 轉換資料格式：確保有 width 和 height
    // Masonry 佈局下，我們給所有圖片一個統一的寬度，高度會自動調整
    const photos = images.map(img => ({
        src: img.src,
        alt: img.alt || '',
        width: img.width || 800,   // 統一寬度
        height: img.height || 600,  // 預設高度（會被實際圖片覆蓋）
    }));

    // Lightbox 需要的格式
    const slides = photos.map(photo => ({
        src: photo.src,
        alt: photo.alt,
        width: photo.width,
        height: photo.height,
    }));

    return (
        <>
            <MasonryPhotoAlbum
                photos={photos}
                columns={(containerWidth) => {
                    if (containerWidth < 640) return 1;
                    if (containerWidth < 1024) return 2;
                    return 3;
                }}
                spacing={12}
                padding={0}
                onClick={({ index: current }) => setIndex(current)}
                render={{
                    image: (props, context) => (
                        <Image
                            {...props}
                            src={props.src}
                            alt={props.alt}
                            width={context.photo.width}
                            height={context.photo.height}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={85}
                            className="cursor-pointer hover:opacity-90 transition-opacity duration-300"
                            style={{
                                objectFit: 'cover',
                                display: 'block',
                            }}
                        />
                    ),
                }}
            />

            <Lightbox
                slides={slides}
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
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
