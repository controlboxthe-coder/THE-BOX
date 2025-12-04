import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Transaction, User } from './types';
import { DEFAULT_CATEGORIES, LICENSE_KEY_PRO } from './constants';
import { loadLocalState, saveLocalState, saveUserSession, loadUserSession, clearUserSession } from './services/storageService';
import { v4 as uuidv4 } from 'uuid';
import { LayoutDashboard, Plus, Settings as SettingsIcon, LogOut, Moon } from 'lucide-react';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import Settings from './components/Settings';
import AIAssistant from './components/AIAssistant';

const INITIAL_STATE: AppState = {
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  recurring: [],
  licenseKey: '',
  user: null,
  isAuthenticated: false
};

function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [view, setView] = useState<'dashboard' | 'add' | 'settings'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize
  useEffect(() => {
    const sessionUser = loadUserSession();
    if (sessionUser) {
      handleLogin(sessionUser, false);
    } else {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync with LocalStorage whenever state changes (if logged in)
  useEffect(() => {
    if (state.isAuthenticated && state.user?.email) {
      saveLocalState(state.user.email, state);
    }
  }, [state]);

  const handleLogin = (user: User, isNewLogin = true) => {
    setIsLoading(true);
    
    // Simulate loading data from cloud/local
    setTimeout(() => {
      const storedData = loadLocalState(user.email);
      
      if (storedData) {
        setState(prev => ({
          ...prev,
          ...storedData,
          user: user,
          isAuthenticated: true
        }));
      } else {
        // New user or no data
        setState(prev => ({
          ...prev,
          user: user,
          isAuthenticated: true
        }));
      }
      
      if (isNewLogin) saveUserSession(user);
      setIsLoading(false);
    }, 600);
  };

  const handleLogout = () => {
    clearUserSession();
    setState(INITIAL_STATE);
    setView('dashboard');
  };

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: uuidv4()
    };
    
    setState(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions]
    }));
    setView('dashboard');
  };

  const deleteTransaction = (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const updateLicense = (key: string) => {
    setState(prev => ({
      ...prev,
      licenseKey: key
    }));
    if (key === LICENSE_KEY_PRO) {
      alert("Modo PRO ativado!");
    }
  };

  const restoreData = (data: Partial<AppState>) => {
    setState(prev => ({
      ...prev,
      transactions: data.transactions || prev.transactions,
      categories: data.categories || prev.categories,
      recurring: data.recurring || prev.recurring
    }));
  };

  const isPro = state.licenseKey === LICENSE_KEY_PRO;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-box-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-box-dark text-box-text flex flex-col md:flex-row">
      {/* Sidebar / Navbar */}
      <nav className="md:w-64 bg-box-card border-r border-gray-800 p-6 flex flex-col justify-between z-20 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">B</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">THE BOX</h1>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setView('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            
            <button
              onClick={() => setView('add')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                view === 'add' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Plus size={20} />
              <span className="font-medium">Nova Transação</span>
            </button>

            <button
              onClick={() => setView('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                view === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <SettingsIcon size={20} />
              <span className="font-medium">Ajustes</span>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-indigo-400 font-bold">
              {state.user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{state.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{state.user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut size={16} />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-8 md:hidden">
          <h2 className="text-2xl font-bold text-white">THE BOX</h2>
          <button onClick={() => setView('settings')} className="p-2 bg-gray-800 rounded-lg">
            <SettingsIcon size={20} />
          </button>
        </header>

        <div className="max-w-6xl mx-auto">
          {view === 'dashboard' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Visão Geral</h2>
                {!isPro && (
                  <span className="px-3 py-1 bg-gray-800 text-xs rounded-full text-gray-400 border border-gray-700">
                    Modo Demo
                  </span>
                )}
                {isPro && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-yellow-500 text-xs rounded-full text-white font-bold shadow-lg">
                    PRO ATIVO
                  </span>
                )}
              </div>
              <Dashboard transactions={state.transactions} onDelete={deleteTransaction} />
            </>
          )}

          {view === 'add' && (
            <div className="max-w-2xl mx-auto">
              <TransactionForm 
                categories={state.categories} 
                onAdd={addTransaction} 
                onCancel={() => setView('dashboard')} 
              />
            </div>
          )}

          {view === 'settings' && (
            <Settings 
              appState={state} 
              onUpdateLicense={updateLicense} 
              onRestore={restoreData}
              isPro={isPro}
            />
          )}
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant 
        categories={state.categories} 
        onAction={addTransaction}
        isPro={isPro}
      />
    </div>
  );
}

export default App;