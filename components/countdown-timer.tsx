"use client"

import { useState, useEffect, useMemo } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  endTime: Date | string
  onEnd?: () => void
  className?: string
}

export default function CountdownTimer({ endTime, onEnd, className = "" }: CountdownTimerProps) {
  // Memoize parsedEndTime to prevent useEffect from running on every render
  const parsedEndTime = useMemo(() => typeof endTime === "string" ? new Date(endTime) : endTime, [endTime]);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let stopped = false;

    const calculateTimeLeft = () => {
      if (stopped) return;
      const now = new Date();
      const difference = parsedEndTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onEnd) onEnd();
        stopped = true;
        if (timer) clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    timer = setInterval(calculateTimeLeft, 1000);
    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
    };
  }, [parsedEndTime, onEnd])

  // Format the time units with leading zeros
  const formatTimeUnit = (value: number) => {
    return value < 10 ? `0${value}` : value
  }

  // Determine if the auction has ended
  const hasEnded = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  // Add spacing between time units (e.g., '5d 23:54:30')
  const timeString = hasEnded
    ? "Auction ended"
    : `${timeLeft.days}d ${formatTimeUnit(timeLeft.hours)}:${formatTimeUnit(timeLeft.minutes)}:${formatTimeUnit(timeLeft.seconds)}`;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Clock className="w-4 h-4 mr-1" />
      <span>{timeString}</span>
    </span>
  )
}
