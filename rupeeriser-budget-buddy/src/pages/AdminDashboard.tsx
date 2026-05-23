import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { endpoints } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Users,
  Eye,
  EyeOff,
  X,
  Wallet,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  RefreshCw,
  Trash2,
  Key,
  Server,
  Filter,
  CheckCircle2,
  Settings,
  MoreVertical,
  LogOut,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Verified Badge Custom SVG Component (Official Starburst Look)
const VerifiedBadge = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("text-blue-500 fill-current", className)} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C11.5 2 11.1 2.2 10.7 2.4L9 3.5C8.6 3.8 8 3.8 7.6 3.7L5.7 3C5.2 2.8 4.7 2.9 4.3 3.3C3.9 3.7 3.8 4.2 4 4.7L4.7 6.6C4.8 7 4.8 7.6 4.5 8L3.4 9.7C3.2 10.1 3 10.5 3 11V13C3 13.5 3.2 13.9 3.4 14.3L4.5 16C4.8 16.4 4.8 17 4.7 17.4L4 19.3C3.8 19.8 3.9 20.3 4.3 20.7C4.7 21.1 5.2 21.2 5.7 21L7.6 20.3C8 20.2 8.6 20.2 9 20.5L10.7 21.6C11.1 21.8 11.5 22 12 22C12.5 22 12.9 21.8 13.3 21.6L15 20.5C15.4 20.2 16 20.2 16.4 20.3L18.3 21C18.8 21.2 19.3 21.1 19.7 20.7C20.1 20.3 20.2 19.8 20 19.3L19.3 17.4C19.2 17 19.2 16.4 19.5 16L20.6 14.3C20.8 13.9 21 13.5 21 13V11C21 10.5 20.8 10.1 20.6 9.7L19.5 8C19.2 7.6 19.2 7 19.3 6.6L20 4.7C20.2 4.2 20.1 3.7 19.7 3.3C19.3 2.9 18.8 2.8 18.3 3L16.4 3.7C16 3.8 15.4 3.8 15 3.5L13.3 2.4C12.9 2.2 12.5 2 12 2Z"/>
    <path fill="white" d="M10.5 16L6 11.5L7.4 10.1L10.5 13.2L16.6 7L18 8.4L10.5 16Z"/>
  </svg>
);


interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  city?: string;
  state?: string;
  is_verified?: boolean;
}

