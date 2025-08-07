import { useCallback, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";
import {
  MdOutlineBookmark,
  MdOutlineBookmarkBorder,
  MdShare,
} from "react-icons/md";
import { IProduct } from "@/types";

interface Props {
  product: IProduct;
}

const CarouselProductDetails = ({ product }: Props) => {
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  const handleBookmark = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setBookmarked((prev) => !prev);
    },
    []
  );
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
          {product.image.map((item, index) => (
            <CarouselItem className="relative" key={index}>
              <Image
                src={item}
                width={800}
                height={800}
                unoptimized
                alt={`${product.name} image ${index + 1}`}
                className="w-full h-[480px] rounded-xl object-cover"
              />
              <div className="absolute top-4 right-4">
                <button
                  className="bg-[#f9fafbb3] hover:bg-[#f8f9fa] primary_transition cursor-pointer rounded-full p-2 z-40"
                  aria-label={
                    bookmarked ? "Remove from bookmarks" : "Add to bookmarks"
                  }
                  onClick={handleBookmark}
                  type="button"
                >
                  {bookmarked ? (
                    <MdOutlineBookmark className="w-6 h-6" />
                  ) : (
                    <MdOutlineBookmarkBorder className="w-6 h-6" />
                  )}
                </button>
              </div>

              <div className="absolute top-4 left-8">
                <button
                  className="bg-[#f9fafbb3] hover:bg-[#f8f9fa] primary_transition cursor-pointer rounded-full p-2 z-40"
                  onClick={() => {}}
                  type="button"
                >
                  <MdShare className="w-6 h-6" />
                </button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
              <CarouselNext /> */}
      </Carousel>

      <Carousel
        className="w-1/4"
        orientation="vertical"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="max-h-[490px]">
          {product.image.map((item, index) => (
            <CarouselItem key={index} className="">
              <Image
                src={item}
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
