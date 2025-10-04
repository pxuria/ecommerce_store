"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Bookmark, Share2 } from "lucide-react";
import { IProduct } from "@/types/model";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import EmblaCarousel from "@/components/shared/carousel/EmblaCarousel";

interface Props {
  product: IProduct;
}

const OPTIONS: EmblaOptionsType = { loop: true, align: 'start' };
const THUMB_OPTIONS: EmblaOptionsType = {
  containScroll: "keepSnaps",
  dragFree: true,
};

const CarouselProductDetails = ({ product }: Props) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(OPTIONS);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(THUMB_OPTIONS);
  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const snap = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(snap);
    emblaThumbsApi.scrollTo(snap);
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const handleBookmark = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setBookmarked((prev) => !prev);
    },
    []
  );

  const images =
    product.images?.map((img) => ({
      image: img.url,
      alt: `${product.name} image`,
    })) || [];

  // <Image
  //   src={url}
  //   width={800}
  //   height={800}
  //   unoptimized
  //   alt={`${product.name} image ${index + 1}`}
  //   className="w-full h-[480px] rounded-xl object-cover"
  // />

  // {/* Bookmark Button */ }
  // <div className="absolute top-4 right-4">
  //   <button
  //     className="bg-[#f9fafbb3] hover:bg-[#f8f9fa] primary_transition cursor-pointer rounded-full p-2 z-40"
  //     aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
  //     onClick={handleBookmark}
  //     type="button"
  //   >
  //     <Bookmark size={24} fill={bookmarked ? '' : "#000"} />
  //   </button>
  // </div>

  // {/* Share Button */ }
  // <div className="absolute top-4 left-8">
  //   <button
  //     className="bg-[#f9fafbb3] hover:bg-[#f8f9fa] primary_transition cursor-pointer rounded-full p-2 z-40"
  //     onClick={() => { }}
  //     type="button"
  //   >
  //     <Share2 size={20} />
  //   </button>
  // </div>

  return (
    <div className="w-full min-[880px]:w-1/2 flex flex-row-reverse gap-2 max-h-[480px]">
      <div className="relative w-3/4" ref={emblaMainRef}>
        <EmblaCarousel slides={images} options={OPTIONS} />

        {/* Bookmark button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            className="bg-[#f9fafbb3] hover:bg-[#f8f9fa] primary_transition cursor-pointer rounded-full p-2"
            aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
            onClick={handleBookmark}
          >
            <Bookmark size={24} fill={bookmarked ? "" : "#000"} />
          </button>
        </div>

        {/* Share button */}
        <div className="absolute top-4 left-8 z-10">
          <button
            className="bg-[#f9fafbb3] hover:bg-[#f8f9fa] primary_transition cursor-pointer rounded-full p-2"
            onClick={() => { }}
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="w-1/4 max-h-[480px]" ref={emblaThumbsRef}>
        <div className="flex flex-col gap-2 overflow-hidden embla__container">
          {images.map((item, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
              className={`border-2 rounded-xl overflow-hidden ${index === selectedIndex
                ? "border-black"
                : "border-transparent opacity-70 hover:opacity-100"
                }`}
            >
              <Image
                src={item.image}
                width={150}
                height={150}
                alt={item.alt}
                className="w-full h-[120px] object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselProductDetails;