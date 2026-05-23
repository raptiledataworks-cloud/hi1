// components/layout/TopBar.tsx
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export const TopBar = ({ onMenuToggle, sidebarOpen }: TopBarProps) => {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 md:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          {/* Hamburger / Close menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="h-9 w-9 rounded-xl hover:bg-secondary/80"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          {/* Logo + Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md shadow-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-600">
              <img src="/logo-192.png" alt="RupeeRiser" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-display text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
              RupeeRiser
            </h1>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/profile')}
          className="h-9 w-9 rounded-full"
        >
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
              {user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
           </div>
        </Button>
      </div>
    </header>
  );
};