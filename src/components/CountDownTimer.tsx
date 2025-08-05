"use client";
import React, { useEffect, useState } from 'react';

type CountdownTimerProps = {
  initialSeconds: number;
};

const formatTime = (totalSeconds: number) => {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  return <div>{formatTime(secondsLeft)}</div>;
};

export default CountdownTimer;
