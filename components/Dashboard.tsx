import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, WalletIcon } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onDelete }) => {
  // Calculations
  const stats = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const balance = stats.income - stats.expense;

  const chartData = useMemo(() => {
    // Group by category
    const grouped: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        grouped[t.category] = (grouped[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 categories
  }, [transactions]);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-box-card p-5 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-box-muted text-sm font-medium">Saldo Atual</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-box-accent' : 'text-box-danger'}`}>
              R$ {balance.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-gray-700/50 rounded-full">
            <WalletIcon className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        <div className="bg-box-card p-5 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-box-muted text-sm font-medium">Receitas</p>
            <p className="text-2xl font-bold text-box-text">
              R$ {stats.income.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-gray-700/50 rounded-full">
            <ArrowUpIcon className="w-6 h-6 text-box-accent" />
          </div>
        </div>

        <div className="bg-box-card p-5 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-box-muted text-sm font-medium">Despesas</p>
            <p className="text-2xl font-bold text-box-text">
              R$ {stats.expense.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-gray-700/50 rounded-full">
            <ArrowDownIcon className="w-6 h-6 text-box-danger" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-box-card p-5 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Gastos por Categoria</h3>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Sem dados suficientes
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-box-card p-5 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Últimas Transações</h3>
          <div className="space-y-3">
            {recentTransactions.length === 0 && (
              <p className="text-gray-500 text-sm">Nenhuma transação registrada.</p>
            )}
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                <div>
                  <p className="text-sm font-medium text-white">{tx.description}</p>
                  <p className="text-xs text-gray-400">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-box-accent' : 'text-box-danger'}`}>
                    {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                  </p>
                  <button 
                    onClick={() => onDelete(tx.id)}
                    className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;