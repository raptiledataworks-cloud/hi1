import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import {
  LayoutDashboard,
  ArrowLeftRight,
  CalendarDays,
  Settings,
  Sparkles,
  User,
  LogOut,
  Wallet,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navKeys = [
  { path: '/dashboard',    icon: LayoutDashboard, key: 'dashboard' },
  { path: '/transactions', icon: ArrowLeftRight,  key: 'transactions' },
  { path: '/calendar',     icon: CalendarDays,    key: 'calendar' },
  { path: '/habits',       icon: Sparkles,        key: 'habits' },
  { path: '/setup',        icon: Wallet,          key: 'setup' },
  { path: '/settings',     icon: Settings,        key: 'settings' },
  { path: '/profile',      icon: User,            key: 'profile' },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, language } = useApp();

  return (
    <>
      {/* MOBILE SIDEBAR (slide-over) */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card/95 backdrop-blur-2xl border-r border-border/40 shadow-2xl shadow-black/20 transition-all duration-300 ease-in-out md:hidden",
        isOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full"
      )}>
        <SidebarContent
          isOpen={true}
          onToggle={onToggle}
          location={location}
          navigate={navigate}
          user={user}
          logout={logout}
          language={language}
          alwaysExpanded
        />
      </aside>

      {/* DESKTOP SIDEBAR (collapsible) */}
      <aside className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 border-r border-border/40 bg-card/60 backdrop-blur-2xl transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-[72px]"
      )}>
        <SidebarContent
          isOpen={isOpen}
          onToggle={onToggle}
          location={location}
          navigate={navigate}
          user={user}
          logout={logout}
          language={language}
        />
      </aside>
    </>
  );
};

function SidebarContent({ isOpen, onToggle, location, navigate, user, logout, language, alwaysExpanded }: any) {
  const expanded = alwaysExpanded || isOpen;

  return (
    <>
      {/* Brand + Toggle */}
      <div className={cn(
        "flex items-center border-b border-border/40 px-3",
        expanded ? "h-16" : "h-20"
      )}>
        {expanded ? (
          /* EXPANDED: Logo + Title + Toggle button */
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <img src="/logo-192.png" alt="RupeeRiser" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-display text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 whitespace-nowrap">
                RupeeRiser
              </h1>
            </div>
            <button
              onClick={onToggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 shrink-0"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-[18px] h-[18px]" />
            </button>
          </div>
        ) : (
          /* COLLAPSED: Logo on top, toggle below, centered */
          <div className="flex flex-col items-center justify-center w-full gap-1.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <img src="/logo-192.png" alt="RupeeRiser" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={onToggle}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
              title="Expand sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navKeys.map(({ path, icon: Icon, key }) => {
          const isActive = location.pathname === path;
          const label = t(key, language);
          return (
            <button
              key={path}
              onClick={() => {
                navigate(path);
                if (alwaysExpanded) onToggle();
              }}
              title={!expanded ? label : undefined}
              className={cn(
                'flex items-center gap-3 w-full rounded-xl text-sm font-medium transition-all duration-200 group relative',
                expanded ? 'px-4 py-2.5' : 'px-0 py-2.5 justify-center',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
              )}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {expanded && <span className="truncate">{label}</span>}
              
              {/* Tooltip for collapsed state */}
              {!expanded && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                  {label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-border/40 p-3">
        {expanded ? (
          <>
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20 shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('logout', language)}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <button
              onClick={logout}
              title={t('logout', language)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
