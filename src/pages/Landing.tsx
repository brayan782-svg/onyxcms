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

      {/* Características Estrella */}
      <section
        id="features"
        className="py-24 px-6 border-t border-white/5 bg-black/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Por qué somos diferentes
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              No somos una web tradicional. Somos una aplicación de vanguardia
              diseñada para potenciar tu servidor.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-xl hover:border-amber-500/30 transition-colors shadow-xl">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6">
                <ShoppingCart className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">
                Mercado P2P Inteligente
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                El único sistema de compra/venta entre jugadores con algoritmo
                de cuadrícula real y reconocimiento hexadecimal. Los ítems
                respetan su tamaño (1x1, 2x3, 4x2) al ser transferidos al baúl.
                Cero bugs, cero dupes.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-xl border-t-2 border-t-amber-500 shadow-[0_-2px_20px_rgba(245,158,11,0.15)]">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">
                Seguridad de Vanguardia
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Desarrollado con Node.js, React y TypeScript. Adiós a las
                vulnerabilidades de PHP clásico. Protección total contra
                Inyecciones SQL, XSS y exploits comunes.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-xl hover:border-amber-500/30 transition-colors shadow-xl">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">
                Retención y Gamificación
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Mantén a tus usuarios activos todos los días con nuestra Ruleta
                de la Suerte integrada, sistema de referidos, mercado de
                personajes y recompensas por votación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funciones del Panel de Usuario */}
      <section className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-widest mb-6">
              Experiencia del Jugador
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Funciones del Panel de Usuario
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Dale a tus jugadores el control que necesitan en una interfaz
              fluida e intuitiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl flex gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">
                  Gestión de Cuenta Total
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Limpiar PK, resetear estadísticas (sin quitar ítems), cambiar
                  de clase, destrabar personaje y gestionar VIP.
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl flex gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">
                  Tienda Oficial Web (Cash Shop)
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Venta automatizada de ítems con opciones a medida (Luck,
                  Skill, Excellent Options, Sockets) entregados directamente al
                  baúl mediante algoritmos exactos.
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl flex gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">
                  Sistema de HelpDesk
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Sistema de tickets integrado para que los usuarios contacten
                  al Staff de manera organizada, con historial de chat y
                  estados.
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl flex gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Economía Dinámica</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Integración de Z-Coins y Joyas como moneda de cambio tanto en
                  la tienda oficial como en el mercado entre jugadores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funciones del Panel de Administración */}
      <section
        id="admin"
        className="py-24 px-6 border-t border-white/5 bg-black/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
              El Control del Dueño
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Funciones del Panel de Administración
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Facilidad de uso sin precedentes, sin necesidad de tocar la base
              de datos SQL manualmente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#050505] border border-white/5 p-6 rounded-xl">
              <Cpu className="w-8 h-8 text-amber-500 mb-4" />
              <h4 className="text-white font-bold mb-2">Control Absoluto</h4>
              <p className="text-sm text-gray-400">
                Modifica precios de funciones, gestiona la tienda, y agrega
                premios a la ruleta con un par de clics.
              </p>
            </div>
            <div className="bg-[#050505] border border-white/5 p-6 rounded-xl">
              <Code className="w-8 h-8 text-amber-500 mb-4" />
              <h4 className="text-white font-bold mb-2">
                Gestión de Contenido
              </h4>
              <p className="text-sm text-gray-400">
                Publica noticias, artículos para la Wiki, agrega eventos al
                contador en vivo y actualiza las imágenes del Slider fácilmente.
              </p>
            </div>
            <div className="bg-[#050505] border border-white/5 p-6 rounded-xl">
              <Activity className="w-8 h-8 text-amber-500 mb-4" />
              <h4 className="text-white font-bold mb-2">Monitor y Logs</h4>
              <p className="text-sm text-gray-400">
                Revisa todas las transacciones del mercado, compras, reseteos y
                acciones del staff para detectar anomalías.
              </p>
            </div>
            <div className="bg-[#050505] border border-white/5 p-6 rounded-xl">
              <LineChart className="w-8 h-8 text-amber-500 mb-4" />
              <h4 className="text-white font-bold mb-2">Dashboard Analítico</h4>
              <p className="text-sm text-gray-400">
                Estadísticas en tiempo real de nuevas cuentas, usuarios en línea
                y ganancias estimadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seguridad, Rendimiento y Licenciamiento */}
      <section
        id="security"
        className="py-24 px-6 border-t border-white/5 relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Arquitectura de Vanguardia
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Para los administradores técnicos que buscan lo mejor. Hemos
                  construido Onyx CMS pensando en escalabilidad, seguridad y
                  rendimiento extremo.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">
                      Sistema de Licencias Seguro
                    </h4>
                    <p className="text-sm text-gray-400">
                      Cada licencia está cifrada de extremo a extremo, vinculada
                      a tu IP/Dominio y validada en tiempo real.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">
                      Rendimiento Full-Stack
                    </h4>
                    <p className="text-sm text-gray-400">
                      Al utilizar una arquitectura SPA con React, la navegación
                      es fluida, sin recargas. El backend en Node.js maneja
                      miles de peticiones simultáneas con un consumo mínimo en
                      tu VPS.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">
                      Algoritmos Nativos Hexadecimales
                    </h4>
                    <p className="text-sm text-gray-400">
                      No usamos consultas SQL destructivas para el baúl. Nuestro
                      sistema lee el código binario (VARBINARY) del baúl,
                      calcula los espacios vacíos exactos de forma bidimensional
                      (ancho y alto) e inserta el nuevo ítem de forma
                      quirúrgica.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent blur-3xl"></div>
              <div className="bg-[#050505] p-6 border border-white/10 font-mono text-sm relative z-10 shadow-2xl rounded-xl">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="space-y-2 text-gray-400">
                  <p>
                    <span className="text-blue-400">import</span> {"{"}{" "}
                    <span className="text-amber-200">VaultManager</span> {"}"}{" "}
                    <span className="text-blue-400">from</span>{" "}
                    <span className="text-emerald-300">'@onyx/core'</span>;
                  </p>
                  <br />
                  <p>
                    <span className="text-blue-400">const</span> vault ={" "}
                    <span className="text-blue-400">await</span> VaultManager.
                    <span className="text-amber-200">getVault</span>(accountId);
                  </p>
                  <p>
                    <span className="text-blue-400">const</span> slot = vault.
                    <span className="text-amber-200">findEmptySpace</span>
                    (item.width, item.height);
                  </p>
                  <br />
                  <p>
                    <span className="text-blue-400">if</span> (slot !== -1){" "}
                    {"{"}
                  </p>
                  <p className="pl-4">
                    vault.<span className="text-amber-200">insertHexItem</span>
                    (item.hex, slot);
                  </p>
                  <p className="pl-4">
                    <span className="text-blue-400">await</span> vault.
                    <span className="text-amber-200">saveSafely</span>();
                  </p>
                  <p className="pl-4">
                    <span className="text-emerald-400">
                      // Zero dupes, zero bugs.
                    </span>
                  </p>
                  <p>{"}"}</p>
                </div>
              </div>
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
