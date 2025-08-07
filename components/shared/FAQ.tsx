import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FAQItems } from "@/constants";

const FAQ = () => {
  return (
    <div className="py-10 px-4 w-full lg:w-1/2 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-right text-pink_700">
        سوالات متداول
      </h2>
      <Accordion type="single" collapsible className="flex-column gap-2">
        {FAQItems.map((item) => (
          <AccordionItem
            value={item.value}
            className="bg-[#fff] px-4 rounded-lg shadow"
            key={item.value}
          >
            <AccordionTrigger className="">{item.question}</AccordionTrigger>
            <AccordionContent className="">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
