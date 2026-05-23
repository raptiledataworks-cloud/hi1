// ── i18n Translation Module ──
// Supports: EN (English), TA (Tamil), HI (Hindi)
// FULL coverage for all pages

type Language = 'EN' | 'TA' | 'HI';

const translations: Record<string, Record<Language, string>> = {

  // ── Common / Shared ──
  welcome_back:        { EN: 'Welcome back,',           TA: 'மீண்டும் வரவேற்கிறோம்,',    HI: 'वापसी पर स्वागत,' },
  view_all:            { EN: 'View All',                 TA: 'அனைத்தும் பார்க்க',         HI: 'सभी देखें' },
  save_changes:        { EN: 'Save Changes',             TA: 'மாற்றங்களைச் சேமி',         HI: 'परिवर्तन सहेजें' },
  cancel:              { EN: 'Cancel',                   TA: 'ரத்துசெய்',                HI: 'रद्द करें' },
  confirm:             { EN: 'Confirm',                  TA: 'உறுதிப்படுத்து',             HI: 'पुष्टि करें' },

  // ── Sidebar / Navigation ──
  dashboard:           { EN: 'Dashboard',                TA: 'டாஷ்போர்ட்',               HI: 'डैशबोर्ड' },
  transactions:        { EN: 'Transactions',             TA: 'பரிவர்த்தனைகள்',            HI: 'लेनदेन' },
  calendar:            { EN: 'Calendar',                 TA: 'நாள்காட்டி',                HI: 'कैलेंडर' },
  habits:              { EN: 'Habits',                   TA: 'பழக்கவழக்கங்கள்',           HI: 'आदतें' },
  setup:               { EN: 'Setup',                    TA: 'அமைவு',                    HI: 'सेटअप' },
  settings:            { EN: 'Settings',                 TA: 'அமைப்புகள்',               HI: 'सेटिंग्स' },
  profile:             { EN: 'Profile',                  TA: 'சுயவிவரம்',                HI: 'प्रोफ़ाइल' },
  logout:              { EN: 'Sign Out',                 TA: 'வெளியேறு',                 HI: 'लॉग आउट' },

  // ── Dashboard ──
  balance_after_deductions: { EN: 'Balance After All Deductions', TA: 'அனைத்து கழிப்புக்குப் பிறகு இருப்பு', HI: 'सभी कटौतियों के बाद शेष' },
  over_budget:         { EN: '⚠️ Over Budget',            TA: '⚠️ பட்ஜெட் மீறல்',          HI: '⚠️ बजट से अधिक' },
  salary_minus:        { EN: 'Salary − Mandatory − Expenses', TA: 'சம்பளம் − கட்டாயம் − செலவுகள்', HI: 'वेतन − अनिवार्य − व्यय' },
  monthly_salary:      { EN: 'Monthly Salary',           TA: 'மாதாந்திர சம்பளம்',          HI: 'मासिक वेतन' },
  mandatory_bills:     { EN: 'Mandatory Bills (Paid)',   TA: 'கட்டாய பில்கள் (செலுத்தியது)', HI: 'अनिवार्य बिल (भुगतान)' },
  after_mandatory:     { EN: 'After Mandatory',          TA: 'கட்டாயத்திற்குப் பிறகு',      HI: 'अनिवार्य के बाद' },
  discretionary_spent: { EN: 'Discretionary Spent',      TA: 'விருப்பச் செலவு',            HI: 'विवेकाधीन खर्च' },
  total_deducted:      { EN: 'Total Deducted from Salary', TA: 'சம்பளத்திலிருந்து மொத்த கழிப்பு', HI: 'वेतन से कुल कटौती' },
  spending_limit_left: { EN: 'Spending Limit Left',      TA: 'செலவு வரம்பு மீதி',          HI: 'खर्च सीमा शेष' },
  add_expense:         { EN: 'Add Expense',              TA: 'செலவு சேர்',                HI: 'खर्च जोड़ें' },
  salary:              { EN: 'Salary',                   TA: 'சம்பளம்',                  HI: 'वेतन' },
  spent:               { EN: 'Spent',                    TA: 'செலவு',                    HI: 'खर्च' },
  bills_expenses:      { EN: 'Bills + Expenses',         TA: 'பில்கள் + செலவுகள்',         HI: 'बिल + खर्च' },
  savings:             { EN: 'Savings',                  TA: 'சேமிப்பு',                  HI: 'बचत' },
  this_month:          { EN: 'This Month',               TA: 'இந்த மாதம்',               HI: 'इस महीने' },
  spending_limit:      { EN: 'Spending Limit',           TA: 'செலவு வரம்பு',              HI: 'खर्च सीमा' },
  used:                { EN: 'used',                     TA: 'பயன்படுத்தப்பட்டது',         HI: 'उपयोग' },
  left:                { EN: 'left',                     TA: 'மீதி',                     HI: 'शेष' },
  over_by:             { EN: 'Over by',                  TA: 'மீறியது',                  HI: 'अधिक' },
  spending_trend:      { EN: 'Spending Trend',           TA: 'செலவு போக்கு',              HI: 'खर्च प्रवृत्ति' },
  last_7_days:         { EN: 'Last 7 Days',              TA: 'கடந்த 7 நாட்கள்',           HI: 'पिछले 7 दिन' },
  latest_entries:      { EN: 'Latest Entries',           TA: 'சமீபத்திய பதிவுகள்',        HI: 'नवीनतम प्रविष्टियाँ' },
  quick_actions:       { EN: 'Quick Actions',            TA: 'விரைவு செயல்கள்',           HI: 'त्वरित कार्रवाई' },
  monthly_overview:    { EN: 'Monthly Overview',         TA: 'மாதாந்திர மேற்பார்வை',       HI: 'मासिक अवलोकन' },

  // ── Profile Page ──
  personal_details:    { EN: 'Personal Details',         TA: 'தனிப்பட்ட விவரங்கள்',       HI: 'व्यक्तिगत विवरण' },
  manage_info:         { EN: 'Manage your personal information', TA: 'உங்கள் தனிப்பட்ட தகவல்களை நிர்வகிக்கவும்', HI: 'अपनी व्यक्तिगत जानकारी प्रबंधित करें' },
  update_info:         { EN: 'Update your personal information', TA: 'தனிப்பட்ட தகவல்களை புதுப்பிக்கவும்', HI: 'अपनी जानकारी अपडेट करें' },
  full_name:           { EN: 'Full Name',                TA: 'முழு பெயர்',               HI: 'पूरा नाम' },
  email:               { EN: 'Email',                    TA: 'மின்னஞ்சல்',               HI: 'ईमेल' },
  phone:               { EN: 'Phone',                    TA: 'தொலைபேசி',                HI: 'फ़ोन' },
  dob:                 { EN: 'Date of Birth',            TA: 'பிறந்த தேதி',              HI: 'जन्म तिथि' },
  gender:              { EN: 'Gender',                   TA: 'பாலினம்',                  HI: 'लिंग' },
  select:              { EN: 'Select',                   TA: 'தேர்வு செய்யவும்',          HI: 'चुनें' },
  male:                { EN: 'Male',                     TA: 'ஆண்',                     HI: 'पुरुष' },
  female:              { EN: 'Female',                   TA: 'பெண்',                    HI: 'महिला' },
  other:               { EN: 'Other',                    TA: 'மற்றவை',                  HI: 'अन्य' },
  address_info:        { EN: 'Address Information',      TA: 'முகவரி தகவல்',             HI: 'पता जानकारी' },
  address:             { EN: 'Address',                  TA: 'முகவரி',                   HI: 'पता' },
  city:                { EN: 'City',                     TA: 'நகரம்',                    HI: 'शहर' },
  state:               { EN: 'State',                    TA: 'மாநிலம்',                  HI: 'राज्य' },
  pincode:             { EN: 'Pincode',                  TA: 'அஞ்சல் குறியீடு',           HI: 'पिनकोड' },
  active_member:       { EN: 'Active Member',            TA: 'செயலில் உள்ள உறுப்பினர்',    HI: 'सक्रिय सदस्य' },
  enter_name:          { EN: 'Enter your full name',     TA: 'முழு பெயரை உள்ளிடுக',       HI: 'अपना पूरा नाम दर्ज करें' },
  enter_phone:         { EN: 'Enter your phone number',  TA: 'தொலைபேசி எண்ணை உள்ளிடுக',   HI: 'अपना फ़ोन नंबर दर्ज करें' },
  street_address:      { EN: 'Street address',           TA: 'தெரு முகவரி',              HI: 'सड़क का पता' },
  your_city:           { EN: 'Your city',                TA: 'உங்கள் நகரம்',             HI: 'आपका शहर' },
  digit_pincode:       { EN: '6-digit pincode',          TA: '6 இலக்க அஞ்சல் குறியீடு',    HI: '6 अंकों का पिनकोड' },

  // ── Security ──
  security:            { EN: 'Security',                 TA: 'பாதுகாப்பு',               HI: 'सुरक्षा' },
  password_auth:       { EN: 'Password & authentication', TA: 'கடவுச்சொல் & அங்கீகாரம்',   HI: 'पासवर्ड और प्रमाणीकरण' },
  update_password_desc:{ EN: 'Update your password to keep your account secure', TA: 'கணக்கைப் பாதுகாக்க கடவுச்சொல்லை புதுப்பிக்கவும்', HI: 'अपना खाता सुरक्षित रखने के लिए पासवर्ड अपडेट करें' },
  current_password:    { EN: 'Current Password',         TA: 'தற்போதைய கடவுச்சொல்',      HI: 'वर्तमान पासवर्ड' },
  new_password:        { EN: 'New Password',             TA: 'புதிய கடவுச்சொல்',          HI: 'नया पासवर्ड' },
  confirm_password:    { EN: 'Confirm New Password',     TA: 'புதிய கடவுச்சொல்லை உறுதிப்படுத்து', HI: 'नया पासवर्ड पुष्टि करें' },
  update_password:     { EN: 'Update Password',          TA: 'கடவுச்சொல்லை புதுப்பி',     HI: 'पासवर्ड अपडेट करें' },
  passwords_dont_match:{ EN: "Passwords don't match",    TA: 'கடவுச்சொற்கள் பொருந்தவில்லை', HI: 'पासवर्ड मेल नहीं खाते' },
  password_requirements:{ EN: 'Password Requirements',   TA: 'கடவுச்சொல் தேவைகள்',        HI: 'पासवर्ड आवश्यकताएँ' },
  min_6_chars:         { EN: 'At least 6 characters',    TA: 'குறைந்தது 6 எழுத்துகள்',     HI: 'कम से कम 6 अक्षर' },
  passwords_match:     { EN: 'Passwords match',          TA: 'கடவுச்சொற்கள் பொருந்துகின்றன', HI: 'पासवर्ड मेल खाते हैं' },

  // ── Danger Zone ──
  danger_zone:         { EN: 'Danger Zone',              TA: 'ஆபத்து மண்டலம்',           HI: 'खतरनाक क्षेत्र' },
  irreversible_actions:{ EN: 'Irreversible actions below', TA: 'கீழே மீளமுடியாத செயல்கள்', HI: 'नीचे अपरिवर्तनीय कार्रवाइयाँ' },
  warning_cannot_undo: { EN: 'Warning: This action cannot be undone', TA: 'எச்சரிக்கை: இந்தச் செயலை செயல்தவிர்க்க முடியாது', HI: 'चेतावनी: यह क्रिया पूर्ववत नहीं की जा सकती' },
  delete_warning_desc: { EN: 'Deleting your account will permanently remove all your data, including transactions, habits, budgets, and settings. This action is irreversible.', TA: 'கணக்கை நீக்குவது பரிவர்த்தனைகள், பழக்கவழக்கங்கள், பட்ஜெட்டுகள் மற்றும் அமைப்புகள் உட்பட உங்கள் எல்லா தரவையும் நிரந்தரமாக அகற்றும்.', HI: 'खाता हटाने से लेनदेन, आदतें, बजट और सेटिंग्स सहित आपका सारा डेटा स्थायी रूप से हट जाएगा।' },
  delete_account:      { EN: 'Delete Account',           TA: 'கணக்கை நீக்கு',            HI: 'खाता हटाएं' },
  delete_account_desc: { EN: 'Permanently remove your account and all data', TA: 'உங்கள் கணக்கையும் எல்லா தரவையும் நிரந்தரமாக அகற்றவும்', HI: 'अपना खाता और सभी डेटा स्थायी रूप से हटाएं' },

  // ── Settings Page ──
  theme_preference:    { EN: 'Theme',                    TA: 'தீம்',                     HI: 'थीम' },
  choose_style:        { EN: 'Choose your visual style', TA: 'காட்சி பாணியைத் தேர்வுசெய்யவும்', HI: 'अपनी दृश्य शैली चुनें' },
  light:               { EN: 'Light',                    TA: 'வெளிச்சம்',                HI: 'लाइट' },
  dark:                { EN: 'Dark',                     TA: 'இருள்',                    HI: 'डार्क' },
  auto:                { EN: 'Auto',                     TA: 'தானியங்கி',                HI: 'ऑटो' },
  clean_bright:        { EN: 'Clean bright interface',   TA: 'சுத்தமான பிரகாசமான இடைமுகம்', HI: 'साफ उज्ज्वल इंटरफेस' },
  easy_on_eyes:        { EN: 'Easy on the eyes',         TA: 'கண்களுக்கு எளிதானது',        HI: 'आँखों पर आसान' },
  match_device:        { EN: 'Match your device',        TA: 'உங்கள் சாதனத்துடன் பொருத்தம்', HI: 'अपने डिवाइस से मिलाएं' },
  language:            { EN: 'Language',                  TA: 'மொழி',                     HI: 'भाषा' },
  select_language:     { EN: 'Select your preferred language', TA: 'நீங்கள் விரும்பும் மொழியைத் தேர்ந்தெடுக்கவும்', HI: 'अपनी पसंदीदा भाषा चुनें' },
  manage_preferences:  { EN: 'Manage your app preferences and export data', TA: 'பயன்பாட்டு விருப்பங்களை நிர்வகித்து தரவை ஏற்றுமதி செய்யவும்', HI: 'ऐप प्राथमिकताएं प्रबंधित करें और डेटा निर्यात करें' },

  // ── Reports / Export ──
  export_report:       { EN: 'Export Report',            TA: 'அறிக்கை ஏற்றுமதி',         HI: 'रिपोर्ट निर्यात करें' },
  download_reports:    { EN: 'Download detailed PDF reports', TA: 'விரிவான PDF அறிக்கைகளைப் பதிவிறக்கவும்', HI: 'विस्तृत PDF रिपोर्ट डाउनलोड करें' },
  from_date:           { EN: 'From Date',                TA: 'தொடக்க தேதி',              HI: 'तारीख से' },
  to_date:             { EN: 'To Date',                  TA: 'முடிவு தேதி',              HI: 'तारीख तक' },
  download_report_pdf: { EN: 'Download Report PDF',      TA: 'அறிக்கை PDF பதிவிறக்கம்',   HI: 'रिपोर्ट PDF डाउनलोड करें' },
  note_leave_empty:    { EN: 'Leave dates empty to download your full transaction history. Select a range for specific reports.', TA: 'முழு பரிவர்த்தனை வரலாற்றைப் பதிவிறக்க தேதிகளை காலியாக விடுங்கள்.', HI: 'अपना पूरा लेनदेन इतिहास डाउनलोड करने के लिए तारीखें खाली छोड़ें।' },

  // ── Admin Dashboard ──
  admin_dashboard:     { EN: 'Admin Dashboard',          TA: 'நிர்வாக டாஷ்போர்ட்',       HI: 'एडमिन डैशबोर्ड' },
  view_all_users:      { EN: 'View & manage all registered users', TA: 'அனைத்துப் பயனர்களையும் பார்க்கவும் நிர்வகிக்கவும்', HI: 'सभी पंजीकृत उपयोगकर्ता देखें और प्रबंधित करें' },
  refresh:             { EN: 'Refresh',                  TA: 'புதுப்பி',                 HI: 'रिफ्रेश' },
  total_users:         { EN: 'Total Users',              TA: 'மொத்த பயனர்கள்',           HI: 'कुल उपयोगकर्ता' },
  system_status:       { EN: 'System Status',            TA: 'கணினி நிலை',               HI: 'सिस्टम स्थिति' },
  data_engine:         { EN: 'Data Engine',              TA: 'தரவு இயந்திரம்',            HI: 'डेटा इंजन' },
  registered_users:    { EN: 'Registered Users',         TA: 'பதிவு செய்த பயனர்கள்',      HI: 'पंजीकृत उपयोगकर्ता' },
};

/**
 * Translate a key to the given language.
 * Falls back to English, then to the raw key itself.
 */
export function t(key: string, lang: Language = 'EN'): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] ?? entry['EN'] ?? key;
}
