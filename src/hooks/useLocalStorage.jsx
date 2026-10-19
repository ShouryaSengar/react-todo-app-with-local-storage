import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const localValue = window.localStorage.getItem(key);
      if (localValue !== null) {
        return JSON.parse(localValue);
      }
      return typeof initialValue === "function" ? initialValue() : initialValue;
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving to localStorage for key "${key}":`, err);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;