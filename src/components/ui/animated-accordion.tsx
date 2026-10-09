import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

interface AccordionItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
  key?: React.Key;
}

const AccordionItem = ({ title, content, isOpen, onClick, index }: AccordionItemProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
      className="border-b dark:border-gray-800/60 border-gray-200 overflow-hidden transition-colors duration-500"
    >
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className={`text-lg md:text-xl font-mono tracking-tight transition-colors duration-500 ${isOpen ? 'dark:text-cyan-400 text-cyan-600' : 'dark:text-gray-400 text-gray-500 dark:group-hover:text-gray-200 group-hover:text-gray-900'}`}>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className={`flex-shrink-0 ml-4 transition-colors duration-500 ${isOpen ? 'dark:text-cyan-400 text-cyan-600' : 'dark:text-gray-600 text-gray-400 dark:group-hover:text-gray-400 group-hover:text-gray-700'}`}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-8">
              <p className="dark:text-gray-400 text-gray-600 font-light leading-relaxed text-base md:text-lg transition-colors duration-500">
                {content}
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function AnimatedAccordion({ items }: { items: { title: string, content: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-xl mx-auto lg:ml-auto lg:mr-0">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          index={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
