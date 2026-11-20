import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, Shield } from "lucide-react";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(
    searchParams.get("mode") === "register"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Simple Math CAPTCHA
  const [captchaNum1, setCaptchaNum1] = useState(
    Math.floor(Math.random() * 10) + 1
  );
  const [captchaNum2, setCaptchaNum2] = useState(
    Math.floor(Math.random() * 10) + 1
  );
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const navigate = useNavigate();

  const resetCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaAnswer("");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      if (isRegister) {
        if (parseInt(captchaAnswer, 10) !== captchaNum1 + captchaNum2) {
          setError("La respuesta de seguridad (CAPTCHA) es incorrecta.");
          setLoading(false);
          resetCaptcha();
          return;
        }

        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/client?registered=1");
        return;
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/client");
      }
    } catch (err: any) {
      console.error(err);

      let errorMessage =
        "Fallo en la autenticación. Por favor, inténtelo de nuevo.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "El correo electrónico ya está registrado.";
      } else if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        errorMessage =
          "Credenciales inválidas. Correo o contraseña incorrectos.";
      } else if (err.code === "auth/weak-password") {
        errorMessage =
          "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
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
      setError("Por favor, ingresa tu correo electrónico para recuperar la contraseña.");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    try {
      await sendPasswordResetEmail(auth, email);
      setNotice(
        "Se envió un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada o spam."
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-center py-12 px-6 relative">
      <div className="absolute top-6 left-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm font-medium text-zinc-400 hover:text-white inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-11 h-11 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center">
            <Shield className="w-6 h-6 stroke-[2.25]" />
          </div>
        </div>
        <h1 className="mt-6 text-center font-display text-3xl font-bold tracking-tight text-white">
          Onyx CMS
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          {isRegister
            ? "Crea tu cuenta para solicitar activación de licencia PRO o Reseller"
            : "Portal de Licencias PRO · Versión 4.1.2"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="onyx-card p-8 flex flex-col gap-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/25 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-300 leading-relaxed">{error}</p>
            </div>
          )}

          {notice && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-300 leading-relaxed">{notice}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@tuservidor.com"
                className="w-full bg-[#070709] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#070709] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {isRegister && (
              <div className="bg-[#070709] p-4 rounded-lg border border-white/[0.08] mt-1">
                <label className="text-xs font-medium text-zinc-400 mb-2.5 block">
                  Verificación de seguridad
                </label>
                <div className="flex items-center gap-3">
                  <div className="bg-[#121218] px-4 py-2 rounded-lg border border-white/10 text-amber-400 font-mono text-base font-semibold select-none tabular-nums whitespace-nowrap">
                    {captchaNum1} + {captchaNum2} = ?
                  </div>
                  <input
                    type="number"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    required
                    placeholder="Resultado"
                    className="w-full bg-[#0e0e13] border border-white/10 rounded-lg px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 onyx-btn text-sm font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading
                ? "Procesando..."
                : isRegister
                  ? "Crear cuenta"
                  : "Iniciar sesión"}
            </button>
          </form>

          {!isRegister && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <div className="text-center border-t border-white/[0.08] pt-5">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setNotice("");
              }}
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              {isRegister
                ? "Ya tengo una cuenta · Iniciar sesión"
                : "¿Aún no tienes cuenta? Regístrate gratis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
