import React, { useState } from 'react';
import { LICENSE_KEY_PRO } from '../constants';
import { AppState } from '../types';
import { Download, Upload, Key, Database } from 'lucide-react';

interface SettingsProps {
  appState: AppState;
  onUpdateLicense: (key: string) => void;
  onRestore: (data: Partial<AppState>) => void;
  isPro: boolean;
}

const Settings: React.FC<SettingsProps> = ({ appState, onUpdateLicense, onRestore, isPro }) => {
  const [licenseInput, setLicenseInput] = useState(appState.licenseKey);
  
  const handleSaveLicense = () => {
    onUpdateLicense(licenseInput);
  };

  const handleBackup = () => {
    if (!isPro) return;
    const dataStr = JSON.stringify(appState, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thebox_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPro) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onRestore(json);
        alert('Backup restaurado com sucesso!');
      } catch (err) {
        alert('Erro ao ler arquivo de backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-box-card p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Key className="text-yellow-500" />
          <h3 className="text-xl font-bold text-white">Licença PRO</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={licenseInput}
            onChange={(e) => setLicenseInput(e.target.value)}
            placeholder="Insira sua chave (ex: BOXPRO)"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
          />
          <button 
            onClick={handleSaveLicense}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-colors"
          >
            Ativar
          </button>
        </div>
        {isPro ? (
          <p className="mt-2 text-green-400 text-sm">✓ Licença PRO Ativa. Todos os recursos liberados.</p>
        ) : (
          <p className="mt-2 text-gray-400 text-sm">Utilize a chave 'BOXPRO' para testar.</p>
        )}
      </div>

      <div className={`bg-box-card p-6 rounded-xl border border-gray-700 shadow-lg ${!isPro ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center space-x-3 mb-4">
          <Database className="text-blue-500" />
          <h3 className="text-xl font-bold text-white">Backup & Restore</h3>
        </div>
        
        <p className="text-gray-400 mb-6 text-sm">
          Faça o download dos seus dados ou restaure um backup anterior. Recurso exclusivo PRO.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleBackup}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Baixar Backup (JSON)</span>
          </button>
          
          <label className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            <span>Restaurar Backup</span>
            <input type="file" className="hidden" accept=".json" onChange={handleRestore} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;