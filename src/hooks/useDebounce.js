import { useState, useEffect } from "react";

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: This runs if the 'value' changes before the timeout
    // fires, resetting the timer. This is the core of debouncing.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect only when value or delay changes

  return debouncedValue;
}
