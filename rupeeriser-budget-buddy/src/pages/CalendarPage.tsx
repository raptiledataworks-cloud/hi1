import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, TrendingUp, TrendingDown } from 'lucide-react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const CalendarPage = () => {
  const navigate = useNavigate();
  const { transactions } = useApp();

  // This month stats
  const now = new Date();
  const thisMonthTx = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthIncome = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const monthExpense = thisMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const activeDays = new Set(thisMonthTx.map(t => t.date)).size;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 pb-32 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-full md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-display">Calendar</h1>
            <p className="text-xs text-muted-foreground">Track your daily spending patterns</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-secondary/50 px-3 py-1.5 rounded-full">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-muted-foreground">
            {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* MINI STATS */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card rounded-2xl p-3.5 border shadow-sm">
          <div className="flex items-center gap-2 mb-0.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground">Income</span>
          </div>
          <p className="text-sm font-bold text-emerald-600">₹{monthIncome.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-card rounded-2xl p-3.5 border shadow-sm">
          <div className="flex items-center gap-2 mb-0.5">
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[10px] text-muted-foreground">Spent</span>
          </div>
          <p className="text-sm font-bold text-rose-600">₹{monthExpense.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-card rounded-2xl p-3.5 border shadow-sm">
          <div className="flex items-center gap-2 mb-0.5">
            <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[10px] text-muted-foreground">Active</span>
          </div>
          <p className="text-sm font-bold text-foreground">{activeDays} days</p>
        </div>
      </div>

      <CalendarView />
    </div>
  );
};

export default CalendarPage;
