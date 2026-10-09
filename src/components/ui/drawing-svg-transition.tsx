import { motion, useAnimation } from "motion/react";
import { useEffect, useState, useRef } from "react";

export function DrawingSvgTransition({ 
  onMidpoint, 
  onComplete,
  color = "#ffffff", // Kept for backwards compatibility but unused
  mode = "both",
}: { 
  onMidpoint?: () => void;
  onComplete?: () => void;
  color?: string; // Kept for backwards compatibility but unused
  mode?: "both" | "out" | "in";
}) {
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  const onMidpointRef = useRef(onMidpoint);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onMidpointRef.current = onMidpoint;
    onCompleteRef.current = onComplete;
  }, [onMidpoint, onComplete]);

  useEffect(() => {
    let active = true;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    async function runAnimation() {
      const ease: [number, number, number, number] = [0.4, 0, 0.2, 1];
      const duration = 0.6;

      if (mode === "both" || mode === "in") {
        const p1 = controls1.start({
          y: "0%",
          transition: { duration, ease, delay: 0 }
        });
        const p2 = controls2.start({
          y: "0%",
          transition: { duration, ease, delay: 0.1 }
        });
        const p3 = controls3.start({
          y: "0%",
          transition: { duration, ease, delay: 0.2 }
        });

        await Promise.all([p1, p2, p3]);
        
        if (!active) return;
        if (onMidpointRef.current) {
          onMidpointRef.current();
        }

        if (mode === "in") {
           if (onCompleteRef.current) onCompleteRef.current();
           return;
        }

        // Give React time to render the heavy portfolio component (Shader, video)
        // to prevent frame drops which makes the sliding out feel stuck or laggy.
        await new Promise(r => setTimeout(r, 400));
        if (!active) return;
      }

      if (mode === "out") {
        controls1.set({ y: "0%" });
        controls2.set({ y: "0%" });
        controls3.set({ y: "0%" });
      }

      if (mode === "both" || mode === "out") {
        const p1 = controls1.start({
          y: "-100%",
          transition: { duration, ease, delay: 0.2 }
        });
        const p2 = controls2.start({
          y: "-100%",
          transition: { duration, ease, delay: 0.1 }
        });
        const p3 = controls3.start({
          y: "-100%",
          transition: { duration, ease, delay: 0 }
        });

        await Promise.all([p1, p2, p3]);
      }

      if (!active) return;
      if (onCompleteRef.current) onCompleteRef.current();
    }

    runAnimation();

    return () => { 
      active = false; 
      document.body.style.overflow = originalOverflow;
    };
  }, [controls1, controls2, controls3, mode]);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none w-screen h-screen overflow-hidden">
      <motion.div 
        className="absolute inset-0 w-full h-full bg-gray-300 dark:bg-neutral-800 will-change-transform"
        style={{ transform: mode === "out" ? "translateY(0%)" : "translateY(100%)" }}
        initial={false}
        animate={controls1}
      />
      <motion.div 
        className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-neutral-900 will-change-transform"
        style={{ transform: mode === "out" ? "translateY(0%)" : "translateY(100%)" }}
        initial={false}
        animate={controls2}
      />
      <motion.div 
        className="absolute inset-0 w-full h-full bg-gray-50 dark:bg-[#050505] will-change-transform"
        style={{ transform: mode === "out" ? "translateY(0%)" : "translateY(100%)" }}
        initial={false}
        animate={controls3}
      />
    </div>
  );
}
