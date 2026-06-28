import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Shield } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Add a trial license upon registration
        const parts = [];
        for (let i = 0; i < 3; i++) {
          parts.push(Math.random().toString(16).substring(2, 6).toUpperCase());
        }
        const licenseKey = `ONYX-${parts.join('-')}`;
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 10);
        
        const newLicense = {
          key: licenseKey,
          email: userCredential.user.email,
          domain: 'tusitio.com',
          type: 'trial',
          status: 'active',
          createdAt: serverTimestamp(),
          expiresAt: expiresAt
        };

        const newDocRef = doc(collection(db, 'licenses'));
        await setDoc(newDocRef, newLicense);
        
        const logDocRef = doc(collection(db, 'license_logs'));
        await setDoc(logDocRef, {
          email: userCredential.user.email,
          licenseId: newDocRef.id,
          action: 'created',
          newDomain: 'tusitio.com',
          timestamp: serverTimestamp()
        });

      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      
      let errorMessage = 'Fallo en la autenticación. Por favor, inténtelo de nuevo.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ya está registrado.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = 'Credenciales inválidas. Correo o contraseña incorrectos.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor, ingresa tu email para recuperar la contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setError('Se ha enviado un correo para restablecer tu contraseña. (Revisa la carpeta de spam)');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al enviar el correo de recuperación.');
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
          {isRegister ? 'Registro de Usuario' : 'Gestión de Licencias v2.4.1'}
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

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 onyx-btn text-white text-sm font-bold py-3 rounded-lg shadow-lg shadow-cyan-900/20 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? 'Procesando...' : (isRegister ? 'Crear Cuenta y Activar Prueba' : 'Iniciar sesión')}
            </button>
          </form>

          {!isRegister && (
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <div className="text-center mt-4 border-t border-white/5 pt-6">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-widest"
            >
              {isRegister ? 'Ya tengo una cuenta' : 'Crear una cuenta nueva'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
