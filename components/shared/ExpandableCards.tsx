import Image from "next/image";
import classes from "./ExpandableCards.module.css";

const images = [
  "/assets/images/hat.webp",
  "/assets/images/croptop.webp",
  "/assets/images/hat2.webp",
  "/assets/images/hoodie1.jpg",
  "/assets/images/hoodie2.webp",
  "/assets/images/jacket.jpg",
  "/assets/images/tshirt2.jpg",
];

const ExpandableCards = () => {
  return (
    <section className={classes.container}>
      {images.map((src, index) => (
        <div key={index} className={classes.expand_img}>
          <Image
            src={src}
            width={1100}
            height={900}
            alt="image"
            className={`${classes.expand_img} ${classes.image}`}
          />
        </div>
      ))}
    </section>
  );
};

export default ExpandableCards;
