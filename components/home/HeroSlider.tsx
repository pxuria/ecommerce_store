'use client';

import { useEffect, useState } from "react";
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { EmblaOptionsType } from 'embla-carousel'
import { NextButton, PrevButton, usePrevNextButtons } from "../shared/carousel/EmblaCarouselArrowButtons"
import "../shared/carousel/embla.css";
import { IBanner } from "@/types/model";


const OPTIONS: EmblaOptionsType = { loop: true }

const HeroSlider = () => {
    const [bannners, setBanners] = useState<IBanner[]>([]);
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch('/api/banners');
                const data = await res.json();

                setBanners(data.data);
            } catch (error) {
                console.error(error)
            }
        };

        fetchBanners();
    }, [])


    return (
        <section className="max-w-[94%] mx-auto embla" dir='ltr'>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="embla__container">
                    {bannners.map((item, index) => (
                        <div className="embla__slide" key={index}>
                            <Image src={item.image} alt={item.alt || 'بنر'} width={900} height={450} className="w-full object-cover max-h-[450px]" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls">
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
        </section>
    )
}

export default HeroSlider