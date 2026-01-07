/**
 * Responsive Design Utilities
 */

import React from "react";

export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };
  
  export const useMediaQuery = (query: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    const [matches, setMatches] = React.useState(
      () => window.matchMedia(query).matches
    );
  
    React.useEffect(() => {
      const mediaQuery = window.matchMedia(query);
      const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);
  
    return matches;
  };
  
  export const useIsMobile = () => useMediaQuery(`(max-width: ${breakpoints.md - 1}px)`);
  export const useIsTablet = () => useMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`);
  export const useIsDesktop = () => useMediaQuery(`(min-width: ${breakpoints.lg}px)`);