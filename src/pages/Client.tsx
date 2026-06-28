import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp, setDoc, getDoc, addDoc, onSnapshot, or } from 'firebase/firestore';
import { format } from 'date-fns';
import { 
  Key, Shield, LogOut, CheckCircle2, Copy, Check, Edit2, Globe, XCircle, History, RefreshCw, Plus, Users
} from 'lucide-react';

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
  const [newDomain, setNewDomain] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  
  // Reseller states
  const [generating, setGenerating] = useState(false);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientDomain, setNewClientDomain] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeAuth: () => void;
    let unsubscribeLicenses: () => void;
    let unsubscribeLogs: () => void;

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'brayan782@gmail.com') {
           navigate('/admin');
        } else {
           fetchSettings();
           
           // Real-time licenses
           setLoading(true);
           const userEmail = user.email?.toLowerCase() || '';
           const q1 = query(collection(db, 'licenses'), where('email', '==', userEmail));
           const q2 = query(collection(db, 'licenses'), where('createdBy', '==', userEmail));
           
           let licensesFromQ1: License[] = [];
           let licensesFromQ2: License[] = [];

           const updateMergedLicenses = () => {
             const allDocs = new Map();
             licensesFromQ1.forEach(l => allDocs.set(l.id, l));
             licensesFromQ2.forEach(l => allDocs.set(l.id, l));
             const data = Array.from(allDocs.values());
             data.sort((a, b) => {
               const timeA = a.createdAt?.seconds || a.createdAt?._seconds || 0;
               const timeB = b.createdAt?.seconds || b.createdAt?._seconds || 0;
               return timeB - timeA;
             });
             setLicenses(data);
             setLoading(false);
           };

           const unsub1 = onSnapshot(q1, (snapshot) => {
             licensesFromQ1 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as License[];
             updateMergedLicenses();
           }, (error) => {
             console.error('Error fetching licenses in realtime (q1):', error);
             setLoading(false);
           });

           const unsub2 = onSnapshot(q2, (snapshot) => {
             licensesFromQ2 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as License[];
             updateMergedLicenses();
           }, (error) => {
             console.error('Error fetching licenses in realtime (q2):', error);
             setLoading(false);
           });

           unsubscribeLicenses = () => {
             unsub1();
             unsub2();
           };

           // Real-time logs
           const logsQuery = query(collection(db, 'license_logs'), where('email', '==', userEmail));
           unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
             const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LicenseLog[];
             data.sort((a, b) => {
               const timeA = a.timestamp?.seconds || a.timestamp?._seconds || 0;
               const timeB = b.timestamp?.seconds || b.timestamp?._seconds || 0;
               return timeB - timeA;
             });
             setLogs(data);
           }, (error) => {
             console.error('Error fetching logs in realtime:', error);
           });
        }
      } else {
        navigate('/login');
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
      const docRef = doc(db, 'settings', 'cms');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDownloadUrl(docSnap.data().downloadUrl || '');
      }
    } catch (e: any) {
      if (e.message && e.message.includes('offline')) {
        console.warn('Network offline, could not fetch settings.');
      } else {
        console.error('Error fetching settings:', e);
      }
    }
  };

  const generateLicenseKey = () => {
    const parts = [];
    for (let i = 0; i < 3; i++) {
      parts.push(Math.random().toString(16).substring(2, 6).toUpperCase());
    }
    return `ONYX-${parts.join('-')}`;
  };

  const isReseller = licenses.some(l => l.type === 'reseller' && l.email === auth.currentUser?.email);
  const maxResellerClients = licenses
    .filter(l => l.type === 'reseller' && l.email === auth.currentUser?.email)
    .reduce((sum, l) => sum + (l.maxClients || 5), 0);
  const usedClients = licenses.filter(l => l.createdBy === auth.currentUser?.email).length;

  const handleCreateLicense = async () => {
    try {
      if (!auth.currentUser?.email) return;
      const licenseKey = generateLicenseKey();
      const normalizedEmail = auth.currentUser.email.toLowerCase();

      const newLicense = {
        key: licenseKey,
        email: normalizedEmail,
        domain: 'tusitio.com',
        type: 'standard',
        status: 'active',
        createdAt: serverTimestamp(),
      };

      const newDocRef = doc(collection(db, 'licenses'));
      await setDoc(newDocRef, newLicense);
      
      await addDoc(collection(db, 'license_logs'), {
        email: normalizedEmail,
        licenseId: newDocRef.id,
        action: 'created',
        newDomain: 'tusitio.com',
        timestamp: serverTimestamp()
      });

    } catch (error) {
      console.error('Error creating license:', error);
    }
  };

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

      const newLicense = {
        key: licenseKey,
        email: normalizedEmail,
        domain: newClientDomain,
        type: 'standard',
        status: 'active',
        createdBy: creatorEmail,
        createdAt: serverTimestamp(),
      };

      const newDocRef = doc(collection(db, 'licenses'));
      await setDoc(newDocRef, newLicense);
      
      await addDoc(collection(db, 'license_logs'), {
        email: creatorEmail,
        licenseId: newDocRef.id,
        action: 'created_by_reseller',
        newDomain: newClientDomain,
        timestamp: serverTimestamp()
      });

      setNewClientEmail('');
      setNewClientDomain('');
    } catch (error) {
      console.error('Error creating reseller license:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateDomain = async (id: string) => {
    if (!newDomain) return;
    try {
      const currentLicense = licenses.find(l => l.id === id);
      const oldDomain = currentLicense?.domain || '';

      await updateDoc(doc(db, 'licenses', id), {
        domain: newDomain,
        updatedAt: serverTimestamp()
      });

      await addDoc(collection(db, 'license_logs'), {
        email: auth.currentUser?.email,
        licenseId: id,
        action: 'domain_updated',
        oldDomain: oldDomain,
        newDomain: newDomain,
        timestamp: serverTimestamp()
      });

      setEditingLicenseId(null);
      setNewDomain('');
    } catch (error: any) {
      console.error('Error updating domain:', error);
      alert('Error updating domain: ' + error.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'revoked' : 'active';
      await updateDoc(doc(db, 'licenses', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      await addDoc(collection(db, 'license_logs'), {
        email: auth.currentUser?.email,
        licenseId: id,
        action: 'status_updated',
        timestamp: serverTimestamp()
      });

    } catch (error: any) {
      console.error('Error toggling status:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleRegenerateKey = async (id: string) => {
    try {
      if (!auth.currentUser?.email) return;
      const newKey = generateLicenseKey();
      
      await updateDoc(doc(db, 'licenses', id), {
        key: newKey,
        updatedAt: serverTimestamp()
      });

      await addDoc(collection(db, 'license_logs'), {
        email: auth.currentUser?.email,
        licenseId: id,
        action: 'key_regenerated',
        timestamp: serverTimestamp()
      });

    } catch (error) {
      console.error('Error regenerating key:', error);
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

  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  
  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] p-6 gap-6">
      <header className="flex items-center justify-between pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,209,255,0.3)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Panel de Cliente <span className="font-light text-gray-400">ONYX</span></h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{isReseller ? 'Portal Reseller' : 'Gestión de Licencias'}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={handleSignOut}
            title="Cerrar sesión"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <span className="text-xs font-bold">{auth.currentUser?.email?.substring(0, 2).toUpperCase() || 'US'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        {/* Left Sidebar */}
        <section className="md:col-span-3 flex flex-col gap-4 overflow-y-auto">
          {/* Stats Card */}
          <div className="onyx-card p-4 shrink-0">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Mis Licencias</h3>
            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="text-3xl font-light text-white">{licenses.length}</span>
                <span className="text-xs text-gray-500">Licencias Totales</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-light text-cyan-400">{activeLicenses}</span>
                <span className="text-xs text-gray-500">Despliegues Activos</span>
              </div>
              
              {isReseller && (
                <div className="flex flex-col pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cupos Reseller</span>
                    <span className="text-xs font-mono text-purple-400">{usedClients} / {maxResellerClients}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div 
                      className="bg-purple-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, (usedClients / maxResellerClients) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Download CMS */}
          {downloadUrl && (
            <div className="onyx-card p-4 shrink-0 border-l-2 border-l-emerald-500 bg-emerald-500/5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Archivos del Sistema</h3>
              <p className="text-xs text-gray-500 mb-4">Descarga la última versión de ONYX CMS.</p>
              <a 
                href={downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors block text-center"
              >
                Descargar .ZIP
              </a>
            </div>
          )}

          {/* Reseller Generator */}
          {isReseller && usedClients < maxResellerClients && (
            <div className="onyx-card p-4 shrink-0">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Vender Licencia
              </h3>
              <form onSubmit={handleGenerateResellerLicense} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500">Dominio</label>
                  <input 
                    type="text" 
                    required
                    value={newClientDomain}
                    onChange={(e) => setNewClientDomain(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={generating}
                  className="mt-2 onyx-btn w-full px-3 py-2 rounded text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(168,85,247,0.15)] disabled:opacity-50 !bg-gradient-to-r !from-purple-600 !to-fuchsia-600 hover:!from-purple-500 hover:!to-fuchsia-500"
                >
                  {generating ? 'Generando...' : 'Crear Licencia'}
                </button>
              </form>
            </div>
          )}
        </section>

        {/* Main Content Area */}
        <section className="md:col-span-9 flex flex-col gap-4 min-h-0 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Cargando...</p>
            </div>
          ) : licenses.length === 0 ? (
            <div className="onyx-card p-12 flex flex-col items-center justify-center text-center h-full">
              <Shield className="w-16 h-16 text-white/20 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No tienes licencias activas</h2>
              <p className="text-sm text-gray-400 mb-6 max-w-md">
                Comienza ahora generando tu licencia para tu proyecto.
              </p>
              <button onClick={handleCreateLicense} className="onyx-btn px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-900/20">
                Generar Mi Licencia
              </button>
            </div>
          ) : (
            <div className="onyx-card flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Tus Licencias Activas</h2>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="text-xs uppercase bg-black/40 text-gray-500 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 font-medium">Clave / Dominio</th>
                      <th className="px-6 py-3 font-medium">Email</th>
                      <th className="px-6 py-3 font-medium">Tipo</th>
                      <th className="px-6 py-3 font-medium">Fecha de Creación</th>
                      <th className="px-6 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {licenses.map(license => (
                      <tr key={license.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-cyan-400 font-medium">{license.key}</span>
                              <button 
                                onClick={() => copyToClipboard(license.key)} 
                                className="text-gray-500 hover:text-white transition-colors"
                              >
                                {copiedKey === license.key ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            
                            {editingLicenseId === license.id ? (
                              <div className="flex items-center gap-2 mt-1">
                                <input 
                                  type="text" 
                                  value={newDomain}
                                  onChange={(e) => setNewDomain(e.target.value)}
                                  className="bg-black/40 border border-cyan-500/50 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                />
                                <button type="button" onClick={() => handleUpdateDomain(license.id)} className="text-cyan-400">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => setEditingLicenseId(null)} className="text-gray-500">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Globe className="w-3 h-3" /> {license.domain}
                                </span>
                                {license.status === 'active' && (
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setEditingLicenseId(license.id);
                                      setNewDomain(license.domain);
                                    }}
                                    className="text-gray-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs ${license.email === auth.currentUser?.email ? 'text-gray-300' : 'text-purple-400'}`}>
                            {license.email}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            license.type === 'trial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            license.type === 'standard' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                            license.type === 'reseller' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          }`}>
                            {license.type === 'trial' ? 'Prueba' : license.type === 'standard' ? 'Estándar' : license.type === 'reseller' ? `Reseller` : 'Ilimitado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                          <span>{(license.createdAt?.seconds || license.createdAt?._seconds) ? format(new Date((license.createdAt.seconds || license.createdAt._seconds) * 1000), 'MMM dd, yyyy') : '...'}</span>
                        </td>
                        <td className="px-6 py-4">
                          {license.status === 'active' ? (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if(window.confirm('¿Estás seguro de regenerar la clave? La clave anterior dejará de funcionar.')) {
                                    handleRegenerateKey(license.id);
                                  }
                                }}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
                              >
                                <RefreshCw className="w-3 h-3" /> Regenerar
                              </button>
                              {license.createdBy === auth.currentUser?.email && license.type !== 'reseller' && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(license.id, license.status)}
                                  className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded hover:bg-rose-500/20 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
                                >
                                  Revocar
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-rose-500 text-xs font-bold uppercase flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Revocada
                              </span>
                              {license.createdBy === auth.currentUser?.email && license.type !== 'reseller' && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(license.id, license.status)}
                                  className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/20 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
                                >
                                  Activar
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <div className="onyx-card shrink-0 mt-4">
              <div className="p-4 border-b border-white/5">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-500" />
                  Historial de Actividad
                </h2>
              </div>
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="text-xs uppercase bg-black/40 text-gray-500 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 font-medium">Acción</th>
                      <th className="px-6 py-3 font-medium">Detalles</th>
                      <th className="px-6 py-3 font-medium">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          {log.action === 'created' ? (
                            <span className="text-emerald-400 font-medium text-xs uppercase tracking-wider">Licencia Generada</span>
                          ) : log.action === 'created_by_reseller' ? (
                            <span className="text-purple-400 font-medium text-xs uppercase tracking-wider">Licencia Reseller</span>
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
