import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs, setDoc, updateDoc, doc, serverTimestamp, getDoc, addDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { 
  Key, Shield, LogOut, Plus, Search, 
  CheckCircle2, XCircle, Copy, Check, History
} from 'lucide-react';

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
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [type, setType] = useState('trial');
  const [maxClients, setMaxClients] = useState<number>(10);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [savingUrl, setSavingUrl] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchLicenses();
        fetchLogs();
        fetchSettings();
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'cms');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDownloadUrl(docSnap.data().downloadUrl || '');
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    }
  };

  const handleSaveUrl = async () => {
    setSavingUrl(true);
    try {
      await setDoc(doc(db, 'settings', 'cms'), {
        downloadUrl
      }, { merge: true });
    } catch (e) {
      console.error('Error saving url', e);
    } finally {
      setSavingUrl(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const q = query(collection(db, 'license_logs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LicenseLog[];
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'licenses'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as License[];
      setLicenses(data);
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLicenseKey = () => {
    const parts = [];
    for (let i = 0; i < 3; i++) {
      parts.push(Math.random().toString(16).substring(2, 6).toUpperCase());
    }
    return `ONYX-${parts.join('-')}`;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      if (!auth.currentUser) return navigate('/');

      const licenseKey = generateLicenseKey();
      const newLicense: any = {
        key: licenseKey,
        email,
        domain,
        type,
        status: 'active',
        createdAt: serverTimestamp(),
      };
      
      if (type === 'reseller') {
        newLicense.maxClients = maxClients;
        newLicense.currentClients = 0;
      } else if (type === 'trial') {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 10);
        newLicense.expiresAt = expiresAt;
      }

      const newDocRef = doc(collection(db, 'licenses'));
      await setDoc(newDocRef, newLicense);
      
      await addDoc(collection(db, 'license_logs'), {
        email: email,
        licenseId: newDocRef.id,
        action: 'created',
        newDomain: domain,
        timestamp: serverTimestamp()
      });

      setEmail('');
      setDomain('');
      fetchLicenses();
      fetchLogs();
    } catch (error) {
      console.error('Error generating license:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string, email: string) => {
    try {
      if (!auth.currentUser) return;

      const newStatus = currentStatus === 'active' ? 'revoked' : 'active';
      await updateDoc(doc(db, 'licenses', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      await addDoc(collection(db, 'license_logs'), {
        email: email,
        licenseId: id,
        action: 'status_updated',
        timestamp: serverTimestamp()
      });

      fetchLicenses();
      fetchLogs();
    } catch (error) {
      console.error('Error updating license status:', error);
    }
  };

  const handleUpdateType = async (id: string, newType: string) => {
    try {
      if (!auth.currentUser) return;

      await updateDoc(doc(db, 'licenses', id), {
        type: newType,
        updatedAt: serverTimestamp()
      });
      fetchLicenses();
    } catch (error) {
      console.error('Error updating license type:', error);
    }
  };

  const handleUpdateMaxClients = async (id: string, maxClients: number) => {
    try {
      if (!auth.currentUser) return;
      
      await updateDoc(doc(db, 'licenses', id), {
        maxClients,
        updatedAt: serverTimestamp()
      });
      fetchLicenses();
    } catch (error) {
      console.error('Error updating max clients:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] p-6 gap-6">
      <header className="flex items-center justify-between pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,209,255,0.3)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Servidor Maestro <span className="font-light text-gray-400">ONYX</span></h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Gestión de Licencias v2.4.1</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 uppercase font-semibold">Estado del Servidor</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> Operacional
            </span>
          </div>
          <div className="h-8 w-px bg-white/10 mx-2"></div>
          <button 
            onClick={handleSignOut}
            title="Cerrar sesión"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <span className="text-xs font-bold">{auth.currentUser?.email?.substring(0, 2).toUpperCase() || 'AD'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        <section className="md:col-span-3 flex flex-col gap-4 overflow-y-auto">
          <div className="onyx-card p-4 shrink-0">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Estadísticas</h3>
            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="text-3xl font-light text-white">{licenses.length}</span>
                <span className="text-xs text-gray-500">Licencias Totales</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-light text-cyan-400">{licenses.filter(l => l.status === 'active').length}</span>
                <span className="text-xs text-gray-500">Despliegues Activos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-light text-rose-500">{licenses.filter(l => l.status === 'revoked').length}</span>
                <span className="text-xs text-gray-500">Claves Revocadas</span>
              </div>
            </div>
          </div>
          
          <div className="onyx-card p-4 shrink-0">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Enlace Descarga CMS</h3>
            <div className="flex flex-col gap-2">
              <input 
                type="url" 
                value={downloadUrl} 
                onChange={(e) => setDownloadUrl(e.target.value)} 
                placeholder="https://ejemplo.com/cms.zip" 
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors w-full" 
              />
              <button 
                onClick={handleSaveUrl}
                disabled={savingUrl}
                className="onyx-btn w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(0,209,255,0.15)] flex items-center justify-center"
              >
                {savingUrl ? 'Guardando...' : 'Guardar Enlace'}
              </button>
            </div>
          </div>

          <div className="onyx-card p-4 bg-gradient-to-br from-[#111] to-[#0A0A0B] shrink-0">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Endpoint API</h3>
            <div className="p-3 bg-black/40 rounded border border-white/5 font-mono text-[10px] text-cyan-400 break-all">POST /api/master-license/validate</div>
            <p className="text-[10px] text-gray-500 mt-2">Requerido: license_key, domain</p>
          </div>
        </section>

        <section className="md:col-span-9 flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="onyx-card p-6 border-l-4 border-l-cyan-500 shrink-0">
            <h2 className="text-lg font-semibold text-white mb-4">Generar Nueva Licencia Maestra</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleGenerate}>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-gray-400 uppercase">Correo Electrónico</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="cliente@agencia.com" 
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-gray-400 uppercase">Restricción de Dominio</label>
                <input 
                  type="text" 
                  required 
                  value={domain} 
                  onChange={(e) => setDomain(e.target.value)} 
                  placeholder="*.ejemplo.com" 
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" 
                />
              </div>
              <div className={`flex flex-col gap-1.5 ${type === 'reseller' ? 'md:col-span-1' : 'md:col-span-2'}`}>
                <label className="text-[11px] font-medium text-gray-400 uppercase">Nivel de Suscripción</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  className="bg-[#111114] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="trial">Prueba 10 Días</option>
                  <option value="standard">Estándar</option>
                  <option value="unlimited">Ilimitado</option>
                  <option value="reseller">Reseller</option>
                </select>
              </div>
              {type === 'reseller' && (
                <div className="flex flex-col gap-1.5 md:col-span-1">
                  <label className="text-[11px] font-medium text-gray-400 uppercase">Límite de Clientes</label>
                  <input 
                    type="number" 
                    min="1"
                    required 
                    value={maxClients} 
                    onChange={(e) => setMaxClients(parseInt(e.target.value))} 
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  />
                </div>
              )}
              <div className="flex items-end md:col-span-2">
                <button 
                  disabled={generating} 
                  type="submit" 
                  className="w-full onyx-btn text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-cyan-900/20 uppercase tracking-widest disabled:opacity-50"
                >
                  {generating ? 'Creando...' : 'Crear Clave ONYX'}
                </button>
              </div>
            </form>
          </div>

          <div className="onyx-card shrink-0 flex flex-col">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center shrink-0">
              <h3 className="text-sm font-semibold text-white">Licencias Recientes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-500 uppercase bg-white/[0.02] sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-3 font-medium">Clave de Licencia</th>
                    <th className="px-6 py-3 font-medium">Cliente / Dominio</th>
                    <th className="px-6 py-3 font-medium">Creada</th>
                    <th className="px-6 py-3 font-medium text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {licenses.map(license => (
                    <tr key={license.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className={`px-6 py-4 font-mono ${license.status === 'active' ? 'text-cyan-400' : 'text-gray-500 line-through'}`}>
                        <div className="flex items-center gap-2">
                          {license.key}
                          <button 
                            onClick={() => copyToClipboard(license.key)} 
                            className="text-gray-500 hover:text-white transition-colors" 
                            title="Copy"
                          >
                            {copiedKey === license.key ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-medium ${license.status === 'active' ? 'text-gray-200' : 'text-gray-500'}`}>{license.email}</div>
                        <div className="flex flex-col gap-1 mt-1 items-start">
                          <span className="text-xs text-gray-500 italic">{license.domain}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <select
                              value={license.type}
                              onChange={(e) => handleUpdateType(license.id, e.target.value)}
                              className={`bg-black/40 border rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider focus:outline-none transition-colors ${
                                license.type === 'trial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 focus:border-amber-500' :
                                license.type === 'standard' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 focus:border-cyan-500' :
                                license.type === 'reseller' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 focus:border-purple-500' :
                                'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 focus:border-cyan-500'
                              }`}
                            >
                              <option value="trial" className="bg-[#111114] text-amber-400">Prueba</option>
                              <option value="standard" className="bg-[#111114] text-cyan-400">Estándar</option>
                              <option value="reseller" className="bg-[#111114] text-purple-400">Reseller</option>
                              <option value="unlimited" className="bg-[#111114] text-cyan-400">Ilimitado</option>
                            </select>
                            {license.type === 'reseller' && (
                              <input 
                                type="number" 
                                min="1"
                                defaultValue={license.maxClients || 5}
                                onBlur={(e) => handleUpdateMaxClients(license.id, parseInt(e.target.value))}
                                className="w-16 bg-black/40 border border-purple-500/20 rounded px-2 py-1 text-[10px] font-bold text-purple-400 focus:outline-none focus:border-purple-500"
                                title="Límite de Clientes"
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span>{(license.createdAt?.seconds || license.createdAt?._seconds) ? format(new Date((license.createdAt.seconds || license.createdAt._seconds) * 1000), 'MMM dd, yyyy') : '...'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {license.status === 'active' ? (
                          <button 
                            onClick={() => handleToggleStatus(license.id, license.status, license.email)} 
                            title="Clic para Revocar" 
                            className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all"
                          >
                            Activa
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleToggleStatus(license.id, license.status, license.email)} 
                            title="Clic para Reactivar" 
                            className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider border border-rose-500/20 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 transition-all"
                          >
                            Revocada
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {licenses.length === 0 && !loading && (
                <div className="p-8 text-center text-gray-500">Aún no se han generado licencias.</div>
              )}
              {loading && (
                <div className="p-8 text-center text-gray-500">Cargando licencias...</div>
              )}
            </div>
          </div>

          {logs.length > 0 && (
            <div className="onyx-card shrink-0 mt-4">
              <div className="p-4 border-b border-white/5">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-500" />
                  Registro de Actividad Global (Auditoría)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="text-xs uppercase bg-black/40 text-gray-500 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 font-medium">Usuario / Reseller</th>
                      <th className="px-6 py-3 font-medium">Acción</th>
                      <th className="px-6 py-3 font-medium">Detalles</th>
                      <th className="px-6 py-3 font-medium">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-300">
                          {log.email}
                        </td>
                        <td className="px-6 py-4">
                          {log.action === 'created' ? (
                            <span className="text-emerald-400 font-medium text-xs uppercase tracking-wider">Licencia Maestra</span>
                          ) : log.action === 'created_by_reseller' ? (
                            <span className="text-purple-400 font-medium text-xs uppercase tracking-wider">Licencia Cliente</span>
                          ) : log.action === 'key_regenerated' ? (
                            <span className="text-rose-400 font-medium text-xs uppercase tracking-wider">Clave Regenerada</span>
                          ) : log.action === 'status_updated' ? (
                            <span className="text-amber-400 font-medium text-xs uppercase tracking-wider">Estado Cambiado</span>
                          ) : (
                            <span className="text-cyan-400 font-medium text-xs uppercase tracking-wider">Dominio Actualizado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {log.action === 'created' ? (
                            <span>Para el dominio <span className="text-white">{log.newDomain}</span></span>
                          ) : log.action === 'created_by_reseller' ? (
                            <span>Generada para <span className="text-white">{log.newDomain}</span></span>
                          ) : log.action === 'key_regenerated' ? (
                            <span>Se generó una nueva clave por seguridad</span>
                          ) : log.action === 'status_updated' ? (
                            <span>El estado de la licencia cambió</span>
                          ) : (
                            <span>Cambio de <span className="text-gray-500 line-through">{log.oldDomain}</span> a <span className="text-white">{log.newDomain}</span></span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs whitespace-nowrap">
                          {(log.timestamp?.seconds || log.timestamp?._seconds) ? format(new Date((log.timestamp.seconds || log.timestamp._seconds) * 1000), 'dd MMM yyyy, HH:mm') : 'Justo ahora'}
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
