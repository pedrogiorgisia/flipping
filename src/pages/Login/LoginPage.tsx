import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // For demo purposes, we're just using a setTimeout
    // In a real app, you would make an API call here
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password') {
        navigate('/analyses');
      } else {
        setError('Email ou senha inválidos');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FlipInvest</h1>
            <p className="text-gray-600">Análise de Oportunidades Imobiliárias</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md flex items-center">
              <AlertCircle size={18} className="mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Lembrar-me
                </label>
              </div>
              <div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-500">
              <span>Credenciais de demonstração: demo@example.com / password</span>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{
        backgroundImage: "url('https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
      }}>
        <div className="h-full w-full bg-black bg-opacity-30 flex items-center justify-center">
          <div className="max-w-md px-8 py-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Identifique Oportunidades</h2>
            <p className="text-lg opacity-90">
              Analise imóveis, calcule ROI e tome decisões baseadas em dados com nossa plataforma completa de análise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;