import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
  addDoc,
  onSnapshot,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import { format } from "date-fns";
import {
  Shield,
  LogOut,
  XCircle,
  Copy,
  Check,
  History,
  Trash2,
  Globe,
  Edit2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface License {
  id: string;
  key: string;
  email: string;
  domain: string;
  status: string;
  type: string;
  maxClients?: number;
  currentClients?: number;
  createdAt: any;
  expiresAt?: any;
  createdBy?: string;
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

export default function Admin() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [logs, setLogs] = useState<LicenseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("unlimited");
  const [deletingLicenseId, setDeletingLicenseId] = useState<string | null>(null);
  const [maxClients, setMaxClients] = useState<number>(10);
  const [showResellerClients, setShowResellerClients] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("584242770219");
  const [savingUrl, setSavingUrl] = useState(false);
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [newDomainForEdit, setNewDomainForEdit] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const navigate = useNavigate();

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
        fetchSettings();

        setLoading(true);
        const qLicenses = query(collection(db, "licenses"));
        unsubscribeLicenses = onSnapshot(
          qLicenses,
          (snapshot) => {
            const data = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as License[];
            data.sort((a, b) => {
              const timeA = a.createdAt?.seconds || a.createdAt?._seconds || 0;
              const timeB = b.createdAt?.seconds || b.createdAt?._seconds || 0;
              return timeB - timeA;
            });
            setLicenses(data);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching licenses:", error);
            showFeedback("error", "Error cargando licencias: " + error.message);
            setLoading(false);
          }
        );

        const qLogs = query(collection(db, "license_logs"));
        unsubscribeLogs = onSnapshot(
          qLogs,
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
            console.error("Error fetching logs:", error);
          }
        );
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
        setDemoUrl(docSnap.data().demoUrl || "");
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

  const handleSaveUrl = async () => {
    setSavingUrl(true);
    try {
      const sanitizedWhatsapp = whatsappNumber.replace(/[^\d]/g, "");
      await setDoc(
        doc(db, "settings", "cms"),
        {
          downloadUrl: downloadUrl.trim(),
          demoUrl: demoUrl.trim(),
          whatsappNumber: sanitizedWhatsapp,
        },
        { merge: true }
      );
      setWhatsappNumber(sanitizedWhatsapp);
      showFeedback("success", "Enlaces y WhatsApp actualizados correctamente.");
    } catch (e: any) {
      console.error("Error saving url", e);
      showFeedback("error", "No se pudo guardar la configuración.");
    } finally {
      setSavingUrl(false);
    }
  };

  const generateLicenseKey = () => {
    const parts = [];
    for (let i = 0; i < 3; i++) {
      parts.push(Math.random().toString(16).substring(2, 6).toUpperCase());
    }
    return `ONYX-${parts.join("-")}`;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      if (!auth.currentUser) return navigate("/");

      const licenseKey = generateLicenseKey();
      const normalizedEmail = email.toLowerCase().trim();
      const cleanDomain = domain.trim();

      if (licenses.some((l) => l.email === normalizedEmail)) {
        showFeedback(
          "error",
          "Este correo electrónico ya tiene una licencia registrada."
        );
        setGenerating(false);
        return;
      }

      const newLicense: any = {
        key: licenseKey,
        email: normalizedEmail,
        domain: cleanDomain,
        type,
        status: "active",
        createdAt: serverTimestamp(),
      };

      if (type === "reseller") {
        newLicense.maxClients = maxClients;
        newLicense.currentClients = 0;
      } else if (type === "trial") {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 10);
        newLicense.expiresAt = expiresAt;
      }

      const newDocRef = doc(collection(db, "licenses"));
      await setDoc(newDocRef, newLicense);

      await addDoc(collection(db, "license_logs"), {
        email: normalizedEmail,
        licenseId: newDocRef.id,
        action: "created",
        newDomain: cleanDomain,
        timestamp: serverTimestamp(),
      });

      setEmail("");
      setDomain("");
      showFeedback("success", `Licencia ${licenseKey} generada correctamente.`);
    } catch (error: any) {
      console.error("Error generating license:", error);
      showFeedback("error", "Error generando licencia: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: string,
    licenseEmail: string
  ) => {
    try {
      if (!auth.currentUser) return;

      const newStatus = currentStatus === "active" ? "revoked" : "active";
      await updateDoc(doc(db, "licenses", id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "license_logs"), {
        email: licenseEmail,
        licenseId: id,
        action: "status_updated",
        timestamp: serverTimestamp(),
      });
    } catch (error: any) {
      console.error("Error updating license status:", error);
      showFeedback("error", "Error: " + error.message);
    }
  };

  const handleUpdateDomain = async (id: string) => {
    if (!newDomainForEdit.trim()) return;
    try {
      const currentLicense = licenses.find((l) => l.id === id);
      const oldDomain = currentLicense?.domain || "";
      const cleanDomain = newDomainForEdit.trim();

      const licenseRef = doc(db, "licenses", id);
      await updateDoc(licenseRef, {
        domain: cleanDomain,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "license_logs"), {
        licenseId: id,
        email: currentLicense?.email || auth.currentUser?.email,
        action: "domain_updated",
        oldDomain: oldDomain,
        newDomain: cleanDomain,
        timestamp: serverTimestamp(),
      });

      setEditingDomainId(null);
      setNewDomainForEdit("");
      showFeedback("success", `Dominio actualizado a ${cleanDomain}.`);
    } catch (error: any) {
      console.error("Error updating domain:", error);
      showFeedback("error", "Error actualizando dominio: " + error.message);
    }
  };

  const handleDeleteLicense = async (id: string, licenseEmail: string) => {
    try {
      if (!auth.currentUser) return;

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
        email: licenseEmail,
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

  const handleUpdateType = async (id: string, newType: string) => {
    try {
      if (!auth.currentUser) return;

      const updateData: any = {
        type: newType,
        updatedAt: serverTimestamp(),
      };

      if (newType !== "trial") {
        updateData.expiresAt = deleteField();
      }

      await updateDoc(doc(db, "licenses", id), updateData);
    } catch (error: any) {
      console.error("Error updating license type:", error);
      showFeedback("error", "Error: " + error.message);
    }
  };

  const handleUpdateMaxClients = async (id: string, newMax: number) => {
    try {
      if (!auth.currentUser || isNaN(newMax) || newMax < 1) return;

      await updateDoc(doc(db, "licenses", id), {
        maxClients: newMax,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error("Error updating max clients:", error);
      showFeedback("error", "Error: " + error.message);
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

  const visibleLicenses = licenses.filter(
    (l) =>
      showResellerClients ||
      !l.createdBy ||
      l.createdBy === auth.currentUser?.email ||
      l.createdBy === l.email
  );

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
            <span>Servidor Maestro de Licencias</span>
            <span aria-hidden="true">·</span>
            <span>v4.1.2</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Operacional</span>
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
                <div className="text-xs text-zinc-400 mt-0.5">Licencias totales</div>
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <div className="font-mono text-3xl font-semibold text-amber-400 tabular-nums">
                  {licenses.filter((l) => l.status === "active").length}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Despliegues activos</div>
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <div className="font-mono text-3xl font-semibold text-rose-400 tabular-nums">
                  {licenses.filter((l) => l.status === "revoked").length}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Claves revocadas</div>
              </div>
            </div>
          </div>

          <div className="onyx-card p-6">
            <h2 className="text-sm font-semibold text-white mb-1">
              Enlaces y WhatsApp (v4.1.2)
            </h2>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Sincroniza la descarga FREE, el Demo en Vivo y tu número de WhatsApp para
              activar licencias.
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">
                  Número de WhatsApp (con código de país)
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="584242770219"
                  className="bg-[#070709] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500 transition-colors w-full"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">
                  Enlace de descarga (.ZIP)
                </label>
                <input
                  type="url"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://ejemplo.com/onyx-cms-4.1.2.zip"
                  className="bg-[#070709] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors w-full"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">
                  Enlace Demo en Vivo (opcional)
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://demo.onyxcms.com"
                  className="bg-[#070709] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors w-full"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveUrl}
                disabled={savingUrl}
                className="onyx-btn w-full px-3 py-2.5 rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                {savingUrl ? "Guardando..." : "Guardar configuración"}
              </button>
            </div>
          </div>

          <div className="onyx-card p-6">
            <h2 className="text-xs font-semibold text-zinc-400 mb-2">
              Endpoint de validación API
            </h2>
            <div className="p-3 bg-[#070709] rounded-lg border border-white/[0.08] font-mono text-[11px] text-amber-400 break-all">
              POST /api/master-license/validate
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Parámetros: license_key, domain
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-9 flex flex-col gap-6 min-w-0">
          {/* Create License Form */}
          <div className="onyx-card p-6">
            <h2 className="font-display text-lg font-bold text-white mb-5">
              Generar nueva licencia PRO
            </h2>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleGenerate}
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@tuservidor.com"
                  className="bg-[#070709] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">
                  Dominio o IP autorizado
                </label>
                <input
                  type="text"
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="miserver.com"
                  className="bg-[#070709] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div
                className={`flex flex-col gap-1.5 ${
                  type === "reseller" ? "md:col-span-1" : "md:col-span-2"
                }`}
              >
                <label className="text-xs font-medium text-zinc-400">
                  Nivel de licencia
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-[#070709] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="unlimited">PRO Ilimitada (Vitalicia)</option>
                  <option value="trial">Prueba PRO (10 Días)</option>
                  <option value="standard">PRO Estándar</option>
                  <option value="reseller">Plan Reseller</option>
                </select>
              </div>
              {type === "reseller" && (
                <div className="flex flex-col gap-1.5 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-400">
                    Límite de clientes
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={maxClients}
                    onChange={(e) => setMaxClients(parseInt(e.target.value, 10))}
                    className="bg-[#070709] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              )}
              <div className="md:col-span-2 pt-1">
                <button
                  disabled={generating}
                  type="submit"
                  className="w-full onyx-btn text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50"
                >
                  {generating ? "Generando clave..." : "Crear clave ONYX PRO"}
                </button>
              </div>
            </form>
          </div>

          {/* Licenses Table */}
          <div className="onyx-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex flex-wrap justify-between items-center gap-4">
              <h2 className="font-display text-base font-bold text-white">
                Licencias emitidas
              </h2>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <span className="text-xs text-zinc-400">
                  Mostrar clientes de Resellers
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={showResellerClients}
                  onChange={(e) => setShowResellerClients(e.target.checked)}
                />
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative ${
                    showResellerClients ? "bg-amber-500" : "bg-zinc-700"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform ${
                      showResellerClients ? "translate-x-[19px]" : "translate-x-[3px]"
                    }`}
                  />
                </div>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="text-xs text-zinc-400 bg-[#111118] border-b border-white/[0.08]">
                  <tr>
                    <th className="px-6 py-3.5 font-medium">Clave de licencia</th>
                    <th className="px-6 py-3.5 font-medium">Cliente y dominio</th>
                    <th className="px-6 py-3.5 font-medium">Fechas</th>
                    <th className="px-6 py-3.5 font-medium text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {visibleLicenses.map((license) => (
                    <tr
                      key={license.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td
                        className={`px-6 py-4 font-mono ${
                          license.status === "active"
                            ? "text-amber-400"
                            : "text-zinc-500 line-through"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{license.key}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(license.key)}
                            className="text-zinc-500 hover:text-white transition-colors"
                            title="Copiar clave"
                          >
                            {copiedKey === license.key ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div
                          className={`text-sm font-medium ${
                            license.status === "active"
                              ? "text-zinc-200"
                              : "text-zinc-500"
                          }`}
                        >
                          {license.email || "Sin correo"}
                        </div>
                        <div className="flex flex-col gap-1.5 mt-1 items-start">
                          {editingDomainId === license.id ? (
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="text"
                                value={newDomainForEdit}
                                onChange={(e) => setNewDomainForEdit(e.target.value)}
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
                                onClick={() => setEditingDomainId(null)}
                                aria-label="Cancelar edición"
                                className="text-zinc-500 hover:text-zinc-300"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group">
                              <span className="text-xs text-zinc-400 inline-flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                                {license.domain}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDomainId(license.id);
                                  setNewDomainForEdit(license.domain);
                                }}
                                title="Editar dominio"
                                className="text-zinc-500 hover:text-amber-400 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-1">
                            <select
                              value={license.type}
                              onChange={(e) =>
                                handleUpdateType(license.id, e.target.value)
                              }
                              className="bg-[#070709] border border-white/10 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                            >
                              <option value="trial" className="bg-[#0e0e13]">
                                Prueba PRO
                              </option>
                              <option value="standard" className="bg-[#0e0e13]">
                                PRO Estándar
                              </option>
                              <option value="unlimited" className="bg-[#0e0e13]">
                                PRO Ilimitada
                              </option>
                              <option value="reseller" className="bg-[#0e0e13]">
                                Reseller
                              </option>
                            </select>

                            {license.type === "reseller" && (
                              <input
                                type="number"
                                min="1"
                                defaultValue={license.maxClients || 5}
                                onBlur={(e) =>
                                  handleUpdateMaxClients(
                                    license.id,
                                    parseInt(e.target.value, 10)
                                  )
                                }
                                className="w-16 bg-[#070709] border border-white/10 rounded px-2 py-1 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                                title="Límite de clientes"
                              />
                            )}
                          </div>
                        </div>
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

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(
                                license.id,
                                license.status,
                                license.email
                              )
                            }
                            title={
                              license.status === "active"
                                ? "Clic para revocar"
                                : "Clic para reactivar"
                            }
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap ${
                              license.status === "active"
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/25"
                                : "bg-rose-500/10 text-rose-300 border-rose-500/25 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/25"
                            }`}
                          >
                            {license.status === "active" ? "Activa" : "Revocada"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteLicense(license.id, license.email)
                            }
                            title={
                              deletingLicenseId === license.id
                                ? "Clic de nuevo para confirmar eliminación"
                                : "Eliminar licencia"
                            }
                            className={`p-1.5 rounded-md transition-colors ${
                              deletingLicenseId === license.id
                                ? "bg-rose-500 text-white"
                                : "bg-white/[0.04] text-zinc-400 hover:bg-rose-500/15 hover:text-rose-400"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleLicenses.length === 0 && !loading && (
                <div className="p-8 text-center text-sm text-zinc-500">
                  Aún no se han generado licencias.
                </div>
              )}
              {loading && (
                <div className="p-8 text-center text-sm text-zinc-500">
                  Cargando licencias...
                </div>
              )}
            </div>
          </div>

          {/* Audit Logs */}
          {logs.length > 0 && (
            <div className="onyx-card overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <h2 className="font-display text-base font-bold text-white">
                  Registro de actividad global (Auditoría)
                </h2>
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left text-sm text-zinc-400 min-w-[640px]">
                  <thead className="text-xs bg-[#111118] text-zinc-400 sticky top-0 border-b border-white/[0.08]">
                    <tr>
                      <th className="px-6 py-3 font-medium">Usuario / Reseller</th>
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
                        <td className="px-6 py-3.5 text-xs font-medium text-zinc-300">
                          {log.email}
                        </td>
                        <td className="px-6 py-3.5 text-xs font-medium">
                          {log.action === "created" ? (
                            <span className="text-emerald-400">Licencia maestra</span>
                          ) : log.action === "created_by_reseller" ? (
                            <span className="text-amber-300">Licencia cliente</span>
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
                              Para el dominio{" "}
                              <span className="text-white">{log.newDomain}</span>
                            </span>
                          ) : log.action === "created_by_reseller" ? (
                            <span>
                              Generada para{" "}
                              <span className="text-white">{log.newDomain}</span>
                            </span>
                          ) : log.action === "key_regenerated" ? (
                            <span>Nueva clave generada por seguridad</span>
                          ) : log.action === "status_updated" ? (
                            <span>El estado de la licencia cambió</span>
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
