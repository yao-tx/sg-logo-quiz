import { useEffect, useState } from "react";

export const useCountdown = (initialCount: number) => {
  const [countdown, setCountdown] = useState(initialCount);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (isRunning && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsRunning(false);
    }
  }, [isRunning, countdown]);

  const reset = (newCountdown: number) => {
    setCountdown(newCountdown);
    setIsRunning(true);
  };

  return { countdown, reset, isRunning };
}