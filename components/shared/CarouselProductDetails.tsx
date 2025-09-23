"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Bookmark, Share2 } from "lucide-react";
import { IProduct } from "@/types/model";

interface Props {
  product: IProduct;
}

const CarouselProductDetails = ({ product }: Props) => {
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleBookmark = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(prev => !prev);
  }, []);

  const images = product.images?.map((img) => img.url) || [];

  return (
    <div className="w-full min-[880px]:w-1/2 flex flex-row-reverse gap-2 max-h-[480px]">
      <Carousel
        className="w-3/4"
        opts={{
          // align: "start",
          loop: true,
          direction: "rtl",
        }}
      >
        <CarouselContent className="">
          {images.map((url, index) => (
            <CarouselItem key={index} className={`${index !== activeIndex ? "hidden" : "block"} relative`}>
              <Image
                src={url}
                width={800}
                height={800}
                unoptimized
                alt={`${product.name} image ${index + 1}`}
                className="w-full h-[480px] rounded-xl object-cover"
              />

              {/* Bookmark Button */}
              <div className="absolute top-4 right-4">
                <button
                  className="bg-[#f9fafbb3] hover:bg-[#f8f9fa] primary_transition cursor-pointer rounded-full p-2 z-40"
                  aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                  onClick={handleBookmark}
                  type="button"
                >
                  <Bookmark size={24} fill={bookmarked ? '' : "#000"} />
                </button>
              </div>

              {/* Share Button */}
              <div className="absolute top-4 left-8">
                <button
                  className="bg-[#f9fafbb3] hover:bg-[#f8f9fa] primary_transition cursor-pointer rounded-full p-2 z-40"
                  onClick={() => { }}
                  type="button"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
              <CarouselNext /> */}
      </Carousel>

      {/* Thumbnails */}
      {/* <div className="w-1/4 overflow-y-auto max-h-[490px] flex flex-col gap-2">
        {images.map((url, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`relative rounded-xl overflow-hidden border-2 ${activeIndex === index
              ? "border-pink_600"
              : "border-transparent opacity-70"
              }`}
          >
            <Image
              src={url}
              width={200}
              height={200}
              unoptimized
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-[150px] object-cover"
            />
          </button>
        ))}
      </div> */}

      <Carousel
        className="w-1/4"
        orientation="vertical"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="max-h-[490px]">
          {product.images.map((item, index) => (
            <CarouselItem key={index} className="">
              <Image
                src={item.url}
                width={800}
                height={800}
                unoptimized
                alt={`${product.name} image ${index + 1}`}
                className="w-full h-[150px] rounded-xl object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CarouselProductDetails;
