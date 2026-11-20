import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
  addDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { format } from "date-fns";
import {
  Shield,
  LogOut,
  Copy,
  Check,
  Edit2,
  Globe,
  XCircle,
  History,
  RefreshCw,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

interface License {
  id: string;
  key: string;
  email: string;
  domain: string;
  status: string;
  type: string;
  createdAt: any;
  expiresAt?: any;
  createdBy?: string;
  maxClients?: number;
}

interface LicenseLog {
  id: string;
  email: string;
  licenseId: string;
  action: string;
  oldDomain?: string;
  newDomain?: string;
  timestamp: any;
}

export default function Client() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [logs, setLogs] = useState<LicenseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingLicenseId, setEditingLicenseId] = useState<string | null>(null);
  const [deletingLicenseId, setDeletingLicenseId] = useState<string | null>(null);
  const [regeneratingLicenseId, setRegeneratingLicenseId] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("584242770219");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Reseller states
  const [generating, setGenerating] = useState(false);
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientDomain, setNewClientDomain] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback((curr) => (curr?.text === text ? null : curr));
    }, 4500);
  };

  useEffect(() => {
    let unsubscribeAuth: () => void;
    let unsubscribeLicenses: () => void;
    let unsubscribeLogs: () => void;

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === "brayan782@gmail.com") {
          navigate("/admin");
        } else {
          fetchSettings();

          setLoading(true);
          const userEmail = user.email?.toLowerCase().trim() || "";
          const qLicenses = query(collection(db, "licenses"));

          unsubscribeLicenses = onSnapshot(
            qLicenses,
            (snapshot) => {
              const allData = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              })) as License[];
              const data = allData.filter(
                (l) => l.email === userEmail || l.createdBy === userEmail
              );
              data.sort((a, b) => {
                const timeA = a.createdAt?.seconds || a.createdAt?._seconds || 0;
                const timeB = b.createdAt?.seconds || b.createdAt?._seconds || 0;
                return timeB - timeA;
              });
              setLicenses(data);
              setLoading(false);
            },
            (error) => {
              console.error("Error fetching licenses in realtime:", error);
              showFeedback("error", "Error cargando licencias: " + error.message);
              setLoading(false);
            }
          );

          const logsQuery = query(
            collection(db, "license_logs"),
            where("email", "==", userEmail)
          );
          unsubscribeLogs = onSnapshot(
            logsQuery,
            (snapshot) => {
              const data = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              })) as LicenseLog[];
              data.sort((a, b) => {
                const timeA = a.timestamp?.seconds || a.timestamp?._seconds || 0;
                const timeB = b.timestamp?.seconds || b.timestamp?._seconds || 0;
                return timeB - timeA;
              });
              setLogs(data);
            },
            (error) => {
              console.error("Error fetching logs in realtime:", error);
            }
          );
        }
      } else {
        navigate("/login");
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeLicenses) unsubscribeLicenses();
      if (unsubscribeLogs) unsubscribeLogs();
    };
  }, [navigate]);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "cms");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDownloadUrl(docSnap.data().downloadUrl || "");
        if (docSnap.data().whatsappNumber) {
          setWhatsappNumber(docSnap.data().whatsappNumber);
        }
      }
    } catch (e: any) {
      if (e.message && e.message.includes("offline")) {
        console.warn("Network offline, could not fetch settings.");
      } else {
        console.error("Error fetching settings:", e);
      }
    }
  };

  const generateLicenseKey = () => {
    const parts = [];
    for (let i = 0; i < 3; i++) {
      parts.push(Math.random().toString(16).substring(2, 6).toUpperCase());
    }
    return `ONYX-${parts.join("-")}`;
  };

  const isReseller = licenses.some(
    (l) => l.type === "reseller" && l.email === auth.currentUser?.email
  );
  const maxResellerClients = licenses
    .filter((l) => l.type === "reseller" && l.email === auth.currentUser?.email)
    .reduce((sum, l) => sum + (l.maxClients || 5), 0);
  const usedClients = licenses.filter(
    (l) => l.createdBy === auth.currentUser?.email
  ).length;

  const cleanWhatsapp = whatsappNumber.replace(/[^\d]/g, "") || "584242770219";
  const currentUserEmail = auth.currentUser?.email || "";
  const proWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hola, me acabo de registrar en Onyx CMS v4.1.2 con el correo ${currentUserEmail} y quiero adquirir y activar la Licencia PRO Vitalicia ($200).`
  )}`;
  const resellerWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hola, me registré en Onyx CMS v4.1.2 con el correo ${currentUserEmail} y estoy interesado en activar el Plan Reseller.`
  )}`;

  const handleGenerateResellerLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usedClients >= maxResellerClients) {
      return;
    }

    setGenerating(true);
    try {
      if (!auth.currentUser?.email) return;
      const licenseKey = generateLicenseKey();
      const normalizedEmail = newClientEmail.toLowerCase().trim();
      const creatorEmail = auth.currentUser.email.toLowerCase();

      if (normalizedEmail && licenses.some((l) => l.email === normalizedEmail)) {
        showFeedback(
          "error",
          "Este correo electrónico ya tiene una licencia registrada."
        );
        setGenerating(false);
        return;
      }

      const newLicense = {
        key: licenseKey,
        email: normalizedEmail,
        domain: newClientDomain.trim(),
        type: "reseller",
        status: "active",
        createdBy: creatorEmail,
        createdAt: serverTimestamp(),
      };

      const newDocRef = doc(collection(db, "licenses"));
      await setDoc(newDocRef, newLicense);

      await addDoc(collection(db, "license_logs"), {
        email: creatorEmail,
        licenseId: newDocRef.id,
        action: "created_by_reseller",
        newDomain: newClientDomain.trim(),
        timestamp: serverTimestamp(),
      });

      setNewClientEmail("");
      setNewClientDomain("");
      showFeedback("success", "Licencia para cliente generada correctamente.");
    } catch (error: any) {
      console.error("Error creating reseller license:", error);
      showFeedback("error", "Error: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateDomain = async (id: string) => {
    if (!newDomain.trim()) return;
    try {
      const currentLicense = licenses.find((l) => l.id === id);
      const oldDomain = currentLicense?.domain || "";
      const cleanDomain = newDomain.trim();

      await updateDoc(doc(db, "licenses", id), {
        domain: cleanDomain,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "license_logs"), {
        email: auth.currentUser?.email,
        licenseId: id,
        action: "domain_updated",
        oldDomain: oldDomain,
        newDomain: cleanDomain,
        timestamp: serverTimestamp(),
      });

      setEditingLicenseId(null);
      setNewDomain("");
      showFeedback("success", `Dominio actualizado a ${cleanDomain}.`);
    } catch (error: any) {
      console.error("Error updating domain:", error);
      showFeedback("error", "Error actualizando dominio: " + error.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "revoked" : "active";
      await updateDoc(doc(db, "licenses", id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "license_logs"), {
        email: auth.currentUser?.email,
        licenseId: id,
        action: "status_updated",
        timestamp: serverTimestamp(),
      });
      showFeedback(
        "success",
        newStatus === "active" ? "Licencia activada." : "Licencia revocada."
      );
    } catch (error: any) {
      console.error("Error toggling status:", error);
      showFeedback("error", "Error: " + error.message);
    }
  };

  const handleDeleteLicense = async (id: string, email: string) => {
    try {
      if (!auth.currentUser) return;
      if (email === auth.currentUser.email) {
        showFeedback(
          "error",
          "No puedes eliminar tu propia cuenta principal de reseller."
        );
        return;
      }

      if (deletingLicenseId !== id) {
        setDeletingLicenseId(id);
        setTimeout(() => {
          setDeletingLicenseId((current) => (current === id ? null : current));
        }, 3500);
        return;
      }

      await deleteDoc(doc(db, "licenses", id));
      setDeletingLicenseId(null);

      await addDoc(collection(db, "license_logs"), {
        email: email,
        licenseId: id,
        action: "license_deleted",
        timestamp: serverTimestamp(),
      });
      showFeedback("success", "Licencia eliminada correctamente.");
    } catch (error: any) {
      console.error("Error deleting license:", error);
      showFeedback("error", "Error: " + error.message);
    }
  };

  const handleRegenerateKey = async (id: string) => {
    if (regeneratingLicenseId !== id) {
      setRegeneratingLicenseId(id);
      setTimeout(() => {
        setRegeneratingLicenseId((curr) => (curr === id ? null : curr));
      }, 4000);
      return;
    }

    try {
      if (!auth.currentUser?.email) return;
      const newKey = generateLicenseKey();

      await updateDoc(doc(db, "licenses", id), {
        key: newKey,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "license_logs"), {
        email: auth.currentUser?.email,
        licenseId: id,
        action: "key_regenerated",
        timestamp: serverTimestamp(),
      });
      setRegeneratingLicenseId(null);
      showFeedback(
        "success",
        "Clave regenerada. Recuerda actualizarla en tu Panel Admin de Onyx CMS."
      );
    } catch (error: any) {
      console.error("Error regenerating key:", error);
      showFeedback("error", "Error al regenerar clave.");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeLicenses = licenses.filter((l) => l.status === "active").length;

  return (
    <div className="min-h-screen w-full bg-[#070709] text-zinc-100 flex flex-col">
      <header className="border-b border-white/[0.08] bg-[#0a0a0e]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            <span className="w-7 h-7 rounded-md bg-amber-500 text-zinc-950 inline-flex items-center justify-center">
              <Shield className="w-4 h-4 stroke-[2.25]" />
            </span>
            <span>Onyx CMS</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <span>{isReseller ? "Portal Reseller" : "Área de Cliente"}</span>
            <span aria-hidden="true">·</span>
            <span>v4.1.2</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-300">{auth.currentUser?.email}</span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors whitespace-nowrap shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {feedback && (
          <div className="lg:col-span-12">
            <div
              className={`rounded-lg border px-4 py-3 text-sm flex items-center gap-3 ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/25 text-rose-300"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          </div>
        )}

        {/* Left Sidebar */}
        <aside className="lg:col-span-3 flex flex-col gap-5">
          <div className="onyx-card p-6">
            <h2 className="text-xs font-semibold text-zinc-400 mb-5">
              Resumen de licencias
            </h2>
            <div className="space-y-5">
              <div>
                <div className="font-mono text-3xl font-semibold text-white tabular-nums">
                  {licenses.length}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Licencias registradas</div>
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <div className="font-mono text-3xl font-semibold text-amber-400 tabular-nums">
                  {activeLicenses}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Despliegues activos</div>
              </div>

              {isReseller && (
                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-zinc-400">Cupos Reseller</span>
                    <span className="font-mono text-amber-400 tabular-nums">
                      {usedClients} / {maxResellerClients}
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (usedClients / Math.max(1, maxResellerClients)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {downloadUrl && (
            <div className="onyx-card p-6">
              <h2 className="text-sm font-semibold text-white mb-1.5">
                Onyx CMS v4.1.2
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Descarga el paquete oficial empaquetado listo para Node.js 18–24+.
              </p>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full onyx-btn px-4 py-2.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Descargar paquete (.ZIP)
              </a>
            </div>
          )}

          {isReseller && usedClients < maxResellerClients && (
            <div className="onyx-card p-6">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Emitir licencia de cliente
              </h2>
              <form
                onSubmit={handleGenerateResellerLicense}
                className="flex flex-col gap-3"
              >
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    Dominio o IP
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="miserver.com"
                    value={newClientDomain}
                    onChange={(e) => setNewClientDomain(e.target.value)}
                    className="w-full bg-[#070709] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    Correo del cliente (opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="cliente@correo.com"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full bg-[#070709] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={generating}
                  className="mt-1 onyx-btn w-full px-3 py-2.5 rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {generating ? "Generando..." : "Crear licencia PRO"}
                </button>
              </form>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-9 flex flex-col gap-6 min-w-0">
          {loading ? (
            <div className="onyx-card p-12 text-center text-sm text-zinc-400">
              Cargando licencias...
            </div>
          ) : licenses.length === 0 ? (
            <div className="onyx-card p-10 sm:p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mb-5">
                <MessageCircle className="w-6 h-6 text-amber-400" />
              </div>

              {justRegistered && (
                <p className="text-xs font-semibold text-emerald-400 mb-2">
                  Cuenta registrada correctamente
                </p>
              )}

              <h2 className="font-display text-2xl font-bold text-white mb-3">
                Tu cuenta aún no tiene un plan PRO activo
              </h2>
              <p className="text-sm text-zinc-400 mb-8 max-w-lg leading-relaxed">
                Las licencias <strong className="text-zinc-200">PRO Vitalicia ($200)</strong> y{" "}
                <strong className="text-zinc-200">Reseller</strong> son activadas
                manualmente por el administrador tras confirmar tu solicitud. Contáctanos
                por WhatsApp con tu correo registrado (
                <span className="font-mono text-zinc-200">{currentUserEmail}</span>) para
                activar tu licencia.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                <a
                  href={proWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 onyx-btn px-5 py-3 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  Adquirir PRO ($200)
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={resellerWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-lg text-sm font-semibold text-zinc-100 bg-white/[0.05] border border-white/12 hover:bg-white/[0.1] transition-colors inline-flex items-center justify-center whitespace-nowrap"
                >
                  Consultar Reseller
                </a>
              </div>
            </div>
          ) : (
            <div className="onyx-card overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-white">
                  Tus licencias registradas
                </h2>
                <span className="text-xs text-zinc-500 font-mono tabular-nums">
                  {licenses.length} en total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400 min-w-[680px]">
                  <thead className="text-xs bg-[#111118] text-zinc-400 border-b border-white/[0.08]">
                    <tr>
                      <th className="px-6 py-3.5 font-medium">Clave y dominio</th>
                      <th className="px-6 py-3.5 font-medium">Titular</th>
                      <th className="px-6 py-3.5 font-medium">Edición</th>
                      <th className="px-6 py-3.5 font-medium">Fechas</th>
                      <th className="px-6 py-3.5 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {licenses.map((license) => (
                      <tr
                        key={license.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-amber-400 font-medium">
                                {license.key}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(license.key)}
                                title="Copiar clave"
                                className="text-zinc-500 hover:text-white transition-colors"
                              >
                                {copiedKey === license.key ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            {editingLicenseId === license.id ? (
                              <div className="flex items-center gap-2 mt-1">
                                <input
                                  type="text"
                                  value={newDomain}
                                  onChange={(e) => setNewDomain(e.target.value)}
                                  className="bg-[#070709] border border-amber-500/60 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDomain(license.id)}
                                  aria-label="Guardar dominio"
                                  className="text-emerald-400 hover:text-emerald-300"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingLicenseId(null)}
                                  aria-label="Cancelar edición"
                                  className="text-zinc-500 hover:text-zinc-300"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-400 inline-flex items-center gap-1.5">
                                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                                  {license.domain}
                                </span>
                                {license.status === "active" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingLicenseId(license.id);
                                      setNewDomain(license.domain);
                                    }}
                                    title="Cambiar dominio"
                                    className="text-zinc-500 hover:text-amber-400 transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs text-zinc-300">
                          {license.email || "Sin correo"}
                        </td>

                        <td className="px-6 py-4 text-xs font-medium">
                          <span
                            className={
                              license.type === "trial"
                                ? "text-amber-400"
                                : license.type === "reseller"
                                  ? "text-zinc-200"
                                  : "text-emerald-400"
                            }
                          >
                            {license.type === "trial"
                              ? "Prueba PRO (10 días)"
                              : license.type === "standard"
                                ? "PRO Estándar"
                                : license.type === "reseller"
                                  ? "PRO Reseller"
                                  : "PRO Ilimitada"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs text-zinc-400 whitespace-nowrap font-mono tabular-nums">
                          <div className="flex flex-col gap-1">
                            <span>
                              Alta:{" "}
                              {license.createdAt?.seconds ||
                              license.createdAt?._seconds
                                ? format(
                                    new Date(
                                      (license.createdAt.seconds ||
                                        license.createdAt._seconds) * 1000
                                    ),
                                    "dd/MM/yyyy"
                                  )
                                : "..."}
                            </span>
                            {license.type === "trial" && license.expiresAt && (
                              <span className="text-amber-400">
                                Expira:{" "}
                                {license.expiresAt?.seconds ||
                                license.expiresAt?._seconds
                                  ? format(
                                      new Date(
                                        (license.expiresAt.seconds ||
                                          license.expiresAt._seconds) * 1000
                                      ),
                                      "dd/MM/yyyy"
                                    )
                                  : "..."}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {license.status === "active" ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRegenerateKey(license.id)}
                                  className={`px-2.5 py-1.5 rounded-md border text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                                    regeneratingLicenseId === license.id
                                      ? "bg-amber-500 text-zinc-950 border-amber-500"
                                      : "bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.08]"
                                  }`}
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  {regeneratingLicenseId === license.id
                                    ? "Confirmar"
                                    : "Regenerar"}
                                </button>

                                {isReseller &&
                                  license.createdBy === auth.currentUser?.email &&
                                  license.email !== auth.currentUser?.email && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleToggleStatus(
                                            license.id,
                                            license.status
                                          )
                                        }
                                        className="px-2.5 py-1.5 bg-rose-500/10 text-rose-300 border border-rose-500/25 rounded-md hover:bg-rose-500/20 transition-colors text-xs font-medium"
                                      >
                                        Revocar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteLicense(
                                            license.id,
                                            license.email
                                          )
                                        }
                                        title={
                                          deletingLicenseId === license.id
                                            ? "Clic de nuevo para eliminar"
                                            : "Eliminar"
                                        }
                                        className={`p-1.5 rounded-md transition-colors ${
                                          deletingLicenseId === license.id
                                            ? "bg-rose-500 text-white"
                                            : "bg-white/[0.04] text-zinc-400 hover:bg-rose-500/15 hover:text-rose-400"
                                        }`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                              </>
                            ) : (
                              <>
                                <span className="text-rose-400 text-xs font-medium inline-flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Revocada
                                </span>
                                {isReseller &&
                                  license.createdBy === auth.currentUser?.email &&
                                  license.email !== auth.currentUser?.email && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleToggleStatus(
                                            license.id,
                                            license.status
                                          )
                                        }
                                        className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 rounded-md hover:bg-emerald-500/20 transition-colors text-xs font-medium"
                                      >
                                        Activar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteLicense(
                                            license.id,
                                            license.email
                                          )
                                        }
                                        title={
                                          deletingLicenseId === license.id
                                            ? "Clic de nuevo para eliminar"
                                            : "Eliminar"
                                        }
                                        className={`p-1.5 rounded-md transition-colors ${
                                          deletingLicenseId === license.id
                                            ? "bg-rose-500 text-white"
                                            : "bg-white/[0.04] text-zinc-400 hover:bg-rose-500/15 hover:text-rose-400"
                                        }`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <div className="onyx-card overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <h2 className="font-display text-base font-bold text-white">
                  Historial de actividad
                </h2>
              </div>
              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left text-sm text-zinc-400 min-w-[540px]">
                  <thead className="text-xs bg-[#111118] text-zinc-400 sticky top-0 border-b border-white/[0.08]">
                    <tr>
                      <th className="px-6 py-3 font-medium">Acción</th>
                      <th className="px-6 py-3 font-medium">Detalles</th>
                      <th className="px-6 py-3 font-medium">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {logs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-3.5 text-xs font-medium">
                          {log.action === "created" ? (
                            <span className="text-emerald-400">Licencia generada</span>
                          ) : log.action === "created_by_reseller" ? (
                            <span className="text-amber-300">Licencia reseller</span>
                          ) : log.action === "key_regenerated" ? (
                            <span className="text-rose-400">Clave regenerada</span>
                          ) : log.action === "status_updated" ? (
                            <span className="text-amber-400">Estado cambiado</span>
                          ) : (
                            <span className="text-zinc-200">Dominio actualizado</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-xs text-zinc-400">
                          {log.action === "created" ? (
                            <span>
                              Dominio <span className="text-white">{log.newDomain}</span>
                            </span>
                          ) : log.action === "created_by_reseller" ? (
                            <span>
                              Generada para{" "}
                              <span className="text-white">{log.newDomain}</span>
                            </span>
                          ) : log.action === "key_regenerated" ? (
                            <span>Nueva clave emitida por seguridad</span>
                          ) : log.action === "status_updated" ? (
                            <span>Se actualizó el estado de la licencia</span>
                          ) : (
                            <span>
                              Cambio de{" "}
                              <span className="text-zinc-500 line-through">
                                {log.oldDomain}
                              </span>{" "}
                              a <span className="text-white">{log.newDomain}</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-xs font-mono tabular-nums whitespace-nowrap">
                          {log.timestamp?.seconds || log.timestamp?._seconds
                            ? format(
                                new Date(
                                  (log.timestamp.seconds ||
                                    log.timestamp._seconds) * 1000
                                ),
                                "dd/MM/yyyy HH:mm"
                              )
                            : "Justo ahora"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
