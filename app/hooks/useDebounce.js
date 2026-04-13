import { useState, useEffect } from "react";

/**
 * Debounce a value — returns the latest value only after
 * no changes have occurred for `delay` ms.
 *
 * @param {*} value  The value to debounce
 * @param {number} delay  Milliseconds to wait (default 400)
 * @returns {*} The debounced value
 */
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
