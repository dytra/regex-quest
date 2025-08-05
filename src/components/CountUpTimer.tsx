import React, { useEffect, useState } from 'react';

type CountUpTimerProps = {
  startSeconds?: number; // Optional starting point
};

const formatTime = (totalSeconds: number) => {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const CountUpTimer: React.FC<CountUpTimerProps> = ({ startSeconds = 0 }) => {
  const [seconds, setSeconds] = useState(startSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>{formatTime(seconds)}</div>;
};

export default CountUpTimer;
