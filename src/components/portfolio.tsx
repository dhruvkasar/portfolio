import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "motion/react";
import Lenis from "lenis";
import { ShaderAnimation } from "./ui/shader-animation";
import AnimatedGradientBackground from "./ui/animated-gradient-background";
import { GithubContributions } from "./github-contributions";
import { Github, Linkedin, Mail, ExternalLink, Instagram, FileCode2, Brain, Film, Lightbulb, Dumbbell, Workflow, Sun, Moon } from "lucide-react";

const skillCategories = [
  {
    category: "Languages",
    skills: [
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
      { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" }
    ]
  },
  {
    category: "Web & Databases",
    skills: [
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
      { name: "SQLite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg" }
    ]
  },
  {
    category: "DevOps",
    skills: [
      { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" },
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg", invert: true },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
      { name: "GitHub", icon: Github, isLucide: true },
      { name: "CI/CD", icon: Workflow, isLucide: true }
    ]
  },
  {
    category: "Interests",
    skills: [
      { name: "AI / Prompting", icon: Brain, isLucide: true },
      { name: "Video Editing", icon: Film, isLucide: true },
      { name: "Problem Solving", icon: Lightbulb, isLucide: true },
      { name: "Fitness", icon: Dumbbell, isLucide: true }
    ]
  }
];

const allSkills = skillCategories.flatMap(c => c.skills);
const half = Math.ceil(allSkills.length / 2);
const row1 = allSkills.slice(0, half);
const row2 = allSkills.slice(half);



import { SlideButton } from "./ui/slide-button";
import { DirectoryNav } from "./ui/directory-nav";
import { AnimatedAccordion } from "./ui/animated-accordion";
import { HoverPreview } from "./ui/hover-preview";
import { PerspectiveMarquee } from "./ui/remocn-perspective-marquee";

function PerspectiveMarqueeScene({ isDark, items, reverse, speedMultiplier = 1 }: { isDark: boolean, items: string[], reverse?: boolean, speedMultiplier?: number }) {
  return (
    <PerspectiveMarquee
      items={items}
      rotateY={reverse ? 28 : -28}
      rotateX={8}
      perspective={1200}
      pixelsPerFrame={2 * speedMultiplier}
      background={"transparent"}
      fadeColor={isDark ? "#050505" : "#f9fafb"}
      color={isDark ? "#fafafa" : "#171717"}
      fontSize={64}
    />
  );
}

// Parallax wrapper component
const ParallaxBox = ({ 
  children, 
  yOffset = 100, 
  className = "" 
}: { 
  children: React.ReactNode, 
  yOffset?: number, 
  className?: string 
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [yOffset, -yOffset]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
};

// Mask Reveal component
const MaskReveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number, key?: React.Key }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "0px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

import { DrawingSvgTransition } from "./ui/drawing-svg-transition";

export default function Portfolio() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  
  const [appState, setAppState] = useState<'initial-reveal' | 'slider' | 'transitioning' | 'portfolio'>('initial-reveal');
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [backgroundDelay, setBackgroundDelay] = useState(7);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setBackgroundDelay(0);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (appState !== 'portfolio') return;
    
    const lenis = new Lenis();

    let reqId: number;
    function raf(time: number) {
      lenis.raf(time);
      reqId = requestAnimationFrame(raf);
    }

    reqId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(reqId);
      lenis.destroy();
    };
  }, [appState]);

  return (
    <>
      {appState === 'initial-reveal' && (
        <DrawingSvgTransition 
          mode="out"
          onComplete={() => setAppState('slider')}
        />
      )}

      {appState === 'transitioning' && (
        <DrawingSvgTransition 
          onMidpoint={() => setShowPortfolio(true)}
          onComplete={() => setAppState('portfolio')}
        />
      )}
      
      {!showPortfolio ? (
        <div
          key="loader"
          className="min-h-screen dark:bg-[#050505] bg-gray-50 flex flex-col items-center justify-center p-6"
        >
          {/* The slider loader screen */}
          {appState === 'slider' && (
            <SlideButton onComplete={() => setAppState('transitioning')} />
          )}
        </div>
      ) : (
        <div
          key="portfolio"
          className="relative min-h-screen dark:bg-[#050505] bg-gray-50 dark:text-gray-200 text-gray-800 font-sans selection:bg-cyan-900 selection:text-white transition-colors duration-500"
        >
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="fixed top-6 right-6 md:top-10 md:right-10 z-50 p-3 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-300"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-indigo-600" />
            )}
          </button>

          <DirectoryNav />
          {/* Fixed Background Shader */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: backgroundOpacity }}
      >
        <AnimatePresence mode="popLayout">
          {theme === 'dark' ? (
            <motion.div 
              key="dark-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: backgroundDelay }}
              className="absolute inset-0"
            >
              <ShaderAnimation />
            </motion.div>
          ) : (
            <motion.div 
              key="light-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: backgroundDelay }}
              className="absolute inset-0"
            >
              <video 
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Content Container */}
      {appState === 'portfolio' && (
        <div className="relative z-10 w-full overflow-hidden">
        
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen flex flex-col justify-center px-6 max-w-7xl mx-auto pt-20 lg:pt-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
            <div className="text-left relative">
              {/* Invisible placeholder to maintain layout space when logo becomes fixed */}
              <div className="mb-4 opacity-0 pointer-events-none">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none">
                  DHRUV<br />KASAR
                </h1>
              </div>

              {/* Single animated logo element */}
              <motion.h1 
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  layout: { type: "spring", bounce: 0, duration: 0.7 },
                  opacity: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                  y: { duration: 0.8, ease: "easeOut", delay: 0.2 }
                }}
                onClick={() => isScrolled && window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={
                  isScrolled 
                    ? "fixed top-8 left-8 md:top-10 md:left-10 z-50 text-2xl md:text-3xl font-black dark:text-white text-gray-900 transition-colors duration-500 tracking-tighter leading-none cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-500 origin-top-left"
                    : "absolute top-0 left-0 text-6xl md:text-8xl lg:text-9xl font-black dark:text-white text-gray-900 transition-colors duration-500 tracking-tighter leading-none origin-top-left"
                }
              >
                DHRUV<br />KASAR
              </motion.h1>

              <MaskReveal delay={0.3}>
                <p className="text-xl dark:text-gray-400 text-gray-600 transition-colors duration-500 font-light max-w-md leading-relaxed">
                  IT Undergraduate & Developer building robust systems, clean interfaces, and engaging digital experiences.
                </p>
              </MaskReveal>
            </div>

            <ParallaxBox yOffset={100} className="w-full mt-12 lg:mt-0">
              <MaskReveal delay={0.4}>
                <AnimatedAccordion items={[
                  { title: "01 // Core Focus", content: "Specializing in Software Development, DevOps, and building scalable applications with modern technologies like React, Node, and Python." },
                  { title: "02 // Problem Solving", content: "Tackling complex challenges with logical, structured approaches. I believe in writing clean, maintainable code that scales." },
                  { title: "03 // Beyond Code", content: "Balancing technology with creativity through video editing, fitness training, and continuous learning in AI and prompting." }
                ]} />
              </MaskReveal>
            </ParallaxBox>
          </div>
        </section>

        {/* ABOUT ME */}
        <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <ParallaxBox yOffset={80} className="flex-1">
              <MaskReveal>
                <h2 className="text-4xl md:text-6xl font-bold dark:text-white text-gray-900 transition-colors duration-500 mb-8 tracking-tight">About Me</h2>
              </MaskReveal>
              <div className="space-y-6 text-lg dark:text-gray-400 text-gray-600 transition-colors duration-500 font-light leading-relaxed">
                <MaskReveal delay={0.1}>
                  <p>
                    I am an IT undergraduate based in Maharashtra, India, focused on building strong technical fundamentals and applying them through practical projects.
                  </p>
                </MaskReveal>
                <MaskReveal delay={0.2}>
                  <p>
                    I balance technology with creativity, fitness, and regular outdoor activities to maintain discipline and clarity. My core drivers are Software Development, DevOps & CI/CD, and Video Editing.
                  </p>
                </MaskReveal>
                <MaskReveal delay={0.3}>
                  <p>
                    Beyond the screen, I thrive on problem-solving—tackling complex challenges with logical, structured approaches—and maintain a strong body and mind through consistent training.
                  </p>
                </MaskReveal>
              </div>
            </ParallaxBox>
            <ParallaxBox yOffset={-80} className="flex-1 w-full">
              <MaskReveal>
                  <img 
                    src="/dhruv.jpeg" 
                    alt="Dhruv Kasar" 
                    className="w-full h-[400px] md:h-[600px] object-cover rounded-lg grayscale hover:grayscale-0 transition-all duration-500"
                  />
              </MaskReveal>
            </ParallaxBox>
          </div>
        </section>

        {/* SKILLS & TOOLS */}
        <section id="skills" className="pt-24 md:pt-32 pb-12 md:pb-16 relative overflow-hidden">
          <ParallaxBox yOffset={50}>
            <MaskReveal>
              <h2 className="text-4xl md:text-6xl font-bold dark:text-white text-gray-900 transition-colors duration-500 mb-8 md:mb-12 tracking-tight text-center px-6">Skills & Tools</h2>
            </MaskReveal>
            
            <div className="relative flex flex-col w-full pointer-events-none h-[160px]" style={{ position: 'relative' }}>
              <PerspectiveMarqueeScene 
                isDark={theme === 'dark'} 
                items={allSkills.map(s => s.name)} 
                speedMultiplier={0.3} 
              />
            </div>
          </ParallaxBox>
        </section>

        {/* EXPERIENCE & EDUCATION (Combined layout) */}
        <section id="experience" className="pt-12 pb-32 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24">
            
            {/* Experience */}
            <ParallaxBox yOffset={100}>
              <MaskReveal>
                <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900 transition-colors duration-500 mb-12 tracking-tight">Experience</h2>
              </MaskReveal>
              <div className="space-y-16">
                {[
                  {
                    role: "Data Analysis Intern",
                    company: "Imarticus Learning",
                    date: "Jan 2026 - Present",
                    description: "Participating in a technology-driven internship focused on building real-world skills in Data Analysis. Gaining hands-on, practical industry exposure working with Python, SQL, and Power BI."
                  },
                  {
                    role: "Software Dev Intern (Python)",
                    company: "L&D Infotech Pvt. Ltd.",
                    date: "Jun 2023 - Jul 2023",
                    description: "Gained hands-on experience with real-world projects, sharpening Python programming and software design skills. Explored, experimented, and grew both technically and personally."
                  }
                ].map((job, idx) => (
                  <MaskReveal key={idx} delay={idx * 0.1}>
                    <div className="border-l-2 border-cyan-500 pl-8">
                      <h3 className="text-2xl font-bold dark:text-white text-gray-900 transition-colors duration-500 ">{job.role}</h3>
                      <p className="dark:text-cyan-400 text-cyan-600 transition-colors duration-500 font-mono mt-2 mb-4">{job.company} // {job.date}</p>
                      <p className="dark:text-gray-400 text-gray-600 transition-colors duration-500 font-light leading-relaxed">{job.description}</p>
                    </div>
                  </MaskReveal>
                ))}
              </div>
            </ParallaxBox>

            {/* Education */}
            <ParallaxBox yOffset={60}>
              <MaskReveal>
                <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900 transition-colors duration-500 mb-12 tracking-tight">Education</h2>
              </MaskReveal>
              <div className="space-y-16">
                <MaskReveal delay={0.1}>
                  <div className="border-l-2 border-cyan-500 pl-8">
                    <h3 className="text-2xl font-bold dark:text-white text-gray-900 transition-colors duration-500 ">B.Tech in Information Technology</h3>
                    <div className="dark:text-cyan-400 text-cyan-600 transition-colors duration-500 font-mono mt-2 mb-4">
                      <HoverPreview 
                        text="Pillai College of Engineering" 
                        imageSrc="/pillai.png" 
                        altText="Pillai College of Engineering" 
                        href="https://www.pce.ac.in/"
                      /> // Nov 2024 - June 2027
                    </div>
                  </div>
                </MaskReveal>
                <MaskReveal delay={0.2}>
                  <div className="border-l-2 border-cyan-500 pl-8">
                    <h3 className="text-2xl font-bold dark:text-white text-gray-900 transition-colors duration-500 ">Diploma in Computer Engineering</h3>
                    <div className="dark:text-cyan-400 text-cyan-600 transition-colors duration-500 font-mono mt-2 mb-4">
                      <HoverPreview 
                        text="Navjeevan Education Society Polytechnic" 
                        imageSrc="/navjeevan.png" 
                        altText="Navjeevan Education Society Polytechnic" 
                        href="https://www.navjeevanedu.com/poly/polytechnic.html"
                      /> // 2022 - 2024
                    </div>
                  </div>
                </MaskReveal>
              </div>
            </ParallaxBox>

          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
          <ParallaxBox yOffset={40}>
            <MaskReveal>
              <h2 className="text-4xl md:text-6xl font-bold dark:text-white text-gray-900 transition-colors duration-500 mb-8 tracking-tight text-center">Featured Projects & Contributions</h2>
            </MaskReveal>
            <MaskReveal delay={0.2}>
              <div className="mb-24 flex justify-center">
                <GithubContributions username="dhruvkasar" theme={theme === 'dark' ? 'dark' : 'light'} />
              </div>
            </MaskReveal>
          </ParallaxBox>
          
          <div className="space-y-40">
            {[
              {
                title: "Aadhaar Data Analytics",
                desc: "UIDAI Hackathon 2026 Project. Developed a framework to unlock societal trends from Aadhaar enrolment/update datasets. Built interactive dashboards highlighting key insights to help stakeholders optimize resource allocation.",
                tech: ["Data Analysis", "EDA", "Data Visualization"],
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
                links: [{ label: "Dataset", url: "https://onedrive.live.com/:x:/g/personal/d19cdd5bb823f699/IQB5_SFOQX-OS5KRrds8xg7tAWcb3yR1QzxtAYS-kxmQk3o?rtime=DIF4tcGL3kg&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3gvYy9kMTljZGQ1YmI4MjNmNjk5L0lRQjVfU0ZPUVgtT1M1S1JyZHM4eGc3dEFXY2IzeVIxUXp4dEFZUy1reG1RazNvP2U9ZWEzRVBM" }]
              },
              {
                title: "Mental Health Platform",
                desc: "A web-based platform designed to provide accessible mental health resources and emergency support, featuring a user-friendly interface and structured navigation.",
                tech: ["HTML", "CSS", "JavaScript"],
                img: "/mentalhealth.png",
                links: [{ label: "GitHub", url: "https://github.com/dhruvkasar/Mentalhealthawarness" }]
              },
              {
                title: "Search Algorithm Visualizer",
                desc: "Implemented BFS and DFS algorithms to visualize decision-making processes in systems. Focused on logic building and algorithm visualization.",
                tech: ["Python", "JavaScript"],
                img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1200",
                links: []
              }
            ].map((project, idx) => (
              <div key={idx} className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                <ParallaxBox yOffset={-60} className="w-full lg:w-3/5">
                  <MaskReveal>
                    <img 
                      src={project.img} 
                      alt={project.title} 
                      className="w-full h-[400px] md:h-[500px] object-cover"
                    />
                  </MaskReveal>
                </ParallaxBox>
                <ParallaxBox yOffset={60} className="w-full lg:w-2/5">
                  <MaskReveal>
                    <p className="dark:text-cyan-400 text-cyan-600 transition-colors duration-500 font-mono mb-4">Project {idx + 1}</p>
                  </MaskReveal>
                  <MaskReveal delay={0.1}>
                    <h3 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 transition-colors duration-500 mb-6">{project.title}</h3>
                  </MaskReveal>
                  <MaskReveal delay={0.2}>
                    <p className="dark:text-gray-400 text-gray-600 transition-colors duration-500 font-light text-lg leading-relaxed mb-8">
                      {project.desc}
                    </p>
                  </MaskReveal>
                  <MaskReveal delay={0.3}>
                    <div className="flex flex-wrap gap-4 mb-8">
                      {project.tech.map(t => (
                        <span key={t} className="text-sm font-mono dark:text-gray-300 text-gray-700 transition-colors duration-500 dark:bg-[#111] bg-gray-200 px-3 py-1">
                          {t}
                        </span>
                      ))}
                    </div>
                  </MaskReveal>
                  <MaskReveal delay={0.4}>
                    <div className="flex gap-6">
                      {project.links.map(link => (
                        <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 dark:text-white text-gray-900 transition-colors duration-500 font-medium">
                          {link.label === "GitHub" ? <Github className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />} {link.label}
                        </a>
                      ))}
                    </div>
                  </MaskReveal>
                </ParallaxBox>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <motion.section 
          id="contact" 
          className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
          initial="initial"
          whileHover="hover"
        >
          <AnimatePresence mode="popLayout">
            {theme === 'dark' ? (
              <motion.div 
                key="dark-gradient"
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                whileHover={{ opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }}
                transition={{ duration: 1 }}
              >
                <AnimatedGradientBackground Breathing={true} />
              </motion.div>
            ) : (
              <motion.div 
                key="light-gradient"
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                whileHover={{ opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }}
                transition={{ duration: 1 }}
              >
                <AnimatedGradientBackground Breathing={true} 
                  gradientColors={["#f9fafb", "#06b6d4", "#e0f2fe", "#bae6fd", "#7dd3fc", "#0ea5e9", "#0284c7"]} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Edge Blend Overlay to seamlessly transition from the previous section */}
          <div className="absolute top-0 left-0 right-0 h-64 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/80 to-transparent opacity-100 dark:opacity-0 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="relative z-20 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <p className="dark:text-cyan-400 text-cyan-600 transition-colors duration-500 font-mono tracking-[0.3em] uppercase mb-6">What's Next?</p>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black dark:text-white text-gray-900 transition-colors duration-500 tracking-tighter mb-8">Get In Touch</h2>
              <p className="text-lg sm:text-xl dark:text-gray-400 text-gray-600 transition-colors duration-500 max-w-2xl mx-auto font-light leading-relaxed mb-16">
                Let's build something great. Currently open for new opportunities and collaborations. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
              
              <a 
                href="mailto:dhruvkasarhere@gmail.com" 
                className="inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-600 dark:hover:bg-cyan-400 text-white dark:text-black font-bold px-8 py-4 md:px-10 md:py-5 text-base md:text-lg transition-colors duration-500"
              >
                <Mail className="w-6 h-6" /> Say Hello
              </a>

              <div className="flex justify-center gap-10 mt-24">
                <a href="https://github.com/dhruvkasar" target="_blank" rel="noreferrer" className="dark:text-gray-400 text-gray-600 transition-colors duration-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-500 ">
                  <Github className="w-8 h-8" />
                </a>
                <a href="https://www.linkedin.com/in/dhruv-kasar-b69793391/" target="_blank" rel="noreferrer" className="dark:text-gray-400 text-gray-600 transition-colors duration-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-500 ">
                  <Linkedin className="w-8 h-8" />
                </a>
                <a href="https://www.instagram.com/dhruvvkasar/" target="_blank" rel="noreferrer" className="dark:text-gray-400 text-gray-600 transition-colors duration-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-500 ">
                  <Instagram className="w-8 h-8" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.section>
        </div>
      )}
        </div>
      )}
    </>
  );
}
