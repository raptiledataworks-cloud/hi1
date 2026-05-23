import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Plus,
  Sparkles,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';

// Left 2 items | Center + button | Right 2 items
const leftItems = [
  { path: '/dashboard',    icon: LayoutDashboard, label: 'Home' },
  { path: '/transactions', icon: ArrowLeftRight,  label: 'Txns' },
];

const rightItems = [
  { path: '/habits',       icon: Sparkles,        label: 'Habits' },
  { path: '/settings',     icon: Settings,        label: 'Settings' },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const renderNavButton = ({ path, icon: Icon, label }: typeof leftItems[0]) => {
    const isActive = location.pathname === path;
    return (
      <button
        key={path}
        onClick={() => navigate(path)}
        className={cn(
          'flex flex-col items-center justify-center gap-0.5 flex-1 h-14 rounded-2xl transition-all duration-200',
          isActive
            ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 scale-105'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Icon className={cn('w-5 h-5 transition-all', isActive && 'stroke-[2.5]')} />
        <span className={cn('text-[10px] font-medium', isActive && 'font-bold')}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50 md:hidden safe-area-bottom">
        <div className="flex items-center h-16 px-2 max-w-lg mx-auto relative">
          {/* Left 2 items */}
          {leftItems.map(renderNavButton)}
          
          {/* Center + Button */}
          <div className="flex items-center justify-center flex-1">
            <button
              onClick={() => setIsAddOpen(true)}
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center',
                'bg-gradient-to-br from-blue-600 to-indigo-600 text-white',
                'shadow-lg shadow-blue-500/40',
                'hover:scale-105 active:scale-95 transition-all duration-200',
                '-mt-6 ring-4 ring-background'
              )}
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>

          {/* Right 2 items */}
          {rightItems.map(renderNavButton)}
        </div>
      </nav>

      <AddTransactionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </>
  );
};
