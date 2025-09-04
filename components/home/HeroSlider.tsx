'use client';

import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { EmblaOptionsType } from 'embla-carousel'
import { NextButton, PrevButton, usePrevNextButtons } from "../shared/carousel/EmblaCarouselArrowButtons"
import "../shared/carousel/embla.css";


const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDES = [
    { image: '/assets/images/bg-1.png', alt: 'banner1' },
    { image: '/assets/images/bg-2.png', alt: 'banner2' },
    { image: '/assets/images/bg-3.png', alt: 'banner3' },
    { image: '/assets/images/bg-4.png', alt: 'banner4' },
]

const HeroSlider = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)


    return (
        <section className="max-w-[94%] mx-auto embla" dir='ltr'>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="embla__container">
                    {SLIDES.map((item, index) => (
                        <div className="embla__slide" key={index}>
                            <div className="embla__slide__number">
                                <Image src={item.image} alt={item.alt} width={900} height={450} className="w-full object-cover max-h-[450px]" />
                            </div>
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