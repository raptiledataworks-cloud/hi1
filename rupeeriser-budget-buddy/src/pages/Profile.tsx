import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, AlertTriangle, Eye, EyeOff, MapPin, Phone, Calendar, Shield, ChevronRight, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { endpoints } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { t } from '@/lib/i18n';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const INDIAN_STATES = [
  'Tamil Nadu','Kerala','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar',
  'Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand',
  'Karnataka','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands',
  'Chandigarh','Dadra and Nagar Haveli','Delhi','Jammu and Kashmir',
  'Ladakh','Lakshadweep','Puducherry',
];

export default function Profile() {
  const { user, updateProfile, changePassword, language } = useApp();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'details' | 'security'>('details');
  const [showPass, setShowPass] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '', phone: '', dob: '', gender: '',
    address: '', city: '', state: '', pincode: '',
  });

  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      toast.success(t('save_changes', language) + " ✓");
    } catch (e) {
      toast.error("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (passData.new !== passData.confirm) {
      toast.error(t('passwords_dont_match', language));
      return;
    }
    if (passData.new.length < 6) {
      toast.error(t('min_6_chars', language));
      return;
    }
    try {
      await changePassword({
        current_password: passData.current,
        new_password: passData.new,
        plain_text_password: passData.new,
      });
      toast.success(t('update_password', language) + " ✓");
      setPassData({ current: '', new: '', confirm: '' });
    } catch (e) {
      toast.error("Incorrect current password");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = window.prompt("To confirm deletion, please type 'DELETE':");
    if (confirmText !== 'DELETE') {
      toast.info("Account deletion cancelled.");
      return;
    }
    try {
      await endpoints.deleteUserAccount();
      toast.success("Your account has been successfully deleted.");
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to delete account");
    }
  };

  const sections = [
    { 
      id: 'details' as const, 
      label: t('personal_details', language), 
      icon: User,
      desc: t('manage_info', language),
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
    },
    { 
      id: 'security' as const, 
      label: t('security', language), 
      icon: Shield,
      desc: t('password_auth', language),
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="relative max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-24 md:pb-40 animate-fade-in">
      
      {/* ═══ MOBILE TOP BAR ═══ */}
      <div className="flex items-center gap-2 py-1.5 mb-3 md:hidden">
        <Button variant="ghost" size="icon" 
          onClick={() => navigate('/dashboard')}
          className="rounded-full hover:bg-secondary/80 h-9 w-9 shrink-0 -ml-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold flex-1">{t('profile', language)}</h1>
      </div>

      {/* ═══ PROFILE HEADER CARD ═══ */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-8 text-white shadow-xl shadow-blue-500/20 overflow-hidden mb-4 sm:mb-5 md:mb-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
        
        <div className="flex items-center gap-3 md:gap-5 relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold shadow-md border border-white/20 shrink-0">
            {profileData.name.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg sm:text-xl md:text-2xl font-bold truncate">{profileData.name || 'User'}</h1>
            <p className="text-white/70 text-[11px] sm:text-xs md:text-sm truncate mt-0.5">{user?.email}</p>
            <span className="inline-block text-[9px] sm:text-[10px] md:text-xs bg-white/15 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-white/10 mt-1 md:mt-2">
              {t('active_member', language)}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE TABS ═══ */}
      <div className="flex gap-2 overflow-x-auto pb-4 px-3 -mx-3 sm:px-4 sm:-mx-4 md:px-0 md:mx-0 no-scrollbar md:hidden">
        {sections.map((s) => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                isActive 
                  ? 'bg-gradient-to-r ' + s.color + ' text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-card border border-border/60 text-muted-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* ═══ DESKTOP LAYOUT ═══ */}
      <div className="flex flex-col lg:flex-row gap-5 md:gap-6">
        
        {/* LEFT NAV PANEL (desktop only) */}
        <div className="hidden lg:block lg:w-72 shrink-0">
          <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm sticky top-20">
            <div className="p-4 border-b border-border/40">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('profile', language)}</h3>
            </div>
            <div className="p-2 space-y-1">
              {sections.map((s) => {
                const Icon = s.icon;
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r ' + s.color + ' text-white shadow-lg' 
                        : 'hover:bg-secondary/60 text-foreground'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20' : s.bgColor
                    }`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : s.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : ''}`}>{s.label}</p>
                      <p className={`text-[11px] truncate ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>{s.desc}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white/70 translate-x-0.5' : 'text-muted-foreground opacity-0 group-hover:opacity-100'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="flex-1 min-w-0">
          
          {/* ═══ PERSONAL DETAILS ═══ */}
          {activeSection === 'details' && (
            <div className="animate-fade-in">
              <div className="bg-card border border-border/60 rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6 border-b border-border/40 flex items-center gap-3">
                  <div className="p-2 md:p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl shrink-0">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] md:text-lg">{t('personal_details', language)}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{t('update_info', language)}</p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-5">
                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t('full_name', language)}</Label>
                      <Input value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60" placeholder={t('enter_name', language)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t('email', language)}</Label>
                      <Input value={user?.email} disabled className="rounded-xl h-10 md:h-11 opacity-60 bg-secondary/20" />
                    </div>
                  </div>

                  {/* Phone & DOB */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> {t('phone', language)}
                      </Label>
                      <Input type="tel" placeholder={t('enter_phone', language)} value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {t('dob', language)}
                      </Label>
                      <Input type="date" value={profileData.dob} onChange={e => setProfileData({ ...profileData, dob: e.target.value })} className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60" />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t('gender', language)}</Label>
                      <Select value={profileData.gender} onValueChange={val => setProfileData({...profileData, gender: val})}>
                        <SelectTrigger className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60">
                          <SelectValue placeholder={t('select', language)} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">{t('male', language)}</SelectItem>
                          <SelectItem value="Female">{t('female', language)}</SelectItem>
                          <SelectItem value="Other">{t('other', language)}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-px flex-1 bg-border/60" />
                    <span className="text-[10px] md:text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {t('address_info', language)}
                    </span>
                    <div className="h-px flex-1 bg-border/60" />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t('address', language)}</Label>
                    <Input value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })} className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60" placeholder={t('street_address', language)} />
                  </div>

                  {/* City, State, Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t('city', language)}</Label>
                      <Input value={profileData.city} onChange={e => setProfileData({ ...profileData, city: e.target.value })} className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60" placeholder={t('your_city', language)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t('state', language)}</Label>
                      <Select value={profileData.state} onValueChange={val => setProfileData({...profileData, state: val})}>
                        <SelectTrigger className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60">
                          <SelectValue placeholder={t('state', language)} />
                        </SelectTrigger>
                        <SelectContent className="max-h-40">{INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t('pincode', language)}</Label>
                      <Input maxLength={6} value={profileData.pincode} onChange={e => setProfileData({ ...profileData, pincode: e.target.value.replace(/\D/g,'') })} className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60" placeholder={t('digit_pincode', language)} />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl h-11 md:h-12 font-bold text-sm md:text-base shadow-lg shadow-blue-500/20 mt-1 gap-2">
                    <Save className="w-4 h-4" />
                    {t('save_changes', language)}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ SECURITY & DANGER ═══ */}
          {activeSection === 'security' && (
            <div className="animate-fade-in space-y-5 md:space-y-6">
              {/* PASSWORD UPDATE */}
              <div className="bg-card border border-border/60 rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6 border-b border-border/40 flex items-center gap-3">
                  <div className="p-2 md:p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg md:rounded-xl shrink-0">
                    <Lock className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] md:text-lg">{t('security', language)}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{t('update_password_desc', language)}</p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t('current_password', language)}</Label>
                    <div className="relative">
                      <Input type={showPass ? "text" : "password"} placeholder={t('current_password', language)} value={passData.current} onChange={e => setPassData({ ...passData, current: e.target.value })} className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60 pr-10" />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 md:top-3 text-muted-foreground hover:text-foreground transition-colors">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t('new_password', language)}</Label>
                    <Input type={showPass ? "text" : "password"} placeholder={t('new_password', language)} value={passData.new} onChange={e => setPassData({ ...passData, new: e.target.value })} className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t('confirm_password', language)}</Label>
                    <Input type={showPass ? "text" : "password"} placeholder={t('confirm_password', language)} value={passData.confirm} onChange={e => setPassData({ ...passData, confirm: e.target.value })} className="rounded-xl h-10 md:h-11 bg-secondary/30 border-border/60" />
                    {passData.confirm && passData.new !== passData.confirm && (
                      <p className="text-xs text-red-500 mt-1">{t('passwords_dont_match', language)}</p>
                    )}
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-3 md:p-4 border border-border/40">
                    <p className="text-[11px] font-semibold text-muted-foreground mb-2">{t('password_requirements', language)}</p>
                    <ul className="space-y-1">
                      <li className={`text-[11px] flex items-center gap-2 ${passData.new.length >= 6 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${passData.new.length >= 6 ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                        {t('min_6_chars', language)}
                      </li>
                      <li className={`text-[11px] flex items-center gap-2 ${passData.new === passData.confirm && passData.confirm ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${passData.new === passData.confirm && passData.confirm ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                        {t('passwords_match', language)}
                      </li>
                    </ul>
                  </div>

                  <Button onClick={handleChangePassword} disabled={!passData.current || !passData.new || passData.new !== passData.confirm} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl h-11 md:h-12 font-bold text-sm md:text-base shadow-lg shadow-orange-500/20 disabled:opacity-50 gap-2">
                    <Shield className="w-4 h-4" />
                    {t('update_password', language)}
                  </Button>
                </div>
              </div>

              {/* ═══ ACCOUNT DELETION ═══ */}
              <div className="bg-card border-2 border-red-200 dark:border-red-900/40 rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6 border-b border-red-200/60 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 flex items-center gap-3">
                  <div className="p-2 md:p-2.5 bg-red-600 rounded-lg md:rounded-xl shadow-lg shadow-red-600/30 shrink-0">
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] md:text-lg text-red-600">{t('danger_zone', language)}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{t('irreversible_actions', language)}</p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-5">
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-3 md:p-4 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-red-700 dark:text-red-400">{t('warning_cannot_undo', language)}</p>
                      <p className="text-[11px] md:text-xs text-red-600/70 dark:text-red-400/60 mt-1">{t('delete_warning_desc', language)}</p>
                    </div>
                  </div>

                  <div className="bg-card border border-red-200/60 dark:border-red-900/20 rounded-xl p-4 md:p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                      <div>
                        <p className="font-bold text-sm text-red-600">{t('delete_account', language)}</p>
                        <p className="text-[11px] md:text-xs text-muted-foreground mt-1">{t('delete_account_desc', language)}</p>
                      </div>
                      <Button variant="destructive" onClick={handleDeleteAccount} className="w-full sm:w-auto rounded-xl hover:bg-red-700 bg-red-600 shadow-lg shadow-red-500/20 gap-2 shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                        {t('delete_account', language)}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
