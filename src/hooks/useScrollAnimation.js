import { useInView } from "framer-motion";
import { useRef } from "react";

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px",
    ...options 
  });
  
  return { ref, isInView };
}

export function useParallax(initialValue = 0, range = 30) {
  const ref = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    return {
      x: deltaX * range,
      y: deltaY * range
    };
  };
  
  return { ref, handleMouseMove };
}
