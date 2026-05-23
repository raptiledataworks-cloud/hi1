import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Wallet2,
  ShoppingBag,
  Utensils,
  Car,
  Heart,
  Tv,
  Bell,
  PiggyBank,
  Target,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { transactions, budget, user } = useApp();
  const navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = useState(false);

  /* ---------------- CONFIG (MANDATORY LIST) ---------------- */
  let mandatoryList: any[] = [];
  let targetSpend = 0;

  if (budget.config) {
    try {
      const parsed = JSON.parse(budget.config);
      mandatoryList = parsed.mandatoryList || [];
      targetSpend = Number(parsed.targetSpend) || 0;
    } catch {}
  }

  const totalMandatory = mandatoryList.reduce(
    (sum: number, item: any) => sum + (item.amount || 0),
    0
  );

  // Paid mandatory items (checked as "Paid" in Financial Setup)
  const paidMandatoryItems = mandatoryList.filter((item: any) => item.isPaid === true);
  const totalPaidMandatory = paidMandatoryItems.reduce(
    (sum: number, item: any) => sum + (item.amount || 0),
    0
  );

  /* ---------------- CALCULATIONS ---------------- */
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // 1. Current Month Transactions
  const monthlyTx = useMemo(
    () =>
      transactions.filter(
        (t) => {
          const d = new Date(t.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }
      ),
    [transactions, currentMonth, currentYear]
  );

  const totalExpenseLogged = monthlyTx
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const totalIncome = monthlyTx
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  // ==========================================
  // 💰 SALARY-BASED BUDGET ARCHITECTURE
  // ==========================================
  const salary = Number(budget.salary) || 0;

  // TOTAL of everything deducted from salary
  const totalExpense = totalExpenseLogged + totalPaidMandatory;

  // After mandatory bills, what's left for discretionary + savings
  const afterMandatory = salary - totalPaidMandatory;

  // "Will Spend Upto" = budget for discretionary (logged) expenses only
  // If targetSpend is set: remaining = targetSpend - loggedExpenses
  // If exceeded, goes negative
  const targetRemaining = targetSpend > 0 ? targetSpend - totalExpenseLogged : null;

  // SAVINGS = Salary - Mandatory Paid - Logged Expenses
  // If positive → money saved this month
  // If negative → overspent beyond salary
  const monthlySavings = salary - totalPaidMandatory - totalExpenseLogged;

  // Safe to Spend = what's left from salary after all deductions
  const safeToSpendBalance = monthlySavings;

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });

  /* ---------------- ICON MAP ---------------- */
  const getIcon = (cat: string) => {
    const map: any = {
      Food: Utensils,
      Transport: Car,
      Shopping: ShoppingBag,
      Health: Heart,
      Entertainment: Tv,
    };
    return map[cat] || Wallet;
  };

  /* ---------------- SORTED TRANSACTIONS ---------------- */
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  /* ---------------- GRAPH DATA ---------------- */
  const getGraphData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dailyExp = transactions
        .filter(
          (t) =>
            new Date(t.date).toISOString().split('T')[0] ===
              dateStr && t.type === 'expense'
        )
        .reduce((s, t) => s + t.amount, 0);

      data.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        spend: dailyExp,
      });
    }
    return data;
  };

  return (
    <div className="relative max-w-7xl mx-auto px-6 pt-6 pb-40 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h2 className="text-xl font-bold">{user?.name}</h2>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full border">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="space-y-5">
          {/* MAIN BALANCE CARD */}
          <div className={cn(
            'text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden',
            safeToSpendBalance < 0 ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-blue-600'
          )}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
            
            <p className="text-white/70 text-sm mb-1 relative z-10">
              {safeToSpendBalance < 0 ? '⚠️ Over Budget' : 'Balance After All Deductions'}
            </p>
            <h1 className="text-4xl font-bold mb-5 relative z-10">
              {safeToSpendBalance < 0 ? '-' : ''}{formatCurrency(Math.abs(safeToSpendBalance))}
            </h1>
            
            <div className="flex flex-col gap-2 relative z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full self-start">
                Salary − Mandatory − Expenses
              </span>
              
              <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-white/20">
                {/* Salary (Base) */}
                <div className="flex justify-between items-center text-xs text-white/80">
                  <span>💰 Monthly Salary:</span>
                  <span className="font-bold text-white">{formatCurrency(salary)}</span>
                </div>

                {/* Paid Mandatory Bills — deducted first */}
                {totalPaidMandatory > 0 && (
                  <div className="flex justify-between items-center text-xs text-white/80">
                    <span>📋 Mandatory Bills (Paid):</span>
                    <span className="font-bold text-orange-300">-{formatCurrency(totalPaidMandatory)}</span>
                  </div>
                )}

                {/* After Mandatory */}
                {totalPaidMandatory > 0 && (
                  <div className="flex justify-between items-center text-xs text-white/60 pl-2">
                    <span>After Mandatory:</span>
                    <span className="font-semibold">{formatCurrency(afterMandatory)}</span>
                  </div>
                )}

                {/* Logged Expenses (discretionary spending) */}
                {totalExpenseLogged > 0 && (
                  <div className="flex justify-between items-center text-xs text-white/80">
                    <span>📝 Discretionary Spent:</span>
                    <span className="font-bold text-rose-300">-{formatCurrency(totalExpenseLogged)}</span>
                  </div>
                )}

                {/* Separator with totals */}
                {totalExpense > 0 && (
                  <div className="flex justify-between items-center text-xs text-white/80 pt-1.5 mt-1 border-t border-white/15">
                    <span className="font-semibold">Total Deducted from Salary:</span>
                    <span className="font-bold text-rose-200">-{formatCurrency(totalExpense)}</span>
                  </div>
                )}

                {/* "Will Spend Upto" Target — only tracks logged/discretionary expenses */}
                {targetRemaining !== null && (
                  <div className={cn(
                    'flex justify-between items-center text-xs mt-1.5 px-2.5 py-2 rounded-lg',
                    targetRemaining < 0 ? 'bg-red-900/50 text-red-200' : 'bg-emerald-900/30 text-emerald-200'
                  )}>
                    <span>🎯 Spending Limit Left:</span>
                    <span className="font-bold">
                      {targetRemaining < 0 ? '-' : ''}{formatCurrency(Math.abs(targetRemaining))}
                    </span>
                  </div>
                )}
                {targetRemaining !== null && targetRemaining < 0 && (
                  <p className="text-[10px] text-red-300/80 pl-1">⚠ You exceeded your "Will Spend Upto" limit by {formatCurrency(Math.abs(targetRemaining))}</p>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <Button
              onClick={() => setIsAddOpen(true)}
              className="flex-1 h-14 rounded-2xl bg-foreground text-background gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/setup')}
              className="flex-1 h-14 rounded-2xl"
            >
              <Wallet2 className="w-5 h-5 mr-2" />
              Setup
            </Button>
          </div>

          {/* 3 STAT CARDS: Salary, Expenses, Savings */}
          <div className="grid grid-cols-3 gap-3">
            {/* Salary Card */}
            <div className="bg-card p-4 rounded-[20px] border">
              <ArrowDownLeft className="w-5 h-5 text-emerald-600 mb-1.5" />
              <p className="text-[10px] text-muted-foreground">Salary</p>
              <p className="font-bold text-emerald-600 text-sm">
                {formatCurrency(salary)}
              </p>
            </div>

            {/* Total Expense Card */}
            <div className={cn(
              'p-4 rounded-[20px] border',
              totalExpense > salary ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' : 'bg-card'
            )}>
              <ArrowUpRight className="w-5 h-5 text-rose-600 mb-1.5" />
              <p className="text-[10px] text-muted-foreground">Spent</p>
              <p className={cn(
                'font-bold text-sm',
                totalExpense > salary ? 'text-red-600' : 'text-foreground'
              )}>
                {formatCurrency(totalExpense)}
              </p>
              <p className="text-[9px] text-muted-foreground">
                Bills + Expenses
              </p>
            </div>

            {/* Savings Card */}
            <div className={cn(
              'p-4 rounded-[20px] border',
              monthlySavings > 0 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
                : monthlySavings < 0 
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                  : 'bg-card'
            )}>
              <PiggyBank className={cn(
                'w-5 h-5 mb-1.5',
                monthlySavings >= 0 ? 'text-emerald-600' : 'text-red-500'
              )} />
              <p className="text-[10px] text-muted-foreground">Savings</p>
              <p className={cn(
                'font-bold text-sm',
                monthlySavings > 0 ? 'text-emerald-600' : monthlySavings < 0 ? 'text-red-600' : 'text-foreground'
              )}>
                {monthlySavings < 0 ? '-' : '+'}{formatCurrency(Math.abs(monthlySavings))}
              </p>
              <p className="text-[9px] text-muted-foreground">
                This Month
              </p>
            </div>
          </div>

          {/* TARGET PROGRESS BAR — if target is set */}
          {targetSpend > 0 && (
            <div className="bg-card p-5 rounded-[24px] border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold">Spending Limit</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(totalExpenseLogged)} / {formatCurrency(targetSpend)}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                <div 
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    totalExpenseLogged > targetSpend 
                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                      : totalExpenseLogged > targetSpend * 0.8
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-emerald-500 to-green-500'
                  )}
                  style={{ width: `${Math.min((totalExpenseLogged / targetSpend) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className={cn(
                  'text-xs font-medium',
                  targetRemaining !== null && targetRemaining < 0 ? 'text-red-500' : 'text-emerald-600'
                )}>
                  {targetRemaining !== null && targetRemaining < 0 
                    ? `Over by ${formatCurrency(Math.abs(targetRemaining))}` 
                    : `${formatCurrency(targetRemaining || 0)} left`
                  }
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round((totalExpenseLogged / targetSpend) * 100)}% used
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card p-6 rounded-[32px] border">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Spending Trend
              </h3>
              <span className="text-xs text-muted-foreground">
                Last 7 Days
              </span>
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getGraphData()}>
                  <defs>
                    <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#spend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Latest Entries</h3>
              <Button
                variant="ghost"
                onClick={() => navigate('/transactions')}
              >
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {sortedTransactions.slice(0, 5).map((tx) => {
                const Icon = getIcon(tx.category);
                return (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-4 bg-card rounded-xl border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {tx.note || tx.category}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.date} • {tx.account}
                        </p>
                      </div>
                    </div>
                    <p
                      className={
                        tx.type === 'income'
                          ? 'text-emerald-600 font-bold'
                          : 'font-bold'
                      }
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING ADD BUTTON */}
      <button
        onClick={() => setIsAddOpen(true)}
        className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
          'w-16 h-16 rounded-full bg-blue-600 text-white',
          'flex items-center justify-center',
          'shadow-[0_12px_32px_rgba(37,99,235,0.6)]',
          'hover:scale-105 active:scale-95 transition-all',
          'after:absolute after:inset-0 after:rounded-full',
          'after:animate-ping after:bg-blue-600/30 after:-z-10'
        )}
      >
        <Plus className="w-8 h-8" />
      </button>

      <AddTransactionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}
