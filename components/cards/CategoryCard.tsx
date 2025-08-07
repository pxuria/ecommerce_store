import Image from "next/image";
import Link from "next/link";

interface Props {
  link: string;
  children: React.ReactNode;
  imgSrc: string;
  imgAlt: string;
  imgWidth: number;
  imgHeight: number;
  priority?: boolean;
  loading?: "eager" | "lazy";
  linkClass: string;
  imgClass: string;
  textClass: string;
}

const CategoryCard = ({
  link,
  children,
  imgSrc,
  imgAlt,
  imgWidth,
  imgHeight,
  priority = false,
  loading,
  linkClass,
  imgClass,
  textClass,
}: Props) => {
  return (
    <Link href={link} className={`category_box group ${linkClass}`}>
      <Image
        src={imgSrc}
        alt={imgAlt}
        width={imgWidth}
        height={imgHeight}
        priority={priority}
        loading={loading}
        className={`w-full h-full object-cover transition-all duration-500 ${imgClass}`}
      />
      <span className={`category_box_text ${textClass}`}>{children}</span>
    </Link>
  );
};

export default CategoryCard;
