import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, Plus, Trash2, ArrowLeft, History, Calculator, AlertTriangle, Wallet, Target, PiggyBank, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FinancialSetup() {
  const { budget, updateBudgetSettings, transactions } = useApp();
  const navigate = useNavigate();
  
  const [salaryInput, setSalaryInput] = useState<string>('');
  const [targetSpend, setTargetSpend] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  interface MandatoryExpense { id: string; name: string; amount: number; isPaid?: boolean; }
  const [mandatoryList, setMandatoryList] = useState<MandatoryExpense[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [prevBalance, setPrevBalance] = useState(0);

  useEffect(() => {
    const now = new Date();
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthTx = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === prevMonthDate.getMonth() && d.getFullYear() === prevMonthDate.getFullYear();
    });
    const income = prevMonthTx.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
    const expense = prevMonthTx.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
    setPrevBalance(income - expense);

    if (budget) {
        setSalaryInput(budget.salary.toString());
        if (budget.config) {
            try {
                const parsed = JSON.parse(budget.config);
                setMandatoryList(parsed.mandatoryList || []);
                setTargetSpend(parsed.targetSpend ? parsed.targetSpend.toString() : '');
            } catch(e) {}
        }
    }
  }, [budget, transactions]);

  const saveToDb = async (updatedList: MandatoryExpense[]) => {
      setIsSaving(true);
      const totalMandatory = updatedList.reduce((acc, item) => acc + item.amount, 0);
      const fixedCostsPayload = { rent: 0, travel: 0, phone: 0, subscriptions: totalMandatory };
      
      const now = new Date();
      const configJson = JSON.stringify({ 
          mandatoryList: updatedList,
          targetSpend: targetSpend ? Number(targetSpend) : 0,
          monthKey: `${now.getFullYear()}_${now.getMonth()}` 
      });

      try {
        await updateBudgetSettings(Number(salaryInput), fixedCostsPayload, configJson);
        toast.success("Setup Saved");
      } catch(e) { toast.error("Sync failed"); } 
      finally { setIsSaving(false); }
  };

  const addItem = () => {
      if(!newItemName || !newItemAmount) return;
      const newItem = { id: Date.now().toString(), name: newItemName, amount: parseFloat(newItemAmount) };
      const newList = [...mandatoryList, newItem];
      setMandatoryList(newList);
      setNewItemName(''); setNewItemAmount('');
      saveToDb(newList);
  };

  const requestDelete = (id: string) => setDeleteId(id);

  const confirmDelete = () => {
      if(!deleteId) return;
      const newList = mandatoryList.filter(i => i.id !== deleteId);
      setMandatoryList(newList);
      saveToDb(newList);
      setDeleteId(null);
  };

  const totalMandatory = mandatoryList.reduce((acc, item) => acc + item.amount, 0);
  const paidMandatory = mandatoryList.filter(i => i.isPaid).reduce((acc, item) => acc + item.amount, 0);
  const projectedRemaining = Number(salaryInput) - totalMandatory;

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-fade-in px-4 pt-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Financial Setup</h1>
            <p className="text-xs text-muted-foreground">Configure your monthly budget</p>
          </div>
        </div>
        <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full">
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <History className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Last Month</span>
          </div>
          <h3 className={cn("text-lg font-bold", prevBalance >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
            {prevBalance >= 0 ? '+' : ''}₹{prevBalance.toLocaleString()}
          </h3>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground font-medium">Salary</span>
          </div>
          <h3 className="text-lg font-bold text-foreground">₹{Number(salaryInput || 0).toLocaleString()}</h3>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] text-muted-foreground font-medium">Fixed Bills</span>
          </div>
          <h3 className="text-lg font-bold text-orange-600">₹{totalMandatory.toLocaleString()}</h3>
        </div>
        <div className={cn(
          "border rounded-2xl p-4",
          projectedRemaining >= 0 ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <PiggyBank className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground font-medium">After Bills</span>
          </div>
          <h3 className={cn("text-lg font-bold", projectedRemaining >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
            ₹{projectedRemaining.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* MAIN SETUP CARD */}
      <div className="bg-card border rounded-3xl p-5 md:p-8 space-y-6 shadow-sm">
        
        {/* INCOME & TARGET */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Monthly Allocation</h3>
              <p className="text-xs text-muted-foreground">Set your income and optional spending limit</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/30 rounded-2xl p-5 border border-transparent focus-within:border-blue-500/30 transition-all">
              <Label className="text-blue-600 font-bold text-sm mb-2 block">Monthly Income</Label>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-muted-foreground">₹</span>
                <Input 
                  type="number" value={salaryInput} 
                  onChange={e => setSalaryInput(e.target.value)} 
                  onBlur={() => saveToDb(mandatoryList)} 
                  className="bg-transparent border-none shadow-none text-2xl font-bold h-10 p-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground" 
                  placeholder="0"
                />
              </div>
            </div>

            <div className="bg-secondary/30 rounded-2xl p-5 border border-transparent focus-within:border-emerald-500/30 transition-all">
              <Label className="text-emerald-600 font-bold text-sm mb-2 block">
                Will Spend Upto <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-muted-foreground">₹</span>
                <Input 
                  type="number" value={targetSpend} 
                  onChange={e => setTargetSpend(e.target.value)} 
                  onBlur={() => saveToDb(mandatoryList)} 
                  className="bg-transparent border-none shadow-none text-2xl font-bold h-10 p-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground" 
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MANDATORY EXPENSES */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Label className="font-bold text-base text-foreground">Fixed Monthly Bills</Label>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground font-mono">
                {mandatoryList.length} items
              </span>
            </div>
            <span className="text-sm font-mono font-bold text-orange-600">₹{totalMandatory.toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            {mandatoryList.map((item) => (
              <div key={item.id} className={cn(
                'flex items-center gap-3 p-3.5 rounded-2xl transition-all border',
                item.isPaid 
                  ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-card border-border hover:border-blue-200 dark:hover:border-blue-800'
              )}>
                {/* Paid Checkbox */}
                <input 
                  type="checkbox" 
                  id={`paid-${item.id}`}
                  className="w-5 h-5 cursor-pointer accent-emerald-500 rounded shrink-0"
                  checked={item.isPaid || false} 
                  onChange={(e) => {
                    const newList = mandatoryList.map(i => i.id === item.id ? { ...i, isPaid: e.target.checked } : i);
                    setMandatoryList(newList);
                    saveToDb(newList);
                  }}
                />
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-semibold text-sm truncate", 
                    item.isPaid ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-foreground'
                  )}>
                    {item.name}
                  </p>
                </div>

                <span className={cn(
                  "font-mono font-bold text-sm shrink-0",
                  item.isPaid ? 'text-emerald-600 opacity-60' : 'text-foreground'
                )}>
                  ₹{item.amount.toLocaleString()}
                </span>

                <button 
                  onClick={() => requestDelete(item.id)} 
                  className="text-muted-foreground hover:text-red-500 p-1.5 transition-colors shrink-0 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            ))}

            {mandatoryList.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No fixed expenses added yet. Add your rent, EMIs, subscriptions below.
              </div>
            )}
          </div>

          {/* ADD NEW */}
          <div className="flex gap-2 mt-3">
            <Input 
              placeholder="Expense Name (e.g. Rent)" 
              value={newItemName} 
              onChange={e => setNewItemName(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && addItem()}
              className="flex-[2] h-11 rounded-xl"
            />
            <Input 
              type="number" 
              placeholder="Amount" 
              value={newItemAmount} 
              onChange={e => setNewItemAmount(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && addItem()}
              className="flex-1 h-11 rounded-xl"
            />
            <Button onClick={addItem} className="bg-blue-600 hover:bg-blue-700 h-11 w-11 rounded-xl text-white shrink-0">
              <Plus className="w-5 h-5"/>
            </Button>
          </div>

          {/* Paid Progress */}
          {mandatoryList.length > 0 && (
            <div className="mt-4 p-3 bg-secondary/30 rounded-xl">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Bills Paid Progress</span>
                <span className="font-medium">{mandatoryList.filter(i => i.isPaid).length}/{mandatoryList.length}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${mandatoryList.length > 0 ? (mandatoryList.filter(i => i.isPaid).length / mandatoryList.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DELETE DIALOG */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" /> Delete Expense?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this fixed expense from your budget. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 rounded-xl text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}