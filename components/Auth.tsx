import React, { useState } from 'react';
import { User } from '../types';
import { BoxIcon, Lock, Mail, User as UserIcon, Phone } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API delay
    setTimeout(() => {
      onLogin({
        name: formData.name || 'Usuário',
        email: formData.email,
        phone: formData.phone
      });
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-box-dark px-4">
      <div className="bg-box-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <BoxIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">THE BOX</h1>
          <p className="text-gray-400 text-sm">Controle Financeiro 2.0</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
              <input
                name="name"
                type="text"
                placeholder="Nome Completo"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-indigo-500"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
              <input
                name="phone"
                type="tel"
                placeholder="Telefone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input
              name="password"
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-600/30"
          >
            {isLogin ? 'Entrar' : 'Registrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            {isLogin ? 'Não tem conta? Crie agora' : 'Já possui conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;