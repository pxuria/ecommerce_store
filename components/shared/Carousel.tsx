"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import CarouselBtn from "./CarouselBtn";
import ProductCard from "./ProductCard";
import { IoIosArrowBack } from "react-icons/io";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import { IProductWithBasePrice } from "@/types/model";

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
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    const fetchScroll = async () => {
      try {
        const res = await fetch(`/api${api}`);
        const data = await res.json();
        setCards(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchScroll();
  }, [api]);

  const settings = useMemo(
    () => ({
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      swipeToSlide: true,
      initialSlide: side === "left" ? 5 : 2,
      nextArrow: <></>,
      prevArrow: <></>,
      responsive: [
        {
          breakpoint: 1290,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 980,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            initialSlide: 5,
          },
        },
        {
          breakpoint: 620,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    }),
    [side]
  );

  const handleNext = useCallback(() => sliderRef.current?.slickNext(), []);
  const handlePrev = useCallback(() => sliderRef.current?.slickPrev(), []);

  return (
    <section
      className={`my-10 w-full ${carouselBg ? `bg-${carouselBg}` : ""} ${side === "left" ? "pr-4 sm:pr-10 pl-0" : "pl-4 sm:pl-10 pr-0"
        } ${carouselClass} py-6`}
      aria-label={`محصولات ${title}`}
    >
      <div
        className={`flex items-center justify-between ${side === "left"
          ? "pl-4 sm:pl-20 pr-0 sm:pr-10"
          : "pr-4 sm:pr-20 pl-0 sm:pl-10"
          }`}
      >
        <h3 className={`font-bold text-2xl text-black title relative select-none ${titleClass}`}>
          {title}
        </h3>
        <Link
          className={`flex items-end gap-1 text-black font-normal text-base ${linkClass}`}
          href={seeAllLink}
        >
          مشاهده همه
          <IoIosArrowBack className="w-5 h-5" />
        </Link>
      </div>

      <div
        className={`w-full ${side === "left" ? "mr-auto justify-start" : "ml-auto justify-end"
          } mt-8 flex flex-row-reverse items-center gap-8`}
      >
        {side === "right" && (
          <CarouselBtn onClick={handleNext}>
            <IoCaretBack className="text-black select-none w-4 h-4 md:w-5 md:h-5 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2" />
          </CarouselBtn>
        )}

        <div
          className={`w-[90%] inline-block ${innerCarouselBg}
           ${side === "left"
              ? "rounded-tr-2xl rounded-br-2xl float-left"
              : "rounded-tl-2xl rounded-bl-2xl float-right"
            } pt-8 pb-6 px-4`}
        >
          {(cards && cards.length > 0) && (
            <Slider ref={sliderRef} {...settings}>
              {cards.map((item, index) => <ProductCard key={index} product={item} />)}
            </Slider>
          )}
        </div>

        {side === "left" && (
          <CarouselBtn onClick={handlePrev}>
            <IoCaretForward className="text-black select-none w-4 h-4 md:w-5 md:h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </CarouselBtn>
        )}
      </div>
    </section>
  );
};

export default Carousel;
