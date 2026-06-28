import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Shield } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Fallo en la autenticación. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 left-6">
        <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
          ← Volver al inicio
        </button>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,209,255,0.3)]">
            <Shield className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Servidor Maestro <span className="font-light text-gray-400">ONYX</span>
        </h2>
        <p className="mt-2 text-center text-xs text-gray-500 uppercase tracking-widest">
          Gestión de Licencias v2.4.1
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="onyx-card py-8 px-4 sm:px-10 flex flex-col gap-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-rose-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-500">{error}</p>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-6">
              Autenticación requerida para acceder a la terminal.
            </p>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full onyx-btn text-white text-sm font-bold py-3 rounded-lg shadow-lg shadow-cyan-900/20 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              {loading ? 'Verificando...' : 'Iniciar sesión con Google'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
