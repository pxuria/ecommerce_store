import EmblaCarousel from "../shared/carousel/EmblaCarousel"
import { EmblaOptionsType } from 'embla-carousel'

const HeroSlider = () => {
    const OPTIONS: EmblaOptionsType = { loop: true }
    const SLIDES = [
        { image: '/assets/images/banner.jpg', alt: 'banner1' },
        { image: '/assets/images/banner3.jpg', alt: 'banner2' },
        { image: '/assets/images/banner4.jpg', alt: 'banner3' },
        { image: '/assets/images/banner5.png', alt: 'banner4' },
    ]

    return (<EmblaCarousel slides={SLIDES} options={OPTIONS} />)
}

export default HeroSlider