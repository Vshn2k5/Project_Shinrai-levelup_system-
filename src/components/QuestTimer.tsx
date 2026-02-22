import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

type QuestTimerProps = {
  deadline: Date;
  onExpire?: () => void;
  className?: string;
};

const QuestTimer: React.FC<QuestTimerProps> = ({ deadline, onExpire, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const difference = deadlineTime - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
        if (onExpire) onExpire();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, expired: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  const isUrgent = timeLeft.hours < 2 && !timeLeft.expired;
  const isCritical = timeLeft.hours < 1 && !timeLeft.expired;

  if (timeLeft.expired) {
    return (
      <div className={`flex items-center text-red-400 ${className}`}>
        <AlertTriangle className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">EXPIRED</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${
      isCritical ? 'text-red-400 animate-pulse' : 
      isUrgent ? 'text-yellow-400' : 
      'text-gray-400'
    } ${className}`}>
      <Clock className="w-4 h-4 mr-1" />
      <span className="text-sm font-mono">
        {timeLeft.hours.toString().padStart(2, '0')}:
        {timeLeft.minutes.toString().padStart(2, '0')}:
        {timeLeft.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default QuestTimer;