"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/frequently-asked-questions-with-accordion-utils/accordion";

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FrequentlyAskedQuestionsProps {
  title?: string;
  description?: string;
  data?: FAQItem[];
  className?: string;
  supportEmail?: string;
}

export const defaultFAQs: FAQItem[] = [
  {
    question: "What is the purpose of this website?",
    answer:
      "This website is a place to help you find the best products and services in the world. We curate top-quality offerings so you can make informed decisions without spending hours on research.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team by emailing support@example.com or by using the live chat widget in the bottom-right corner of the page. We typically respond within 24 hours on business days.",
  },
  {
    question: "How do I find the best products?",
    answer:
      "Use the search bar at the top of the page to browse by category, keyword, or brand. You can also filter results by rating, price range, and availability to quickly narrow down the best options for your needs.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Yes, we offer a hassle-free 30-day return policy on most items. Simply visit your order history, select the item you wish to return, and follow the instructions. Refunds are processed within 5–7 business days.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "We ship to over 50 countries worldwide. International shipping rates and estimated delivery times are calculated at checkout based on your location and the items in your cart.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order has been dispatched, you will receive a confirmation email with a tracking number. You can use this number on our order tracking page or directly on the carrier's website to follow your package in real time.",
  },
];

export default function FrequentlyAskedQuestions({
  title,
  description,
  data = defaultFAQs,
  className,
  supportEmail = "support@example.com",
}: FrequentlyAskedQuestionsProps) {
  const hasTitle = Boolean(title && title.trim().length > 0);
  const hasDescription = Boolean(description && description.trim().length > 0);
  const words = hasTitle ? title!.split(" ") : [];

  return (
    <section className={cn("relative w-full overflow-hidden py-4 sm:py-6", className)}>
      <div className="mx-auto max-w-4xl px-2 sm:px-4">
        {hasTitle && (
          <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl font-bold tracking-tight text-zinc-800 md:text-5xl lg:text-6xl dark:text-zinc-100">
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        )}

        {hasDescription && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative z-10 mx-auto mt-4 max-w-2xl text-center text-sm sm:text-base text-zinc-500 dark:text-zinc-400 md:text-lg"
          >
            {description}{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {supportEmail}
            </a>
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: hasTitle ? 0.4 : 0.1 }}
          className={hasTitle || hasDescription ? "mt-8 sm:mt-10" : "mt-2"}
        >
          <Accordion type="single" collapsible className="w-full space-y-2">
            {data.map((item, index) => (
              <motion.div
                key={`faq-${item.id || index}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.04,
                  ease: "easeOut",
                }}
              >
                <AccordionItem 
                  value={`item-${index}`} 
                  className="rounded-xl border border-slate-200/90 bg-white/70 px-4 py-1 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <AccordionTrigger className="text-left text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-sky-700 py-3">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pb-3 pt-1">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

export { FrequentlyAskedQuestions };
