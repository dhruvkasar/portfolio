import { useEffect, useState } from "react";
import { AlignLeft } from "lucide-react";
import { motion } from "motion/react";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "skills", label: "Skills & Tools" },
  { id: "experience", label: "Experience & Education" },
  { id: "projects", label: "Featured Projects" },
  { id: "contact", label: "Contact" },
];

export function DirectoryNav() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.3);

      let currentActive = "home";
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if the section is currently in the middle of the viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
             currentActive = section.id;
             break;
          }
        }
      }
      
      // Fallback for bottom of the page
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        currentActive = "contact";
      }

      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    // Call once to set initial state
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className={`fixed right-8 bottom-12 z-50 hidden lg:flex flex-col font-sans transition-opacity duration-500 w-56 ${
        isScrolled && activeSection !== "contact" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold dark:text-gray-300 text-gray-700">
        <AlignLeft className="w-4 h-4" />
        On this page
      </div>
      <div className="relative flex flex-col">
        {/* Full background vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] dark:bg-white/10 bg-black/10 transition-colors duration-500" />

        {sections.map(({ id, label }, index) => {
          const isActive = activeSection === id;
          
          return (
            <div 
              key={id} 
              className="relative flex items-center group cursor-pointer py-2" 
              onClick={() => scrollTo(id)}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute left-0 top-0 bottom-0 w-[2px] -ml-[0.5px] dark:bg-white bg-black z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span 
                className={`ml-5 text-sm transition-all duration-300 ${
                  isActive 
                    ? "dark:text-white text-black font-semibold" 
                    : "dark:text-gray-400 text-gray-500 dark:group-hover:text-gray-300 group-hover:text-gray-700 font-medium"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
