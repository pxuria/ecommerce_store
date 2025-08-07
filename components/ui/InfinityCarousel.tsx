import Image from "next/image";
import Slider from "react-slick";

interface Props {
  slides: string[];
  custumClass?: string;
}

const InfinityCarousel = ({ slides, custumClass }: Props) => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    swipe: false,
    touchMove: false,
    draggable: false,
    slidesToScroll: 1,
    autoplay: true,
    swipeToSlide: false,
    centerPadding: "45px",
    speed: 4000,
    autoplaySpeed: 4000,
    cssEase: "linear",
    centerMode: true,
    focusOnSelect: false,
    nextArrow: <></>,
    prevArrow: <></>,
  };
  return (
    <Slider {...settings} className={`w-1/2 ${custumClass}`}>
      {slides.map((item, index) => (
        <div className="mt-auto h-full px-2" key={index}>
          <Image
            src={item}
            className="hero-img-slider"
            alt="hero"
            draggable="false"
            width={120}
            height={120}
          />
        </div>
      ))}
    </Slider>
  );
};

export default InfinityCarousel;
