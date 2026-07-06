import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  Lock,
  Database,
  Code,
  Server,
  ChevronRight,
  ShoppingCart,
  Users,
  Activity,
  CheckCircle,
  HelpCircle,
  Settings,
  LineChart,
  Globe,
  Cpu,
  Play,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              ONYX <span className="font-light text-gray-400">CMS</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Características
            </a>
            <a
              href="#admin"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Administración
            </a>
            <a
              href="#security"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Seguridad
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Precios
            </a>
            <a
              href="#faq"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              FAQ
            </a>
            <Link
              to="/login"
              className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Área de Cliente
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            La plataforma web más avanzada
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Onyx CMS: La Evolución Definitiva para tu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              Servidor de Mu Online
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Olvídate de los sistemas antiguos. Impulsa tu comunidad con la
            plataforma web más moderna, segura e interactiva del mercado.
            Control total para ti, la mejor experiencia para tus jugadores.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-widest text-black bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" /> Prueba de 10 días
            </Link>
            <a
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-widest text-gray-300 border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center"
            >
              Adquirir Licencia
            </a>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="max-w-6xl mx-auto mt-20 relative z-10 hidden md:block">
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] shadow-[0_0_80px_rgba(245,158,11,0.15)] overflow-hidden transform perspective-1000 rotate-x-2 scale-100 hover:scale-[1.02] transition-transform duration-500">
            {/* Topbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050505]">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
                  ONYX CMS
                </span>
              </div>
              <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="text-white">INICIO</span>
                <span>RANKING</span>
                <span>DONACIONES</span>
                <span>WIKI</span>
                <span>COMANDOS</span>
                <span>DESCARGAS</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <Globe className="w-4 h-4" />
                <Shield className="w-4 h-4" />
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded text-xs text-white border border-white/5">
                  <Users className="w-3 h-3 text-amber-500" /> admin
                </div>
              </div>
            </div>

            <div className="flex h-auto">
              {/* Sidebar */}
              <div className="w-64 border-r border-white/5 bg-[#050505] py-6 hidden lg:block overflow-hidden">
                <div className="px-6 mb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  GENERAL & USUARIOS
                </div>
                <div className="flex items-center gap-3 px-6 py-3 border-l-2 border-amber-500 bg-amber-500/5 text-amber-500 text-xs font-bold">
                  <Activity className="w-4 h-4" /> INICIO (DASHBOARD)
                </div>
                <div className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white text-xs font-bold transition-colors">
                  <Users className="w-4 h-4" /> CUENTAS
                </div>
                <div className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white text-xs font-bold transition-colors">
                  <Settings className="w-4 h-4" /> AJUSTES
                </div>
                <div className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white text-xs font-bold transition-colors">
                  <Globe className="w-4 h-4" /> DISEÑO WEB
                </div>
                <div className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white text-xs font-bold transition-colors">
                  <Cpu className="w-4 h-4" /> PLUGINS
                </div>
                <div className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white text-xs font-bold transition-colors">
                  <Code className="w-4 h-4" /> COMANDOS
                </div>

                <div className="px-6 mt-8 mb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  SOPORTE & COMUNIDAD
                </div>
                <div className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white text-xs font-bold transition-colors">
                  <HelpCircle className="w-4 h-4" /> TICKETS
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8 bg-[#0a0a0a] overflow-hidden">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-[#050505] p-6 rounded-lg border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                    <Users className="w-6 h-6 text-blue-500 mb-2" />
                    <span className="text-3xl font-bold text-white">4</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                      CUENTAS
                    </span>
                  </div>
                  <div className="bg-[#050505] p-6 rounded-lg border border-white/5 flex flex-col items-center justify-center">
                    <Users className="w-6 h-6 text-amber-500 mb-2" />
                    <span className="text-3xl font-bold text-white">21</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                      PERSONAJES
                    </span>
                  </div>
                  <div className="bg-[#050505] p-6 rounded-lg border border-white/5 flex flex-col items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-500 mb-2" />
                    <span className="text-3xl font-bold text-white">1</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                      CLANES
                    </span>
                  </div>
                  <div className="bg-[#050505] p-6 rounded-lg border border-white/5 flex flex-col items-center justify-center">
                    <Shield className="w-6 h-6 text-red-500 mb-2" />
                    <span className="text-3xl font-bold text-white">0</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                      BANEADOS
                    </span>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="col-span-2 bg-[#050505] p-6 rounded-lg border border-white/5 h-64 relative">
                    <div className="text-xs font-bold text-gray-400 mb-8 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-500" /> VISITAS
                      (ÚLTIMOS 7 DÍAS)
                    </div>
                    {/* Fake Chart */}
                    <div className="absolute inset-x-8 bottom-8 top-20 border-b border-l border-white/10">
                      <div className="absolute left-1/2 top-4 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-[10px] text-gray-500">
                        2026-06-30
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 bg-[#050505] p-6 rounded-lg border border-white/5 h-64 flex flex-col">
                    <div className="text-xs font-bold text-gray-400 mb-auto flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-500" /> DONACIONES
                      (MÉTODOS)
                    </div>
                    <div className="text-xs text-gray-600 text-center mb-auto mt-auto">
                      No hay donaciones registradas
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-[#050505] rounded-lg border border-white/5">
                  <div className="px-6 py-4 border-b border-white/5 text-xs font-bold text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" /> 20 ÚLTIMAS CUENTAS REGISTRADAS
                  </div>
                  <div className="w-full text-left text-xs">
                    <div className="grid grid-cols-4 px-6 py-3 border-b border-white/5 text-gray-500 font-bold">
                      <div>USUARIO</div>
                      <div>EMAIL</div>
                      <div>FECHA DE REGISTRO</div>
                      <div>ESTADO</div>
                    </div>
                    <div className="grid grid-cols-4 px-6 py-4 border-b border-white/5 items-center">
                      <div className="text-amber-500 font-bold">test</div>
                      <div className="text-gray-400">test@example.com</div>
                      <div className="text-gray-400">
                        30/6/2026, 12:20:29 a.m.
                      </div>
                      <div>
                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold">
                          ACTIVO
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 px-6 py-4 border-b border-white/5 items-center bg-white/[0.01]">
                      <div className="text-amber-500 font-bold">onyx1</div>
                      <div className="text-gray-400">onyx1@example.com</div>
                      <div className="text-gray-400">
                        3/2/2022, 7:03:39 p.m.
                      </div>
                      <div>
                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold">
                          ACTIVO
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 px-6 py-4 items-center">
                      <div className="text-amber-500 font-bold">onyx2</div>
                      <div className="text-gray-400">onyx2@example.com</div>
                      <div className="text-gray-400">
                        3/2/2022, 2:50:57 p.m.
                      </div>
                      <div>
                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold">
                          ACTIVO
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosistema Onyx CMS */}
      <section id="features" className="py-24 px-6 border-t border-white/5 relative bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
              El Ecosistema Completo
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              Todo lo que tu servidor necesita
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              No somos una web tradicional. Somos una aplicación de vanguardia
              diseñada para potenciar tu comunidad de Mu Online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Módulo de Usuario */}
            <div className="bg-[#050505] border border-white/5 p-8 rounded-2xl hover:border-amber-500/30 transition-colors shadow-xl group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Módulo de Usuario</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Dashboard de Personajes:</strong> Vista moderna con avatares, nivel y resets.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Gestión de Cuenta:</strong> Sistema de resets configurable, Limpiar PK y Destrabar personaje.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Servicios Extra:</strong> Cambio de Nombre, Cambio de Clase y Transferencia de Personajes.</span>
                </li>
              </ul>
            </div>

            {/* Economía y Mercado */}
            <div className="bg-[#050505] border border-white/5 p-8 rounded-2xl hover:border-amber-500/30 transition-colors shadow-xl group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Economía y Mercado</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Webshop Oficial:</strong> Venta con opciones Excelentes, Luck, Skill, y Nivel configurable.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Mercado P2P de Personajes:</strong> Compra/Venta de personajes entre usuarios usando Z-Coins.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Finanzas:</strong> Banco para transferir monedas de forma segura e Intercambio de Z-Coins por Zen.</span>
                </li>
              </ul>
            </div>

            {/* Recompensas y Fidelización */}
            <div className="bg-[#050505] border border-white/5 p-8 rounded-2xl hover:border-amber-500/30 transition-colors shadow-xl group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Recompensas y Fidelización</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Recompensas por Resets:</strong> Entrega de ítems al baúl automáticamente al llegar a ciertas metas.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Ruleta de la Suerte:</strong> Minijuego con premios configurables (Zen, Z-Coins, VIP).</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Crecimiento:</strong> Creador de Giftcodes con límite y Sistema de Referidos automatizado.</span>
                </li>
              </ul>
            </div>

            {/* Módulo Web y Rankings */}
            <div className="bg-[#050505] border border-white/5 p-8 rounded-2xl hover:border-amber-500/30 transition-colors shadow-xl group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Módulo Web y Rankings</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Rankings Dinámicos:</strong> Top Resets, PK, Guilds, Eventos (BC, DS, CC, IT) e Invasiones.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Comunidad:</strong> Módulo de noticias enriquecido y Perfiles públicos de personajes/guilds.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Global:</strong> Estado del servidor en tiempo real y Soporte Multi-idioma (ES, EN, PT).</span>
                </li>
              </ul>
            </div>

            {/* Panel de Administración */}
            <div className="bg-[#050505] border border-white/5 p-8 rounded-2xl hover:border-amber-500/30 transition-colors shadow-xl group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Panel de Administración</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Dashboard Estadístico:</strong> Resumen de ingresos, cuentas y métricas generales.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Control Absoluto:</strong> Ajuste de precios, exp, drops, y gestión de cuentas (ban/unban).</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Gestión de Contenido:</strong> Creador visual de metas de reset y administrador de la Webshop oficial.</span>
                </li>
              </ul>
            </div>

            {/* Seguridad y Core */}
            <div className="bg-[#050505] border border-white/5 p-8 rounded-2xl hover:border-amber-500/30 transition-colors shadow-xl group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Seguridad y Core</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Autenticación:</strong> JWT para sesiones seguras y Soporte MD5 / Texto plano para BD antiguas.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Protección Multicuenta:</strong> Bloqueos por IP y HWID en regalos y referidos.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Instalador Integrado:</strong> Asistente gráfico web para inicializar bases de datos automáticamente.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>







      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-24 px-6 border-t border-white/5 bg-black/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Planes y Precios
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Inversión transparente para tu proyecto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Prueba */}
            <div className="bg-[#050505] border border-white/5 p-8 rounded-xl flex flex-col hover:border-white/20 transition-colors">
              <h3 className="text-xl font-medium text-white mb-2">
                Prueba 10 Días
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tighter">
                  Gratis
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-8">
                Ideal para servidores nuevos que quieren probar el sistema a
                fondo.
              </p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> Todas las
                  funciones desbloqueadas
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> Instalación
                  por cuenta propia
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> 1
                  Dominio/IP temporal
                </li>
              </ul>
              <Link
                to="/login"
                className="w-full px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center block"
              >
                Solicitar Prueba
              </Link>
            </div>

            {/* Lifetime */}
            <div className="bg-[#050505] border border-amber-500/50 p-8 rounded-xl flex flex-col relative shadow-[0_0_30px_rgba(245,158,11,0.15)] transform md:-translate-y-4">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-orange-600 rounded-t-xl"></div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-[10px] font-bold uppercase tracking-widest text-black rounded-full whitespace-nowrap">
                Lifetime / Recomendado
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                Plan Ilimitado
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tighter">
                  $100
                </span>
                <span className="text-gray-500 text-sm">/pago único</span>
              </div>
              <p className="text-sm text-gray-400 mb-8">
                Para proyectos serios a largo plazo. La mejor inversión para tu
                servidor.
              </p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> Licencia de
                  por vida
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> Instalación
                  gratuita
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> Soporte
                  prioritario
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> Acceso a
                  Betas exclusivas
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> 1
                  Dominio/IP modificable
                </li>
              </ul>
              <a
                href="https://wa.me/584242770219?text=Hola,%20quiero%20adquirir%20la%20licencia%20Ilimitada%20de%20Onyx%20CMS"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-black bg-amber-500 hover:bg-amber-400 transition-colors text-center"
              >
                Comprar Licencia
              </a>
            </div>

            {/* Reseller */}
            <div className="bg-[#050505] border border-white/5 p-8 rounded-xl flex flex-col hover:border-white/20 transition-colors">
              <h3 className="text-xl font-medium text-white mb-2">
                Plan Reseller
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tighter">
                  Contactar
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-8">
                Para desarrolladores y revendedores que desean ofrecer Onyx CMS
                a sus clientes.
              </p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> Licencias
                  múltiples a precio especial
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> Marca
                  blanca disponible (Opcional)
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> Panel de
                  gestión de licencias propio
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-500" /> Soporte
                  técnico directo (Tier 2)
                </li>
              </ul>
              <a
                href="https://wa.me/584242770219?text=Hola,%20estoy%20interesado%20en%20el%20Plan%20Reseller%20de%20Onyx%20CMS"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center"
              >
                Consultar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Preguntas Frecuentes
            </h2>
          </div>
          <div className="space-y-4">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-2">
                ¿Es compatible con mis files?
              </h4>
              <p className="text-sm text-gray-400">
                Totalmente compatible con bases de datos clásicas de Mu Online,
                MuEmu, Louis Emulator, TitanTech, etc. usando columnas estándar.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-2">
                ¿Se entregan actualizaciones?
              </h4>
              <p className="text-sm text-gray-400">
                Sí, el sistema está en constante evolución y se actualiza de
                forma automática o mediante simples comandos.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-2">
                ¿Si compro la licencia me ayudan a instalarlo?
              </h4>
              <p className="text-sm text-gray-400">
                Ofrecemos documentación detallada y un asistente de instalación
                web. También brindamos servicio de instalación remota para
                clientes VIP o del plan Ilimitado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center px-6 bg-black">
        <p className="text-xs text-gray-500">
          © 2026 ONYX CMS. Todos los derechos reservados. La Evolución
          Definitiva.
        </p>
      </footer>
    </div>
  );
}
