"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Bookmark, Share2 } from "lucide-react";
import { IProduct } from "@/types/model";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import "./product_carousel.css";

interface Props {
  product: IProduct;
}

const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: 'center',
  dragFree: false,
  containScroll: 'trimSnaps',
  direction: 'rtl'
};

const CarouselProductDetails = ({ product }: Props) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(OPTIONS);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi]);

  useEffect(() => {
    if (!emblaMainApi) return;

    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);

    return () => {
      emblaMainApi.off("select", onSelect);
      emblaMainApi.off("reInit", onSelect);
    };
  }, [emblaMainApi, onSelect]);

  const handleBookmark = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setBookmarked((prev) => !prev);
    }, []);

  const images =
    product.images?.map((img) => ({
      image: img.url,
      alt: `${product.name} image`,
    })) || [];

  return (
    <div className="w-full min-[880px]:w-1/2 flex flex-col gap-4">
      {/* Main Carousel */}
      <div className="embla">
        <div className="embla__viewport rounded-xl" ref={emblaMainRef}>
          <div className="embla__container h-full">
            {images.map((item, idx) => (
              <div
                className="embla__slide flex-[0_0_100%] min-w-0 relative"
                key={idx}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    width={800}
                    height={800}
                    unoptimized
                    alt={`${product.name} image ${idx + 1}`}
                    className="w-full h-[480px] object-cover rounded-xl"
                    priority={idx === 0}
                  />

                  {/* Bookmark Button */}
                  <div className="absolute top-4 right-4">
                    <button
                      className="bg-[#f9fafbb3] hover:bg-[#f8f9fa] transition-all duration-200 cursor-pointer rounded-full p-2 z-40"
                      aria-label={
                        bookmarked ? "Remove from bookmarks" : "Add to bookmarks"
                      }
                      onClick={handleBookmark}
                      type="button"
                    >
                      <Bookmark
                        size={24}
                        fill={bookmarked ? "#000" : "none"}
                      />
                    </button>
                  </div>

                  {/* Share Button */}
                  <div className="absolute top-4 left-4">
                    <button
                      className="bg-[#f9fafbb3] hover:bg-[#f8f9fa] transition-all duration-200 cursor-pointer rounded-full p-2 z-40"
                      onClick={() =>
                        navigator.share?.({ url: window.location.href })
                      }
                      type="button"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 max-h-[480px] overflow-y-auto">
          {images.map((item, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
              className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${index === selectedIndex
                ? "border-black opacity-100"
                : "border-transparent opacity-70 hover:opacity-100"
                }`}
              type="button"
            >
              <Image
                src={item.image}
                width={150}
                height={150}
                alt={item.alt}
                className="w-full h-[120px] object-cover aspect-square"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselProductDetails;