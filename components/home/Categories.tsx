import CategoryCard from "../cards/CategoryCard";

const Categories = () => {
  return (
    <section className="my-16 mx-4 sm:mx-12" id="categories">
      <div className="flex flex-wrap-reverse md:flex-nowrap gap-4 h-fit">
        <div className="w-full md:w-1/2 flex flex-row items-satrt flex-wrap gap-4">
          {/* hat */}
          <CategoryCard
            link="products/1"
            imgSrc="/assets/images/hat.webp"
            linkClass="w-full md:w-[calc(50%-8px)] h-[240px] sm:h-[280px] md:h-[calc(50%-8px)]"
            imgAlt="hat"
            imgWidth={1500}
            imgHeight={900}
            priority
            imgClass="object-[70%_45%] group-hover:scale-110 group-hover:opacity-70"
            textClass="text-3xl lg:text-4xl right-full -bottom-full group-hover:right-4 group-hover:bottom-[10%] text-white"
          >
            مختلف ترین <br /> کلاه ها
          </CategoryCard>

          {/* croptop */}
          <CategoryCard
            link="products/1"
            imgSrc="/assets/images/croptop.webp"
            linkClass="w-full md:w-[calc(50%-8px)] h-[240px] sm:h-[280px] md:h-[calc(50%-8px)]"
            imgAlt="croptop"
            imgWidth={900}
            imgHeight={600}
            priority
            imgClass="object-[70%_27%] md:object-[70%_30%] group-hover:scale-110 group-hover:-translate-x-0 md:group-hover:-translate-x-4 group-hover:opacity-70"
            textClass="text-4xl right-0 -bottom-full group-hover:right-8 group-hover:bottom-[15%] text-white"
          >
            انواع <br />
            کراپ تاپ
          </CategoryCard>

          {/* T-shirt */}
          <CategoryCard
            link="products/1"
            imgSrc="/assets/images/tshirt3.jpg"
            linkClass="w-full md:w-[calc(50%-8px)] h-[240px] sm:h-[280px] md:h-[calc(50%-8px)]"
            imgAlt="Tshirt"
            imgWidth={1500}
            imgHeight={700}
            priority
            imgClass="object-[70%_0%] md:object-center group-hover:scale-110 group-hover:-translate-x-0 md:group-hover:-translate-x-4 group-hover:opacity-70"
            textClass="text-4xl right-0 -bottom-full group-hover:right-8 group-hover:bottom-[15%] text-white"
          >
            تیشرت های <br /> مختلف
          </CategoryCard>

          {/* jacket */}
          <CategoryCard
            link="products/1"
            imgSrc="/assets/images/jacket.jpg"
            linkClass="w-full md:w-[calc(50%-8px)] h-[240px] sm:h-[280px] md:h-[calc(50%-8px)]"
            imgAlt="jacket"
            imgWidth={1500}
            imgHeight={700}
            priority
            imgClass="object-[60%_10%] md:object-[60%_30%] group-hover:scale-110 group-hover:object-[70%_30%] md:group-hover:object-[100%_30%] group-hover:opacity-70"
            textClass="text-4xl right-0 -bottom-full group-hover:right-8 group-hover:bottom-[15%] text-white"
          >
            کاپشن های <br /> دخترانه
          </CategoryCard>
        </div>

        {/* hoodie */}
        <CategoryCard
          link="products/1"
          imgSrc="/assets/images/hoodie2.webp"
          linkClass="w-full md:w-1/2"
          imgAlt="hoodie"
          imgWidth={1800}
          imgHeight={1000}
          priority
          imgClass="object-[35%_30%] group-hover:scale-125 group-hover:opacity-85 min-h-[240px]"
          textClass="text-3xl sm:text-6xl md:text-5xl lg:text-7xl left-0 top-full group-hover:left-7 md:group-hover:left-16 group-hover:top-[15%] text-black text-center"
        >
          دورس <br /> & <br /> هودی
        </CategoryCard>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-4 mt-4">
        {/* glasses */}
        <CategoryCard
          link="products/1"
          linkClass="w-full md:w-1/2 h-[240px] sm:h-full"
          imgSrc="/assets/images/glasses.webp"
          imgAlt="glasses"
          imgWidth={2048}
          imgHeight={1150}
          imgClass="object-center group-hover:scale-110 group-hover:object-[100%_100%] group-hover:opacity-70"
          textClass="text-2xl sm:text-4xl md:text-6xl rotate-[25deg] -left-[75%] top-[10%] group-hover:left-1 sm:group-hover:left-4 group-hover:top-[20%] text-black"
        >
          خاص ترین <br /> عینک ها
        </CategoryCard>

        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-1/2">
          {/* socks */}
          <CategoryCard
            link="products/1"
            linkClass="w-full md:w-1/2 h-[240px] max-h-[360px] sm:h-full"
            imgSrc="/assets/images/socks3.jpg"
            imgAlt="socks"
            imgWidth={1200}
            imgHeight={400}
            imgClass="object-[50%_50%] group-hover:scale-110 group-hover:translate-x-2 sm:group-hover:translate-x-4 group-hover:opacity-75"
            textClass="text-4xl left-0 -bottom-full group-hover:left-10 group-hover:bottom-[10%] text-white"
          >
            جوراب های <br /> خاص
          </CategoryCard>

          {/* pants */}
          <CategoryCard
            link="products/1"
            linkClass="w-full md:w-1/2 h-[240px] max-h-[360px] sm:h-full"
            imgSrc="/assets/images/pants3.webp"
            imgAlt="pants"
            imgWidth={900}
            imgHeight={200}
            imgClass="object-center group-hover:scale-110 group-hover:translate-x-2 sm:group-hover:-translate-x-4 group-hover:opacity-75"
            textClass="text-4xl right-0 -bottom-full group-hover:right-4 group-hover:bottom-[10%] text-white"
          >
            شلوار های <br /> دخترانه
          </CategoryCard>
        </div>
      </div>
    </section>
  );
};

export default Categories;
