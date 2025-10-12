"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IProductWithBasePrice } from "@/types/model";
import ProductCard from "./ProductCard";
import CarouselBtn from "./CarouselBtn";

import useEmblaCarousel from "embla-carousel-react";
import './carousel/embla.css'

interface Props {
  side?: "left" | "right" | "center";
  title: string;
  seeAllLink: string;
  carouselBg?: string;
  innerCarouselBg?: string;
  linkClass?: string;
  titleClass?: string;
  api: string;
  carouselClass?: string;
}

const Carousel = ({
  side = "left",
  title,
  seeAllLink,
  carouselBg,
  innerCarouselBg,
  linkClass,
  titleClass,
  api,
  carouselClass = "",
}: Props) => {
  const [cards, setCards] = useState<IProductWithBasePrice[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
  });

  const handleNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const handlePrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  useEffect(() => {
    const fetchScroll = async () => {
      try {
        const res = await fetch(`/api/${api}`);
        const data = await res.json();
        setCards(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchScroll();
  }, [api]);

  return (
    <section
      className={`my-10 w-full ${carouselBg ? `bg-${carouselBg}` : ""} ${side === "left" ? "pr-4 sm:pr-10 pl-2" : "pl-4 sm:pl-10 pr-2"
        } ${carouselClass} py-6`}
      aria-label={title}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between ${side === "left"
          ? "pl-4 sm:pl-20 pr-0 sm:pr-10"
          : "pr-4 sm:pr-20 pl-0 sm:pl-10"
          }`}
      >
        <h3
          className={`font-bold text-2xl text-black title relative select-none ${titleClass}`}
        >
          {title}
        </h3>
        <Link
          className={`flex items-end gap-1 text-black font-normal text-base ${linkClass}`}
          href={seeAllLink}
        >
          مشاهده همه
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Embla Carousel */}
      <div className={`w-full ${side === "left" ? "mr-auto justify-start" : "ml-auto justify-end"
        } mt-8 flex flex-row-reverse items-center gap-4 md:gap-8`}
      >
        {side === "right" && (
          <CarouselBtn onClick={handleNext}>
            <ChevronLeft className="text-black select-none w-5 h-5 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-50" />
          </CarouselBtn>
        )}

        <div
          className={`w-[90%] inline-block ${innerCarouselBg}
          ${side === "left"
              ? "rounded-tr-2xl rounded-br-2xl float-left"
              : "rounded-tl-2xl rounded-bl-2xl float-right"
            } pt-8 pb-6 px-4`}
        >
          {cards?.length > 0 && (
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {cards.map((item, index) => <ProductCard key={index} product={item} itemClass="mx-1 md:mx-2 flex-[0_0_50%] md:flex-[0_0_30%]" />)}
              </div>
            </div>
          )}
        </div>

        {side === "left" && (
          <CarouselBtn onClick={handlePrev}>
            <ChevronRight className="text-black select-none w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" />
          </CarouselBtn>
        )}
      </div>
    </section>
  );
};

export default Carousel;
