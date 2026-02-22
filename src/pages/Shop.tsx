import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useProdigyStore } from '../store';
import { ShopItem } from '../types';
import { 
  Shield, 
  Zap, 
  Coins, 
  Award, 
  Frame, 
  Clock,
  CheckCircle,
  ShoppingCart
} from 'lucide-react';

const Shop: React.FC = () => {
  const { user, purchaseItem, shopItems } = useProdigyStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchaseAnimation, setPurchaseAnimation] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Items', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'booster', name: 'Boosters', icon: <Zap className="w-4 h-4" /> },
    { id: 'protection', name: 'Protection', icon: <Shield className="w-4 h-4" /> },
    { id: 'cosmetic', name: 'Cosmetics', icon: <Frame className="w-4 h-4" /> },
    { id: 'special', name: 'Special', icon: <Award className="w-4 h-4" /> }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const handlePurchase = (item: ShopItem) => {
    if (user.coins >= item.price && !item.owned) {
      setPurchaseAnimation(item.id);
      purchaseItem(item.id);
      
      setTimeout(() => {
        setPurchaseAnimation(null);
      }, 1000);
    }
  };

  const getItemIcon = (item: ShopItem) => {
    switch (item.effect.type) {
      case 'streak_freeze': return <Shield className="w-6 h-6" />;
      case 'xp_multiplier': return <Zap className="w-6 h-6 text-purple-400" />;
      case 'coin_multiplier': return <Coins className="w-6 h-6 text-yellow-400" />;
      case 'badge': return <Award className="w-6 h-6 text-blue-400" />;
      case 'frame': return <Frame className="w-6 h-6 text-pink-400" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <Layout currentPage="shop">
      <div className="mb-6">
        <h1 className="text-2xl font-['Orbitron'] font-bold mb-1">HUNTER SHOP</h1>
        <p className="text-gray-400">Enhance your journey with powerful items and cosmetics.</p>
      </div>

      {/* Coin Balance */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-yellow-900/30">
        <div className="flex items-center justify-center">
          <Coins className="w-8 h-8 text-yellow-400 mr-3 animate-spin" />
          <div>
            <div className="text-2xl font-bold text-yellow-400">{user.coins.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Available Coins</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 bg-gray-800/50 p-2 rounded-lg">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-indigo-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {category.icon}
            <span className="ml-2 hidden sm:inline">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-gray-800 rounded-lg p-6 border border-indigo-900/30 transition-all duration-300 hover:transform hover:scale-105 ${
              purchaseAnimation === item.id ? 'animate-pulse border-yellow-400' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {getItemIcon(item)}
                <div className="ml-3">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </div>
              
              {item.owned && (
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-xs">Owned</span>
                </div>
              )}
            </div>

            {/* Effect Details */}
            <div className="bg-gray-700/50 rounded p-3 mb-4">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Effect:</span>
                  <span className="text-white font-medium">
                    {item.effect.type === 'xp_multiplier' && `${item.effect.value}x XP`}
                    {item.effect.type === 'coin_multiplier' && `${item.effect.value}x Coins`}
                    {item.effect.type === 'streak_freeze' && `${item.effect.value} day protection`}
                    {item.effect.type === 'badge' && 'Cosmetic Badge'}
                    {item.effect.type === 'frame' && 'Profile Frame'}
                  </span>
                </div>
                
                {item.effect.duration && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{formatDuration(item.effect.duration)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Active Status */}
            {item.active && item.expiresAt && (
              <div className="bg-blue-900/30 border border-blue-700 rounded p-2 mb-4">
                <div className="flex items-center text-blue-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Active until {new Date(item.expiresAt).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Purchase Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Coins className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-lg font-bold text-yellow-400">
                  {item.price.toLocaleString()}
                </span>
              </div>
              
              <button
                onClick={() => handlePurchase(item)}
                disabled={item.owned || user.coins < item.price}
                className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
                  item.owned
                    ? 'bg-green-700 text-green-300 cursor-not-allowed'
                    : user.coins >= item.price
                    ? 'bg-indigo-700 hover:bg-indigo-600 text-white transform hover:scale-105'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {item.owned ? 'Owned' : user.coins >= item.price ? 'Purchase' : 'Insufficient Coins'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-gray-400">Try selecting a different category.</p>
        </div>
      )}
    </Layout>
  );
};

export default Shop;