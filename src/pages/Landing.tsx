import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Database, Code, Server, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,209,255,0.3)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ONYX <span className="font-light text-gray-400">CMS</span></span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Características</a>
            <a href="#security" className="text-sm text-gray-400 hover:text-white transition-colors">Seguridad</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Precios</a>
            <Link to="/login" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              Área de Cliente
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            La nueva generación de CMS para MU Online
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Gestiona tu servidor con <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Precisión Absoluta
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Un CMS diseñado desde cero para administradores exigentes. Ultra rápido, seguro contra vulnerabilidades modernas y con un panel de control que te da poder total sobre tu comunidad.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="onyx-btn w-full sm:w-auto px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(0,209,255,0.2)] flex items-center justify-center gap-2">
              Comenzar Ahora <ChevronRight className="w-4 h-4" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-widest text-gray-300 border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center">
              Explorar Funciones
            </a>
          </div>
        </div>
        
        {/* Mockup Preview */}
        <div className="max-w-5xl mx-auto relative z-10 rounded-2xl border border-white/10 bg-[#0A0A0B] p-2 shadow-2xl shadow-cyan-900/20 overflow-hidden hidden md:block">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="rounded-xl border border-white/5 bg-[#050505] overflow-hidden flex h-[400px]">
             {/* Sidebar Mock */}
             <div className="w-48 border-r border-white/5 p-4 flex flex-col gap-4">
                <div className="h-6 w-24 bg-white/10 rounded mb-4"></div>
                <div className="h-4 w-full bg-cyan-500/20 rounded"></div>
                <div className="h-4 w-3/4 bg-white/5 rounded"></div>
                <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                <div className="h-4 w-2/3 bg-white/5 rounded"></div>
             </div>
             {/* Content Mock */}
             <div className="flex-1 p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                   <div className="h-6 w-32 bg-white/10 rounded"></div>
                   <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <div className="h-24 bg-white/5 rounded-lg border border-white/5 p-4 flex flex-col justify-between">
                     <div className="h-3 w-16 bg-white/10 rounded"></div>
                     <div className="h-8 w-12 bg-cyan-500/40 rounded"></div>
                   </div>
                   <div className="h-24 bg-white/5 rounded-lg border border-white/5 p-4 flex flex-col justify-between">
                     <div className="h-3 w-20 bg-white/10 rounded"></div>
                     <div className="h-8 w-16 bg-emerald-500/40 rounded"></div>
                   </div>
                   <div className="h-24 bg-white/5 rounded-lg border border-white/5 p-4 flex flex-col justify-between">
                     <div className="h-3 w-14 bg-white/10 rounded"></div>
                     <div className="h-8 w-10 bg-purple-500/40 rounded"></div>
                   </div>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg border border-white/5 p-4">
                   <div className="h-4 w-32 bg-white/10 rounded mb-4"></div>
                   <div className="space-y-3">
                     <div className="h-3 w-full bg-white/5 rounded"></div>
                     <div className="h-3 w-full bg-white/5 rounded"></div>
                     <div className="h-3 w-3/4 bg-white/5 rounded"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Arquitectura de Siguiente Nivel</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Todo lo que necesitas para administrar cuentas, personajes, clanes y la economía de tu servidor en una interfaz moderna.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="onyx-card p-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">Rendimiento Extremo</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Construido con las últimas tecnologías web. Carga de páginas instantánea y consultas optimizadas para bases de datos masivas sin lag.</p>
            </div>
            <div className="onyx-card p-8 border-t-2 border-t-cyan-500">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">Gestión de Módulos</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Sistema de ranking en tiempo real, webshop integrado, mercado de personajes, sistema de referidos y control total de la base de datos SQL.</p>
            </div>
            <div className="onyx-card p-8">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">Personalización Total</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Motor de plantillas avanzado. Adapta el diseño a la identidad visual de tu servidor con facilidad, o utiliza nuestros temas premium.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Functions Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              Módulos Integrados
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ecosistema Completo para MU Online</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">No necesitas plugins de terceros. ONYX CMS trae de fábrica todas las herramientas necesarias para monetizar y gestionar tu comunidad.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Panel de Usuario",
                desc: "Gestión completa de cuenta: resetear stats, limpiar PK, resetear árbol de habilidades y unbox de recompensas automáticas.",
                icon: "👤"
              },
              {
                title: "Ranking en Tiempo Real",
                desc: "Clasificación dinámica por resets, master level, clanes, asesinos, Blood Castle, Devil Square y Chaos Castle.",
                icon: "🏆"
              },
              {
                title: "Webshop Avanzado",
                desc: "Vende ítems con opciones excelentes, luck, skill, y sockets. Configuración granular de precios por monedas virtuales (WCoins, Goblin Points).",
                icon: "🛒"
              },
              {
                title: "Mercado de Personajes",
                desc: "Permite a los usuarios comerciar personajes completos de forma segura. El CMS actúa como intermediario reteniendo el pago.",
                icon: "⚖️"
              },
              {
                title: "Sistema de Donaciones",
                desc: "Integración nativa con PayPal, MercadoPago, Binance Pay, y Stripe con entrega automática de créditos al instante.",
                icon: "💳"
              },
              {
                title: "Panel de Administración",
                desc: "Modifica cuentas, banea usuarios, gestiona tickets de soporte, envía noticias y configura el servidor sin tocar el SQL.",
                icon: "⚙️"
              }
            ].map((feature, i) => (
              <div key={i} className="onyx-card p-6 flex items-start gap-4 hover:border-cyan-500/50 transition-colors">
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center text-2xl shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 px-6 relative border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <Lock className="w-3 h-3" /> Máxima Seguridad
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Protección contra amenazas de día cero.</h2>
                <p className="text-gray-400 leading-relaxed">
                  Sabemos que la seguridad de tu base de datos es la prioridad número uno. ONYX CMS está fortificado contra todos los ataques conocidos en el ecosistema de MU Online.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  'Inyección SQL completamente mitigada por PDO/ORM.',
                  'Protección XSS (Cross-Site Scripting) en todos los inputs.',
                  'Sistema anti-DDoS básico a nivel de aplicación.',
                  'Encriptación de contraseñas compatible con MD5/SHA256 y algoritmos modernos.',
                  'Logs detallados de transacciones y acciones administrativas.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent blur-3xl"></div>
              <div className="onyx-card p-6 border border-white/10 font-mono text-sm relative z-10 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="space-y-2 text-gray-400">
                  <p><span className="text-blue-400">const</span> <span className="text-yellow-200">securityModule</span> = <span className="text-cyan-400">new</span> <span className="text-emerald-300">OnyxShield</span>();</p>
                  <p>securityModule.<span className="text-yellow-200">initialize</span>({'{'}</p>
                  <p className="pl-4">sqlInjectionProtection: <span className="text-blue-400">true</span>,</p>
                  <p className="pl-4">csrfTokenValidation: <span className="text-blue-400">true</span>,</p>
                  <p className="pl-4">rateLimiting: <span className="text-blue-400">true</span>,</p>
                  <p className="pl-4">admin2FA: <span className="text-blue-400">true</span></p>
                  <p>{'}'});</p>
                  <p className="pt-4 text-emerald-400">// System secure and ready.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Planes y Licencias</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Precios transparentes para administradores serios. Comienza gratis y escala cuando estés listo.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Trial */}
            <div className="onyx-card p-8 flex flex-col">
              <h3 className="text-lg font-medium text-white mb-2">Prueba</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tighter">Gratis</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 h-10">Perfecto para pruebas locales o iniciar la configuración de tu servidor.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Server className="w-4 h-4 text-cyan-400" /> 1 Dominio activo</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-emerald-400" /> Todas las funciones web</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-emerald-400" /> Válido por 10 días</li>
              </ul>
              <Link to="/login" className="w-full px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center">
                Comenzar Prueba
              </Link>
            </div>

            {/* Unlimited */}
            <div className="onyx-card p-8 flex flex-col relative border-cyan-500 shadow-[0_0_30px_rgba(0,209,255,0.1)]">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 text-[10px] font-bold uppercase tracking-widest text-white rounded-full">
                Más Popular
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Ilimitado</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tighter">$100</span>
                <span className="text-gray-500 text-sm">/pago único</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 h-10">La licencia estándar para servidores en producción que buscan estabilidad.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Server className="w-4 h-4 text-cyan-400" /> 1 Dominio activo</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-emerald-400" /> Licencia de por vida</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-emerald-400" /> Soporte prioritario</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-emerald-400" /> Actualizaciones gratuitas</li>
              </ul>
              <a 
                href="https://wa.me/584242770219?text=Hola,%20quiero%20adquirir%20la%20licencia%20Ilimitada%20de%20ONYX%20CMS" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="onyx-btn w-full px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white text-center flex items-center justify-center"
              >
                Adquirir Licencia
              </a>
            </div>

            {/* Reseller */}
            <div className="onyx-card p-8 flex flex-col">
              <h3 className="text-lg font-medium text-white mb-2">Reseller</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tighter">Consultar</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 h-10">Para desarrolladores y agencias que montan servidores para terceros.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Server className="w-4 h-4 text-purple-400" /> Múltiples Dominios</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-emerald-400" /> Gestión de clientes</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-emerald-400" /> Marca blanca disponible</li>
              </ul>
              <a 
                href="https://wa.me/584242770219?text=Hola,%20quiero%20información%20sobre%20la%20licencia%20Reseller%20de%20ONYX%20CMS" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center"
              >
                Contactar Ventas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center px-6">
        <p className="text-xs text-gray-500">© 2026 ONYX CMS. Todos los derechos reservados. Sistema avanzado de gestión para MU Online.</p>
      </footer>
    </div>
  );
}

// Inline component for the CheckCircle since we didn't import it at the top
function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
