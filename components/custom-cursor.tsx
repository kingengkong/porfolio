"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorColor, setCursorColor] = useState("#FFC300");
  const [isMoving, setIsMoving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Trail positions
  const [trailPositions, setTrailPositions] = useState<Array<{x: number, y: number, id: number}>>([]);
  const trailIdRef = useRef(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
      
      // Set moving state
      setIsMoving(true);
      
      // Add trail position
      const newTrail = {
        x: e.clientX,
        y: e.clientY,
        id: trailIdRef.current++
      };
      
      setTrailPositions(prev => [...prev.slice(-5), newTrail]); // Keep last 5 positions
      
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout to stop moving after 150ms
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
        setTrailPositions([]); // Clear trails when stopped
      }, 150);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const updateCursorColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        setCursorColor("#FFC300"); // Dark mode: Gold
      } else {
        setCursorColor("#050505"); // Light mode: Black
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    
    const observer = new MutationObserver(updateCursorColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    updateCursorColor();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Cursor utama - titik kecil */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          backgroundColor: isHovering ? "#FFFFFF" : cursorColor,
          scale: isHovering ? 1.5 : 1,
        }}
      />

      {/* Shadow trail yang mengikuti cursor */}
      <AnimatePresence>
        {isMoving && trailPositions.map((position, index) => {
          const opacity = (index + 1) / trailPositions.length * 0.6;
          const size = 20 + (index * 8);
          
          return (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: opacity,
                scale: isHovering ? 1.3 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed rounded-full pointer-events-none z-[9998]"
              style={{
                left: position.x - size / 2,
                top: position.y - size / 2,
                width: size,
                height: size,
                backgroundColor: cursorColor,
                filter: "blur(8px)",
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Glow effect saat hover */}
      {isHovering && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed rounded-full pointer-events-none z-[9997]"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            width: 40,
            height: 40,
            marginLeft: -12,
            marginTop: -12,
            backgroundColor: `${cursorColor}40`, // 40% opacity
            filter: "blur(12px)",
          }}
        />
      )}

      {/* Text hint saat hover */}
      {isHovering && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-0 left-0 pointer-events-none z-[9997] text-xs font-bold uppercase tracking-wider"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            color: cursorColor,
            marginTop: "-40px",
            marginLeft: "10px",
          }}
        >
          Click
        </motion.div>
      )}
    </>
  );
}