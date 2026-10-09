import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HoverPreviewProps {
  text: string;
  imageSrc: string;
  altText: string;
  href?: string;
}

export function HoverPreview({ text, imageSrc, altText, href }: HoverPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  const Wrapper = href ? "a" : "span";

  return (
    <Wrapper 
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      className="relative inline-block cursor-pointer dark:text-white text-gray-900 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors duration-300 underline decoration-cyan-500/30 underline-offset-4 dark:hover:decoration-cyan-400 hover:decoration-cyan-600"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max z-50 pointer-events-none"
          >
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden shadow-2xl shadow-cyan-900/20 p-2 relative">
              <img 
                src={imageSrc} 
                alt={altText} 
                className="object-contain rounded-lg bg-white p-2 max-w-[90vw] sm:max-w-md"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Triangle pointer */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0a0a0a] border-b border-r border-gray-800 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
