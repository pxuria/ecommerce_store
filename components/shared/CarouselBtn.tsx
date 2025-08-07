"use client";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

const CarouselBtn = ({ children, onClick }: Props) => {
  return (
    <button
      className="min-w-10 w-12 h-12 bg-yellow_500 relative outline-none cursor-pointer rounded-md active:scale-[115%] transition-all ease-in duration-100"
      onClick={onClick}
      type="button"
      aria-label="Carousel Button"
    >
      {children}
    </button>
  );
};

export default CarouselBtn;
