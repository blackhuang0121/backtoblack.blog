'use client';
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox";
import Image from "next/image";

export default function ImageLightbox({ src, alt, ...props }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* 圖片本身，點擊時打開 lightbox */}
            <Image
                src={src}
                alt={alt}
                onClick={() => setOpen(true)}
                style={{
                    cursor: "zoom-in",
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    objectFit: "contain",
                    objectPosition: "center",
                    maxHeight: "100vh",
                    maxWidth: "100vw"
                }}
            />
            {/* Lightbox，只顯示一張圖 */}
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={[{ src, alt }]}
                plugins={[Zoom]}
                animation={{ zoom: 50 }}
                // closeOnBackdropClick={true}
                render={{
                    buttonPrev: () => null,
                    buttonNext: () => null
                }}
            />
        </>
    );
}