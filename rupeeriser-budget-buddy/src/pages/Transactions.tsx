import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TransactionList } from '@/components/transactions/TransactionList';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { Button } from '@/components/ui/button';
import { Receipt, Filter, Plus, ArrowLeft, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction } from '@/types/finance';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Transactions() {
   const navigate = useNavigate(); 
  const { transactions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [dateFilter, setDateFilter] = useState('month');

  const getFilteredTransactions = () => {
    const now = new Date();
    return transactions.filter(tx => {
        const txDate = new Date(tx.date);
        if (dateFilter === 'today') return txDate.toDateString() === now.toDateString();
        if (dateFilter === 'week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            return txDate >= startOfWeek;
        }
        if (dateFilter === 'month') return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        if (dateFilter === 'year') return txDate.getFullYear() === now.getFullYear();
        return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredData = getFilteredTransactions();
  const totalIncome = filteredData.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredData.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTx(null);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-32 animate-fade-in px-4 pt-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" 
            onClick={() => navigate('/dashboard')}
            className="rounded-full md:hidden">
              <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-display">Transactions</h1>
            <p className="text-muted-foreground text-xs">{filteredData.length} entries found</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 rounded-xl gap-2 h-10 px-4 shadow-md"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl p-4 border shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Income</span>
          </div>
          <p className="text-base font-bold text-emerald-600">
            ₹{totalIncome.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-4 border shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Expense</span>
          </div>
          <p className="text-base font-bold text-rose-600">
            ₹{totalExpense.toLocaleString('en-IN')}
          </p>
        </div>
        <div className={cn(
          "rounded-2xl p-4 border shadow-sm",
          totalIncome - totalExpense >= 0 
            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" 
            : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              {totalIncome - totalExpense >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Net</span>
          </div>
          <p className={cn("text-base font-bold", totalIncome - totalExpense >= 0 ? "text-emerald-600" : "text-rose-600")}>
            {totalIncome - totalExpense >= 0 ? '+' : ''}₹{(totalIncome - totalExpense).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex items-center gap-2">
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-card border-border h-10 rounded-xl">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-4 h-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LIST */}
      {filteredData.length > 0 ? (
        <TransactionList 
          transactions={filteredData} 
          onEdit={handleEdit} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-60 bg-muted/20 rounded-[32px] border border-dashed border-border">
          <Receipt className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">No transactions found</h3>
          <p className="text-sm text-muted-foreground">Try changing the filter or add a new one.</p>
        </div>
      )}

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={handleClose}
        transactionToEdit={editingTx} 
      />
    </div>
  );
};