const ADMIN_MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const isAdminEmail = (email: string) => {
  if (!email) return false;
  return ADMIN_MONTHS.some(m => email === `rupeeraiser${m}@gmail.com`);
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, language } = useApp();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Layout State
  const [filter, setFilter] = useState<'all' | 'admins' | 'verified' | 'normal'>('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Create User Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '' });
  const [isCreating, setIsCreating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await endpoints.getAdminUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const viewUser = async (userId: string) => {
    setDetailLoading(true);
    try {
      const res = await endpoints.getAdminUserData(userId);
      setSelectedUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user data', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAdminDeleteUser = async (userId: string) => {
    const confirmation = window.prompt("Type 'DELETE' to permanently purge this user and all data:");
    if (confirmation !== "DELETE") return toast.info("Action cancelled.");
    
    try {
      await endpoints.deleteAdminUser(userId);
      toast.success("User permanently deleted.");
      setSelectedUser(null);
      fetchUsers(); 
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Delete failed");
    }
  };

  const handleAdminChangePassword = async (userId: string) => {
    const newPassword = window.prompt("Enter the new password for this user:");
    if (!newPassword || newPassword.length < 5) return toast.error("Password must be at least 5 characters.");
    
    try {
      await endpoints.updateAdminUserPassword(userId, newPassword);
      toast.success("Password successfully overwritten.");
      setSelectedUser((prev: any) => ({
        ...prev,
        user: { ...prev.user, password_text: newPassword }
      }));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Password change failed");
    }
  };

  const handleAdminCreateUser = () => {
    setCreateForm({ name: '', email: '', password: '' });
    setIsCreateModalOpen(true);
    setMenuOpen(false);
  };

  const handleSubmitCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.password) {
      return toast.error("All fields are required");
    }
    if (createForm.password.length < 5) {
      return toast.error("Password must be at least 5 characters");
    }
    
    setIsCreating(true);
    try {
      await endpoints.adminCreateUser(createForm);
      toast.success("Verified User created successfully!");
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === 'all') return true;
    if (filter === 'admins') return isAdminEmail(u.email);
    if (filter === 'verified') return u.is_verified && !isAdminEmail(u.email);
    if (filter === 'normal') return !u.is_verified && !isAdminEmail(u.email);
    return true;
  });

  const totalIncome = (txs: any[]) =>
    txs.filter((t) => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpense = (txs: any[]) =>
    txs.filter((t) => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-6 pb-24 space-y-6 animate-fade-in font-sans min-h-screen bg-background">
      {/* HEADER & MENU */}
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-xl z-30 py-3 -m-3 p-3 sm:m-0 sm:p-0 rounded-b-2xl border-b border-border/50 sm:border-0 sm:bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-tight">
              {t('admin_dashboard', language)}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Monitoring
            </p>
          </div>
        </div>
        
        {/* Desktop Dropdown Menu */}
        <div className="hidden sm:block relative" ref={menuRef}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full shadow-sm hover:bg-secondary/80 bg-card border-border/60 w-10 h-10"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border/50 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Admin Actions
              </div>
              <button 
                onClick={handleAdminCreateUser}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-blue-500/10 hover:text-blue-600 text-foreground transition-colors font-medium text-left"
              >
                <UserPlus className="w-4 h-4" /> Create Verified User
              </button>
              <button 
                onClick={() => { fetchUsers(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 text-foreground transition-colors font-medium text-left"
              >
                <RefreshCw className="w-4 h-4" /> Sync Database
              </button>
              <div className="h-[1px] bg-border/50 my-1"></div>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-red-500/10 text-red-500 transition-colors font-medium text-left"
              >
                <LogOut className="w-4 h-4" /> Secure Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STATS CARDS - GRID LAYOUT */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-3 shadow-sm transition-all hover:bg-card text-center sm:text-left focus-within:ring-2 ring-blue-500/50">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">{users.length}</p>
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('total_users', language)}</p>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-3 shadow-sm transition-all hover:bg-card text-center sm:text-left focus-within:ring-2 ring-emerald-500/50">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Active</p>
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('system_status', language)}</p>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-3 shadow-sm transition-all hover:bg-card text-center sm:text-left col-span-2 lg:col-span-1 focus-within:ring-2 ring-orange-500/50">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
            <Server className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Active</p>
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Cloud Storage</p>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button 
          onClick={() => setFilter('all')}
          className={cn("px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border shrink-0", filter === 'all' ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:bg-secondary")}
        >
          All Users
        </button>
        <button 
          onClick={() => setFilter('admins')}
          className={cn("px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border flex items-center gap-1 shrink-0", filter === 'admins' ? "bg-red-500 text-white border-red-500" : "bg-card text-muted-foreground border-border hover:bg-secondary")}
        >
          <Shield className="w-3 h-3" /> Admins
        </button>
        <button 
          onClick={() => setFilter('verified')}
          className={cn("px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border flex items-center gap-1 shrink-0", filter === 'verified' ? "bg-blue-600 text-white border-blue-600" : "bg-card text-muted-foreground border-border hover:bg-secondary")}
        >
          <VerifiedBadge className="w-3 h-3 text-white" /> Verified
        </button>
        <button 
          onClick={() => setFilter('normal')}
          className={cn("px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border shrink-0", filter === 'normal' ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:bg-secondary")}
        >
          Normal Users
        </button>
      </div>

      {/* USER LIST */}
      <div className="bg-card/70 backdrop-blur-2xl border border-border/40 sm:rounded-3xl rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-border/30 bg-card/80">
          <h2 className="font-extrabold text-base sm:text-lg text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" /> 
            {filter === 'all' ? 'All Registered Users' : filter.charAt(0).toUpperCase() + filter.slice(1) + ' Users'} 
            <span className="bg-secondary px-2 py-0.5 rounded-full text-xs font-mono ml-auto text-muted-foreground">{filteredUsers.length}</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
            <Users className="w-10 h-10 mb-3 opacity-20" />
            <p className="font-medium text-lg">No Users Found</p>
            <p className="text-sm opacity-60">Try changing your active filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {filteredUsers.map((u) => {
              const isAdmin = isAdminEmail(u.email);
              return (
                <button
                  key={u.id}
                  onClick={() => viewUser(u.id)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-secondary/40 active:bg-secondary/60 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden pr-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md border-2 border-background/50 relative">
                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                      {isAdmin && (
                         <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5 shadow-sm">
                           <Shield className="w-3 h-3 text-white" />
                         </div>
                      )}
                    </div>
                    <div className="truncate min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-foreground text-sm sm:text-base truncate">{u.name}</p>
                        {u.is_verified && !isAdmin && (
                          <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />
                        )}
                        {isAdmin && (
                           <span className="bg-red-500/10 text-red-500 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm tracking-wider">Admin</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate opacity-80">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-foreground transition-all shrink-0">
                    <ChevronRight className="w-5 h-5 bg-secondary group-hover:bg-blue-500 group-hover:text-white rounded-full p-0.5 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* USER DETAIL MODAL (FULLSCREEN ON MOBILE) */}
      {(selectedUser || detailLoading) && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full sm:max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col sm:rounded-3xl shadow-2xl sm:border border-border/50 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-300">
            {detailLoading ? (
              <div className="flex-1 flex items-center justify-center p-20">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 drop-shadow-md" />
              </div>
            ) : selectedUser ? (
              <>
                {/* Modal Header */}
                <div className="bg-card sm:rounded-t-3xl border-b border-border/50 p-4 sm:p-5 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg border-2 border-background/20 relative">
                      {selectedUser.user.name?.charAt(0)?.toUpperCase()}
                      {selectedUser.user.is_verified && (
                         <VerifiedBadge className="absolute -bottom-1 -right-1 w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0 pr-2">
                       <div className="flex items-center gap-2">
                         <h2 className="text-lg sm:text-xl font-bold text-foreground truncate leading-tight">
                           {selectedUser.user.name}
                         </h2>
                       </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate opacity-80">
                        {selectedUser.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleAdminDeleteUser(selectedUser.user.id)}
                      className="rounded-full gap-2 shadow-md hover:bg-red-700 w-10 h-10 sm:w-auto sm:px-4 p-0 shrink-0"
                    >
                      <Trash2 className="w-4 h-4 m-0" /> <span className="hidden sm:inline">Delete</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedUser(null)}
                      className="rounded-full bg-secondary/80 hover:bg-secondary w-10 h-10 p-0 shrink-0 border-border/50"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 pb-32 sm:pb-6 custom-scrollbar">
                  
                  {/* Security & Backup Panel */}
                  <div className="bg-gradient-to-b sm:bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-3xl p-5 sm:p-6 shadow-inner">
                    <h3 className="font-extrabold text-xs sm:text-sm text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Account Security Center
                    </h3>
                    
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-between bg-card/60 backdrop-blur-sm p-4 rounded-2xl border border-blue-500/10 shadow-sm">
                      <div className="space-y-3 w-full lg:w-3/5">
                        <div className="space-y-1 w-full">
                          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 opacity-70">Primary Email</p>
                          <div className="flex items-center gap-3 bg-background border border-border/40 p-3 rounded-xl shadow-sm">
                            <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                            <span className="font-mono text-xs sm:text-sm font-semibold select-all truncate">{selectedUser.user.email}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 w-full">
                          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 opacity-70">Admin Passkey Decryption</p>
                          <div className="flex items-center gap-3 bg-background border border-border/40 p-3 rounded-xl shadow-sm">
                            <Key className="w-4 h-4 text-red-500 shrink-0" />
                            <span className="font-mono text-xs sm:text-sm font-black text-rose-500 select-all flex-1 tracking-widest">
                               {showPassword ? (selectedUser.user.password_text || 'NOT_SET') : '••••••••••••'}
                            </span>
                            <button className="text-muted-foreground hover:text-foreground transition-colors p-1 bg-secondary/50 rounded-md" onClick={() => setShowPassword(!showPassword)}>
                               {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 lg:border-l lg:pl-5 border-border/30 justify-center">
                         <div className="flex gap-3 w-full">
                           <Button 
                             variant="outline" 
                             onClick={() => handleAdminChangePassword(selectedUser.user.id)}
                             className="rounded-xl flex-1 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 bg-background h-10"
                            >
                             <Key className="w-4 h-4 mr-2" /> Reset Auth
                           </Button>
                         </div>
                         <Button 
                           className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 border border-slate-900/50 text-white rounded-xl w-full shadow-lg h-10 font-bold"
                           onClick={() => alert("Mock: Exporting User Data JSON...")}
                          >
                           <Server className="w-4 h-4 mr-2" /> Dump JSON Block
                         </Button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info GRID */}
                  <div className="bg-secondary/30 rounded-3xl p-5 sm:p-6 border border-border/30">
                    <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-widest mb-4">
                      Client Meta
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                      {selectedUser.user.phone && (
                        <div className="space-y-1 bg-card p-3 rounded-2xl shadow-sm border border-border/30">
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold"><Phone className="w-3 h-3 text-blue-500"/> Phone</p>
                          <p className="font-semibold text-sm truncate">{selectedUser.user.phone}</p>
                        </div>
                      )}
                      {selectedUser.user.dob && (
                        <div className="space-y-1 bg-card p-3 rounded-2xl shadow-sm border border-border/30">
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold"><Calendar className="w-3 h-3 text-emerald-500"/> DOB</p>
                          <p className="font-semibold text-sm truncate">{selectedUser.user.dob}</p>
                        </div>
                      )}
                      {selectedUser.user.gender && (
                        <div className="space-y-1 bg-card p-3 rounded-2xl shadow-sm border border-border/30">
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold"><Users className="w-3 h-3 text-purple-500"/> Gender</p>
                          <p className="font-semibold text-sm capitalize truncate">{selectedUser.user.gender}</p>
                        </div>
                      )}
                      {(selectedUser.user.city || selectedUser.user.state) && (
                        <div className="space-y-1 bg-card p-3 rounded-2xl shadow-sm border border-border/30 col-span-2 md:col-span-1">
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold"><MapPin className="w-3 h-3 text-orange-500"/> Region</p>
                          <p className="font-semibold text-sm truncate">
                            {[selectedUser.user.city, selectedUser.user.state].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary Stats GRID */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full rounded-tr-3xl -z-10 group-hover:scale-110 transition-transform"></div>
                      <TrendingUp className="w-6 h-6 text-emerald-500 mb-2 drop-shadow-sm" />
                      <p className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                        ₹{totalIncome(selectedUser.transactions).toLocaleString()}
                      </p>
                      <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase mt-1 tracking-widest">
                        Total Income
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-3xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full rounded-tr-3xl -z-10 group-hover:scale-110 transition-transform"></div>
                      <TrendingDown className="w-6 h-6 text-red-500 mb-2 drop-shadow-sm" />
                      <p className="text-xl sm:text-2xl font-black text-red-600 tracking-tight">
                        ₹{totalExpense(selectedUser.transactions).toLocaleString()}
                      </p>
                      <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase mt-1 tracking-widest">
                        Total Expense
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-3xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full rounded-tr-3xl -z-10 group-hover:scale-110 transition-transform"></div>
                      <Wallet className="w-6 h-6 text-blue-500 mb-2 drop-shadow-sm" />
                      <p className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight">
                        {selectedUser.accounts.length}
                      </p>
                      <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase mt-1 tracking-widest">
                        Accounts Linked
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-3xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full rounded-tr-3xl -z-10 group-hover:scale-110 transition-transform"></div>
                      <Target className="w-6 h-6 text-purple-500 mb-2 drop-shadow-sm" />
                      <p className="text-xl sm:text-2xl font-black text-purple-600 tracking-tight">
                        {selectedUser.goals.length}
                      </p>
                      <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase mt-1 tracking-widest">
                        Active Goals
                      </p>
                    </div>
                  </div>

                  {/* Transactions MOBILE LIST / TABLE */}
                  <div>
                    <h3 className="font-extrabold text-sm text-foreground mb-4 flex items-center gap-2">
                       <Activity className="w-4 h-4 text-blue-500"/> Latest Ledger Activity
                    </h3>
                    {selectedUser.transactions.length === 0 ? (
                      <div className="bg-secondary/20 border border-border/40 rounded-2xl p-8 text-center text-muted-foreground">
                        No financial activity recorded.
                      </div>
                    ) : (
                      <div className="space-y-3">
                         {/* Card-based list for perfect mobile & desktop hybrid */}
                         {selectedUser.transactions.slice(0, 15).map((tx: any) => (
                            <div key={tx.id} className="bg-card border border-border/40 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                               <div className="flex items-start gap-4 overflow-hidden pr-3">
                                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner", tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')}>
                                      {tx.type === 'income' ? <TrendingUp className="w-5 h-5"/> : <TrendingDown className="w-5 h-5"/>}
                                  </div>
                                  <div className="min-w-0">
                                      <p className="font-bold text-sm text-foreground truncate">{tx.note || tx.category}</p>
                                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                        <span className="opacity-70">{tx.date}</span> 
                                        {tx.note && <span className="bg-secondary px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold">{tx.category}</span>}
                                      </p>
                                  </div>
                               </div>
                               <div className="text-right shrink-0">
                                  <p className={cn("font-black text-base sm:text-lg tracking-tight", tx.type === 'income' ? 'text-emerald-600' : 'text-red-500')}>
                                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount?.toLocaleString()}
                                  </p>
                               </div>
                            </div>
                         ))}
                         {selectedUser.transactions.length > 15 && (
                           <div className="pt-2 text-center text-xs font-bold text-muted-foreground uppercase opacity-60">
                             + {selectedUser.transactions.length - 15} More Hidden
                           </div>
                         )}
                      </div>
                    )}
                  </div>

                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* CREATE USER MODAL - FULLSCREEN ON MOBILE */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full sm:max-w-md h-[95vh] sm:h-auto sm:border sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-300 overflow-hidden flex flex-col border-border/50">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 text-white relative text-center shrink-0">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 rounded-full p-2.5 transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,255,0.15)] relative">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />
                <VerifiedBadge className="absolute -bottom-2 -right-2 w-8 h-8 text-white filter drop-shadow-xl" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">Create Verified VIP User</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-3 opacity-90 max-w-[80%] mx-auto font-medium leading-relaxed">
                Accounts created via Admin automatically receive the premium Verified Badge.
              </p>
            </div>
            
            <form onSubmit={handleSubmitCreateUser} className="p-5 sm:p-8 space-y-5 sm:space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
                <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground inherit">Full Name</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Official Name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3.5 sm:py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-background transition-all placeholder:text-muted-foreground/30 font-medium"
                  required
                />
              </div>
              <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
                <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground inherit">Registered Email Address</label>
                <input
                  type="email"
                  placeholder="vip@example.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3.5 sm:py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-background transition-all placeholder:text-muted-foreground/30 font-medium"
                  required
                />
              </div>
              <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
                <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground inherit">Initial Encryption Key</label>
                <input
                  type="text"
                  placeholder="Min 5 characters"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3.5 sm:py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-background transition-all placeholder:text-muted-foreground/30 font-mono tracking-widest font-black"
                  required
                  minLength={5}
                />
              </div>

              <div className="pt-6 pb-8 sm:pb-0 flex gap-3 sticky bottom-0 bg-card mt-auto sm:mt-0">
                <Button 
                  type="submit" 
                  className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 h-14 sm:h-12 font-bold text-base"
                  disabled={isCreating}
                >
                  {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Provision Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE ACTION MENU BAR (Bottom Fixed) */}
      <div className="sm:hidden fixed bottom-[72px] left-4 right-4 z-[40] bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl flex items-center justify-between p-2 shadow-[0_10px_40px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-5">
        <button 
          onClick={handleAdminCreateUser} 
          className="flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-xl hover:bg-secondary/50 text-blue-500 transition-colors"
        >
          <UserPlus className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Create</span>
        </button>
        <div className="w-[1px] h-8 bg-border/50"></div>
        <button 
          onClick={fetchUsers} 
          className="flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-xl hover:bg-secondary/50 text-emerald-500 transition-colors"
        >
          <RefreshCw className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Sync</span>
        </button>
        <div className="w-[1px] h-8 bg-border/50"></div>
        <button 
          onClick={logout} 
          className="flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-xl hover:bg-secondary/50 text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Sign Out</span>
        </button>
      </div>

    </div>
  );
}
