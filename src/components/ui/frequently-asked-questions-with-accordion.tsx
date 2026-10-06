"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./frequently-asked-questions-with-accordion-utils/accordion";

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
    id: "faq-1",
    question: "What is the purpose of the Triple Helix Innovation Platform?",
    answer:
      "The platform facilitates synchronized civic-technology collaboration among Government departments (Collectorate), Accredited Academic Institutions (Colleges & Universities), and Industry Leaders (Mentors). Real-world municipal challenges are transformed into production-grade student engineering prototypes.",
    category: "General"
  },
  {
    id: "faq-2",
    question: "Who can register as an Institution and form a student team?",
    answer:
      "AICTE/UGC accredited engineering colleges and universities in the region can register their institution. Once verified, institutions can assign dedicated faculty coordinators and register student teams (up to 5 students with 1 leader) for locked problem statements.",
    category: "Institutions"
  },
  {
    id: "faq-3",
    question: "What is the role of an Industry Mentor?",
    answer:
      "Industry mentors are seasoned domain architects and corporate engineering specialists. They conduct architectural reviews, critique hardware/software designs, and guide students through Milestone 1, 2, and 3 evaluations.",
    category: "Mentors"
  },
  {
    id: "faq-4",
    question: "How are project milestones reviewed and approved?",
    answer:
      "Student teams progress sequentially through Milestone 1 (System Architecture & Documentation), Milestone 2 (Development & Working Prototype), and Milestone 3 (Final Submission & Demo Video). Submissions are reviewed with formal feedback from mentors and vetted by the Super Admin.",
    category: "Projects"
  },
  {
    id: "faq-5",
    question: "Are certificates issued upon project completion?",
    answer:
      "Yes. Once Milestone 3 is approved, cryptographically verifiable digital certificates with official district seals and QR verification are generated for both the institution and each registered student team member.",
    category: "Certificates"
  },
  {
    id: "faq-6",
    question: "How do government departments deploy the completed solutions?",
    answer:
      "Following final approval and certification, high-impact prototypes are reviewed by the District Collector and designated municipal heads for municipal implementation, testing, and public deployment.",
    category: "Deployment"
  }
];

export default function FrequentlyAskedQuestions({
  title,
  description,
  data = defaultFAQs,
  className,
  supportEmail = "collectorate-innovation@tn.gov.in",
}: FrequentlyAskedQuestionsProps) {
  const hasTitle = Boolean(title && title.trim().length > 0);
  const hasDescription = Boolean(description && description.trim().length > 0);
  const words = hasTitle ? title!.split(" ") : [];

  return (
    <section className={cn("relative w-full overflow-hidden py-4 sm:py-6", className)}>
      <div className="mx-auto max-w-4xl px-2 sm:px-4">
        {hasTitle && (
          <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
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
                className="mr-2 inline-block text-[#10233F]"
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
            className="relative z-10 mx-auto mt-4 max-w-2xl text-center text-sm sm:text-base text-slate-600 md:text-lg leading-relaxed"
          >
            {description}{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="text-sky-700 underline underline-offset-4 hover:text-sky-900 transition-colors font-medium"
            >
              {supportEmail}
            </a>
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: hasTitle ? 0.35 : 0.1 }}
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
                  <AccordionTrigger className="text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-sky-700 py-3">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-slate-600 leading-relaxed pb-3 pt-1">
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
