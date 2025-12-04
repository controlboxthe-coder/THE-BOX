import React, { useState, useEffect } from 'react';
import { Mic, Loader2, X } from 'lucide-react';
import { processVoiceCommand } from '../services/aiService';
import { AIParsedAction, Transaction } from '../types';

interface AIAssistantProps {
  categories: string[];
  onAction: (txData: Omit<Transaction, 'id'>) => void;
  isPro: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ categories, onAction, isPro }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Check for browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    if (!isOpen) {
      setTranscript('');
      setFeedback(null);
    }
  }, [isOpen]);

  const startListening = () => {
    if (!SpeechRecognition) {
      setFeedback("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setFeedback("Ouvindo...");
    };

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleVoiceCommand(text);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setFeedback(`Erro: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleVoiceCommand = async (text: string) => {
    setIsProcessing(true);
    setFeedback("Processando com IA...");
    
    try {
      const result: AIParsedAction = await processVoiceCommand(text, categories);
      
      if (result.action === 'add_tx' && result.amount && result.description) {
        onAction({
          description: result.description,
          amount: result.amount,
          type: result.type || 'expense',
          category: result.category || 'Outros',
          date: result.date || new Date().toISOString().split('T')[0]
        });
        setFeedback("Transação adicionada com sucesso!");
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setFeedback("Não entendi o comando financeiro.");
      }
    } catch (error) {
      setFeedback("Erro ao conectar com a IA.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isPro) {
    return null; // Don't show for non-pro users
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 transition-transform z-50 border-2 border-white/20"
        title="Assistente IA"
      >
        <Mic className="w-6 h-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-box-card border border-gray-600 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-indigo-500/20 text-indigo-400'}`}>
                 {isProcessing ? <Loader2 className="w-10 h-10 animate-spin" /> : <Mic className="w-10 h-10" />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Assistente THE BOX</h3>
                <p className="text-sm text-gray-400">
                  Diga algo como: <br/>
                  <span className="italic text-gray-300">"Gastei 50 reais com gasolina hoje"</span>
                </p>
              </div>

              {transcript && (
                <div className="bg-gray-800 p-3 rounded-lg w-full">
                  <p className="text-white text-sm">"{transcript}"</p>
                </div>
              )}

              <p className={`text-sm font-medium ${feedback?.includes('sucesso') ? 'text-green-400' : 'text-indigo-300'}`}>
                {feedback || "Toque para falar"}
              </p>

              {!isListening && !isProcessing && (
                <button
                  onClick={startListening}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
                >
                  Ouvir
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;