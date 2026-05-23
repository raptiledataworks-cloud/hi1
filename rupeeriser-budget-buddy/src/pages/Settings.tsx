import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import {
  Download, FileText, Sun, Moon, Monitor,
  LogOut, Code2, ExternalLink, Info,
  ArrowLeft, Globe, Palette, Languages, Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { t } from '@/lib/i18n';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout, transactions, language, setLanguage } = useApp();
  const { theme, setTheme } = useTheme();

  const [reportStart, setReportStart] = useState('');
  const [reportEnd, setReportEnd] = useState('');

  const truncateEmail = (email: string | undefined) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (localPart.length > 12) {
      return `${localPart.substring(0, 8)}...${localPart.slice(-3)}@${domain}`;
    }
    return email;
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const userName = user?.name || 'User';
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const R = 'Rs.';
    
    let filteredData = transactions;
    let reportTitle = 'Full Financial Statement';
    let periodLabel = 'All Time';

    if (reportStart && reportEnd) {
      const start = new Date(reportStart);
      const end = new Date(reportEnd);
      end.setHours(23, 59, 59);
      filteredData = transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= start && txDate <= end;
      });
      reportTitle = 'Financial Statement';
      periodLabel = `${new Date(reportStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} to ${new Date(reportEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }

    if (filteredData.length === 0) {
      toast.error('No transactions found for this period');
      return;
    }

    // Load Logo
    let logoData: string | null = null;
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          logoData = canvas.toDataURL('image/png');
          resolve();
        };
        img.onerror = () => resolve();
        img.src = '/logo-192.png';
      });
    } catch { /* continue without logo */ }

    // CALCULATIONS
    const totalInc = filteredData.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExp = filteredData.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const netFlow = totalInc - totalExp;
    const uniqueDays = new Set(filteredData.map(t => t.date)).size;
    const avgDaily = totalExp / Math.max(1, uniqueDays);
    const fmt = (n: number) => `${R} ${n.toLocaleString('en-IN')}`;

    const catMap: Record<string, number> = {};
    filteredData.filter(t => t.type === 'expense').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const topCat = sortedCats[0] || ['N/A', 0];
    const leastCat = sortedCats.length > 1 ? sortedCats[sortedCats.length - 1] : topCat;

    const monthlyMap: Record<string, { income: number; expense: number }> = {};
    filteredData.forEach(t => {
      const d = new Date(t.date);
      const mk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[mk]) monthlyMap[mk] = { income: 0, expense: 0 };
      if (t.type === 'income') monthlyMap[mk].income += t.amount;
      else monthlyMap[mk].expense += t.amount;
    });

    // HEADER
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 48, 'F');
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 48, pageWidth, 3, 'F');

    if (logoData) doc.addImage(logoData, 'PNG', 14, 8, 12, 12);
    const logoOffset = logoData ? 30 : 14;

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RupeeRiser', logoOffset, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(reportTitle, logoOffset, 28);
    doc.text(`Period: ${periodLabel}`, logoOffset, 34);
    doc.text(`Account: ${userName}  |  Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, logoOffset, 40);

    // INSIGHTS
    let y = 60;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial Insights', 14, y);
    y += 8;

    const boxW = (pageWidth - 38) / 3;
    const drawBox = (bx: number, by: number, label: string, value: string, color?: [number, number, number]) => {
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(bx, by, boxW, 22, 3, 3, 'F');
      doc.setFontSize(8); doc.setTextColor(100, 116, 139); doc.setFont('helvetica', 'normal');
      doc.text(label, bx + 4, by + 8);
      doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      if (color) doc.setTextColor(...color); else doc.setTextColor(15, 23, 42);
      doc.text(value.substring(0, 26), bx + 4, by + 18);
    };

    drawBox(14, y, 'Total Income', fmt(totalInc), [16, 185, 129]);
    drawBox(14 + boxW + 5, y, 'Total Expense', fmt(totalExp), [239, 68, 68]);
    drawBox(14 + 2 * (boxW + 5), y, 'Net Flow', `${netFlow >= 0 ? '+' : '-'} ${fmt(Math.abs(netFlow))}`, netFlow >= 0 ? [16, 185, 129] : [239, 68, 68]);
    y += 28;

    drawBox(14, y, 'Avg Daily Spend', fmt(Math.round(avgDaily)));
    drawBox(14 + boxW + 5, y, 'Top Category', `${topCat[0]} (${fmt(Number(topCat[1]))})`);
    drawBox(14 + 2 * (boxW + 5), y, 'Least Spent', `${leastCat[0]} (${fmt(Number(leastCat[1]))})`);
    y += 30;

    // CATEGORY BREAKDOWN
    if (sortedCats.length > 0) {
      doc.setTextColor(15, 23, 42); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      doc.text('Category Breakdown', 14, y); y += 3;

      autoTable(doc, {
        startY: y,
        head: [['Category', 'Amount', '% of Total']],
        body: sortedCats.map(([cat, amt]) => [
          cat, fmt(Number(amt)),
          `${totalExp > 0 ? ((Number(amt) / totalExp) * 100).toFixed(1) : 0}%`
        ]),
        theme: 'plain',
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 1: { halign: 'right' }, 2: { halign: 'center' } },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // MONTHLY BREAKDOWN
    const monthKeys = Object.keys(monthlyMap).sort();
    if (monthKeys.length > 0) {
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setTextColor(15, 23, 42); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      doc.text('Monthly Summary', 14, y); y += 3;

      const monthBody = monthKeys.map(mk => {
        const [yr, mn] = mk.split('-');
        const name = new Date(Number(yr), Number(mn) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
        const d = monthlyMap[mk];
        const net = d.income - d.expense;
        return [name, fmt(d.income), fmt(d.expense), `${net >= 0 ? '+' : '-'} ${fmt(Math.abs(net))}`];
      });

      const grandInc = Object.values(monthlyMap).reduce((s, v) => s + v.income, 0);
      const grandExp = Object.values(monthlyMap).reduce((s, v) => s + v.expense, 0);
      const grandNet = grandInc - grandExp;
      monthBody.push(['TOTAL', fmt(grandInc), fmt(grandExp), `${grandNet >= 0 ? '+' : '-'} ${fmt(Math.abs(grandNet))}`]);

      autoTable(doc, {
        startY: y,
        head: [['Month', 'Income', 'Expense', 'Net']],
        body: monthBody,
        theme: 'plain',
        headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 },
        didParseCell: (data: any) => {
          if (data.section === 'body' && data.row.index === monthBody.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [226, 232, 240];
          }
          if (data.section === 'body' && data.column.index === 3) {
            const v = data.cell.raw || '';
            if (v.startsWith('+')) data.cell.styles.textColor = [16, 185, 129];
            if (v.startsWith('-')) data.cell.styles.textColor = [239, 68, 68];
          }
        },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // TRANSACTIONS TABLE
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setTextColor(15, 23, 42); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text(`Transaction Details (${filteredData.length} entries)`, 14, y); y += 3;

    const sorted = [...filteredData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    autoTable(doc, {
      startY: y,
      head: [['Date', 'Description', 'Category', 'Account', 'Type', 'Amount']],
      body: sorted.map(t => [
        t.date, (t.note || '-').substring(0, 30), t.category, t.account,
        t.type === 'income' ? 'Income' : 'Expense', fmt(t.amount)
      ]),
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 24 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 24 },
        3: { cellWidth: 22 }, 4: { cellWidth: 18 }, 5: { cellWidth: 28, halign: 'right' },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 },
      didParseCell: (data: any) => {
        if (data.section === 'body' && data.column.index === 4) {
          if (data.cell.raw === 'Income') data.cell.styles.textColor = [16, 185, 129];
          if (data.cell.raw === 'Expense') data.cell.styles.textColor = [239, 68, 68];
        }
      },
    });

    // FOOTER
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);
      
      if (logoData) doc.addImage(logoData, 'PNG', 14, pageHeight - 17, 5, 5);
      const fOffset = logoData ? 21 : 14;
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(37, 99, 235);
      doc.text('RupeeRiser', fOffset, pageHeight - 12);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184);
      doc.text('by Raptile Dataworks', fOffset + 22, pageHeight - 12);
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
      doc.setFontSize(6);
      doc.text('System-generated document  |  raptiledataworks@gmail.com', 14, pageHeight - 7);
    }

    doc.save(`RupeeRiser_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Statement downloaded');
  };

  const themeButtons = [
    { key: 'light' as const, icon: Sun, label: t('light', language), desc: 'Clean bright interface' },
    { key: 'dark' as const, icon: Moon, label: t('dark', language), desc: 'Easy on the eyes' },
    { key: 'system' as const, icon: Monitor, label: t('auto', language), desc: 'Match your device' },
  ];

  const languageOptions = [
    { key: 'EN' as const, label: 'English', native: 'English', flag: '🇬🇧' },
    { key: 'TA' as const, label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { key: 'HI' as const, label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-6 px-4 pt-4 animate-fade-in">
      {/* BACK ARROW HEADER (mobile) */}
      <div className="flex items-center gap-3 mb-2 md:hidden">
        <Button variant="ghost" size="icon" 
          onClick={() => navigate('/dashboard')}
          className="rounded-full hover:bg-secondary/80">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">{t('settings', language)}</h1>
      </div>

      {/* Desktop heading */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          {t('settings', language)}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your app preferences and export data</p>
      </div>
      
      {/* USER CARD */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-card to-secondary/30 border border-border/60 p-6 rounded-2xl overflow-hidden shadow-sm">
        <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold truncate">{user?.name}</h2>
          <p className="text-muted-foreground text-sm truncate">{truncateEmail(user?.email)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* THEME PREFERENCE */}
        <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border/40 flex items-center gap-3">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
              <Palette className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-bold">{t('theme_preference', language)}</h3>
              <p className="text-xs text-muted-foreground">Choose your visual style</p>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {themeButtons.map(({ key, icon: Icon, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme === key 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md shadow-blue-500/10' 
                      : 'border-border/60 hover:border-blue-200 hover:bg-secondary/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    theme === key ? 'bg-blue-600 text-white shadow-lg' : 'bg-secondary text-muted-foreground'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-semibold ${theme === key ? 'text-blue-600' : ''}`}>{label}</span>
                  <span className="text-[10px] text-muted-foreground">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LANGUAGE SELECTOR */}
        <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border/40 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <Languages className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold">{t('language', language)}</h3>
              <p className="text-xs text-muted-foreground">Select your preferred language</p>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-2">
              {languageOptions.map(({ key, label, native, flag }) => (
                <button
                  key={key}
                  onClick={() => setLanguage(key)}
                  className={`flex items-center gap-3 w-full p-3.5 rounded-xl border-2 transition-all duration-200 ${
                    language === key 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/10' 
                      : 'border-border/60 hover:border-emerald-200 hover:bg-secondary/30'
                  }`}
                >
                  <span className="text-2xl">{flag}</span>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-semibold ${language === key ? 'text-emerald-600' : ''}`}>{label}</p>
                    <p className="text-xs text-muted-foreground">{native}</p>
                  </div>
                  {language === key && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EXPORT REPORTS */}
      <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/40 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold">{t('export_report', language)}</h3>
            <p className="text-xs text-muted-foreground">{t('download_reports', language)}</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('from_date', language)}</Label>
              <Input type="date" value={reportStart} onChange={e => setReportStart(e.target.value)} className="rounded-xl h-11 bg-secondary/30 border-border/60" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('to_date', language)}</Label>
              <Input type="date" value={reportEnd} onChange={e => setReportEnd(e.target.value)} className="rounded-xl h-11 bg-secondary/30 border-border/60" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-sm">
              <strong>Note:</strong> Leave dates empty to download your <strong>full transaction history</strong>. Select a range for specific reports.
            </p>
          </div>

          <Button 
            onClick={generatePDF} 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold text-base rounded-xl shadow-lg shadow-blue-500/20 gap-2"
          >
            <Download className="w-5 h-5" />
            {reportStart && reportEnd ? t('download_report_pdf', language) : t('download_report_pdf', language)}
          </Button>
        </div>
      </div>

      {/* RAPTILE DATAWORKS */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 flex justify-between items-center border border-blue-100 dark:border-blue-800/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-blue-900 dark:text-blue-100">Raptile Dataworks</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 opacity-80">Software Development</p>
          </div>
        </div>
        <a 
          href="https://raptiledataworks.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white dark:bg-blue-800 p-2.5 rounded-full shadow-md hover:scale-110 transition-transform border border-blue-100 dark:border-blue-700"
        >
          <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-200" />
        </a>
      </div>
      
      {/* SIGN OUT */}
      <Button 
        onClick={logout} 
        variant="ghost" 
        className="w-full h-14 text-red-500 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/20 gap-2"
      >
        <LogOut className="w-5 h-5" />
        {t('logout', language)}
      </Button>
    </div>
  );
}
