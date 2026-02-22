import React, { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';

type CoinAnimationProps = {
  amount: number;
  onComplete?: () => void;
};

const CoinAnimation: React.FC<CoinAnimationProps> = ({ amount, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-bounce">
        <div className="flex items-center bg-yellow-500 text-black px-4 py-2 rounded-full shadow-lg animate-pulse">
          <Coins className="w-6 h-6 mr-2 animate-spin" />
          <span className="font-bold text-lg">+{amount}</span>
        </div>
      </div>
    </div>
  );
};

export default CoinAnimation;