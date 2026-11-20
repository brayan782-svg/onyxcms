import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  Menu,
  Minus,
  Shield,
  Terminal,
  X,
} from "lucide-react";

import heroBannerImg from "../assets/images/hero_onyx_banner_1795186902991.jpg";
import showcasePortalImg from "../assets/images/showcase_portal_pro_1795186904787.jpg";
import showcaseMarketImg from "../assets/images/showcase_market_ucp_1795186926850.jpg";
import showcaseAdminImg from "../assets/images/showcase_admin_studio_1795186889078.jpg";

interface ShowcaseTab {
  id: "portal" | "market" | "admin";
  label: string;
  caption: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
}

interface ComparisonRow {
  feature: string;
  free: boolean;
  pro: boolean;
  category: "core" | "pro";
}

interface FaqItem {
  question: string;
  answer: string;
}

const SHOWCASE_TABS: ShowcaseTab[] = [
  {
    id: "portal",
    label: "Portal y Diseño PRO",
    caption: "Edición FREE + Estudio de Diseño PRO",
    title: "Estética RPG oscura de alto impacto con carga instantánea",
    description:
      "Un portal público con noticias enriquecidas, estado del servidor en tiempo real, contadores de Castle Siege, cronómetro de Eventos e Invasiones y rankings avanzados. Con PRO desbloqueas el Estudio de Diseño visual completo.",
    image: showcasePortalImg,
    imageAlt:
      "Interfaz del portal principal de Onyx CMS v4.1.2 mostrando estado de servidores, rankings de personajes y contadores de eventos",
    highlights: [
      "Paletas exclusivas en PRO: Obsidiana, Carmesí, Esmeralda y esquemas personalizados",
      "4 estilos de cabecera, bordes configurables (cuadrados, redondeados, biselados) y fondos en video",
      "Sliders y mini-sliders promocionales administrables sin tocar código",
      "Top Personajes, Clanes, PK, Eventos y fichas detalladas en tiempo real",
    ],
  },
  {
    id: "market",
    label: "Panel UCP y Mercado P2P",
    caption: "Panel de Usuario + Economía PRO",
    title: "Monetización real y economía viva entre tus jugadores",
    description:
      "Cada jugador gestiona sus personajes (Reset, Clear PK, Unstuck, Guild y Banco) desde un UCP fluido con tour guiado. La Edición PRO suma WebShop XML/TXT hasta Season 21, Mercado P2P desde el baúl y comercio seguro de personajes.",
    image: showcaseMarketImg,
    imageAlt:
      "Panel de usuario y Mercado P2P de ítems y personajes de Onyx CMS v4.1.2 con banco de monedas y vista de equipamiento",
    highlights: [
      "WebShop Oficial con importador XML/TXT directo desde tu emulador (opciones excelentes, sockets, luck, skill)",
      "Mercado P2P de ítems directo desde el baúl y mercado de personajes con comisiones configurables",
      "Donaciones y recargas integradas (Binance, PayPal, PagoMóvil, Nequi) con aprobación de comprobantes",
      "Cambio de clase hasta Season 21, cambio de nombre, transferencia de monedas y membresías VIP 1–3",
    ],
  },
  {
    id: "admin",
    label: "Panel Admin v4.1.2",
    caption: "ACP v4.1.2 + Diagnóstico & Auditoría",
    title: "Control total del servidor, seguridad y métricas en vivo",
    description:
      "Administra cuentas, monedas, bloqueos por Cuenta/IP/HWID, tickets de soporte, gráficas de ingresos y plugins desde una sola consola. Incluye instalador web en 4 pasos y herramientas de diagnóstico de base de datos.",
    image: showcaseAdminImg,
    imageAlt:
      "Panel de Administración ACP v4.1.2 de Onyx CMS con gráficas de ingresos, métricas activas y selector de paletas del Estudio de Diseño",
    highlights: [
      "Dashboard en vivo con gráficas de ingresos por moneda y notificaciones de donaciones y tickets",
      "Diagnóstico automático de tablas y monedas en SQL Server + herramientas de emergencia integradas",
      "Gestión de Bans por Cuenta, IP y HWID, protección Rate-Limit y auditoría completa de logs",
      "Activación de licencia PRO en 1 clic directamente desde el panel, sin reinstalar ni perder datos",
    ],
  },
];

const FREE_MODULES = [
  {
    title: "Portal Principal Completo",
    items: [
      "Noticias con editor enriquecido y gestión de portada",
      "Estado del servidor en tiempo real y jugadores en línea",
      "Contadores de Castle Siege y cronómetro en vivo de Eventos e Invasiones",
    ],
  },
  {
    title: "Rankings Avanzados",
    items: [
      "Top Personajes por Resets, Grand Resets y Nivel",
      "Top Clanes (Guilds), Top PK / Asesinos y Top Eventos",
      "Fichas detalladas públicas de personajes y clanes",
    ],
  },
  {
    title: "Centro de Información",
    items: [
      "Página de Descargas configurable desde el panel",
      "Wiki / Base de Datos editable y Reglas del Servidor",
      "Lista de Comandos, equipo Staff/GM y guía de conexión",
    ],
  },
  {
    title: "Panel de Usuario (UCP)",
    items: [
      "Registro, inicio de sesión instantáneo y gestión de cuenta",
      "Reset, Clear PK, Unstuck (destrabar personaje) y panel de personajes",
      "Gestión de Guild, Banco de monedas y tour guiado para jugadores nuevos",
    ],
  },
  {
    title: "Panel de Administración (ACP v4.1.2)",
    items: [
      "Dashboard con estadísticas en vivo y gestión total de Cuentas y Personajes",
      "Bloqueos y Bans por Cuenta, IP y HWID + visor de logs de auditoría",
      "Diagnóstico de Base de Datos, herramientas de emergencia y gestor de plugins",
    ],
  },
  {
    title: "Diseño Base Profesional",
    items: [
      "Tema oscuro RPG clásico optimizado para escritorio y móvil",
      "Instalador web guiado en 4 pasos sin editar archivos de código",
      "Actualización a Edición PRO en 1 clic conservando todos tus datos",
    ],
  },
];

const PRO_MODULES = [
  {
    category: "Economía, Tienda y Monetización",
    items: [
      {
        name: "WebShop Oficial + Catálogo XML/TXT (S6 – S21)",
        detail:
          "Carga tus ítems directo desde los archivos del emulador con opciones excelentes, sockets, nivel, luck y skill (MuDevs e IGCN hasta Season 21).",
      },
      {
        name: "Mercado P2P de Ítems y Personajes",
        detail:
          "Comercio seguro entre jugadores directo desde el baúl o compra/venta de personajes con comisiones configurables.",
      },
      {
        name: "Donaciones, Recargas y Gráficas de Ingresos",
        detail:
          "Soporte para Binance, PayPal, PagoMóvil, Nequi y métodos locales, aprobación de comprobantes con alertas en vivo y gráficas por moneda.",
      },
      {
        name: "Gestión VIP (Niveles 1 – 3)",
        detail:
          "Compra y administración de membresías VIP por días o fechas con sincronización directa al emulador.",
      },
    ],
  },
  {
    category: "Gamificación y Retención de Jugadores",
    items: [
      {
        name: "Ruleta de Monedas",
        detail:
          "Minijuego configurable con premios personalizables y control anti-abuso integrado.",
      },
      {
        name: "Reset Rewards y Vote Rewards",
        detail:
          "Recompensas escalables automáticas al alcanzar metas de Resets y acreditación de premios por votar en tops.",
      },
      {
        name: "Sistema de Referidos y Gift Codes",
        detail:
          "Premia invitaciones validando progreso o primer reset, y crea cupones promocionales limitados por usos o fecha.",
      },
      {
        name: "Encuestas de Comunidad y Sección de Streamers",
        detail:
          "Recoge votaciones de tu comunidad y destaca a tus creadores de contenido en directo.",
      },
    ],
  },
  {
    category: "Servicios Avanzados, Soporte y Estudio PRO",
    items: [
      {
        name: "Servicios Especiales de Jugador",
        detail:
          "Cambio de Clase / Raza actualizado hasta Season 21, Cambio de Nombre y Transferencia de Monedas entre cuentas.",
      },
      {
        name: "Tickets de Soporte y Buzón de Sugerencias",
        detail:
          "Atención organizada por prioridades con alertas en tiempo real dentro del Panel Admin.",
      },
      {
        name: "Estudio de Diseño PRO",
        detail:
          "Paletas exclusivas (Obsidiana, Carmesí, Esmeralda y más), estilos de bordes, 4 cabeceras, fondos en video y sliders promocionales.",
      },
    ],
  },
];

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Portal, Noticias, Rankings, Castle Siege y Eventos/Invasiones",
    free: true,
    pro: true,
    category: "core",
  },
  {
    feature: "Descargas, Wiki editable, Reglas, Comandos y Staff/GM",
    free: true,
    pro: true,
    category: "core",
  },
  {
    feature: "Panel de Usuario (Reset, Clear PK, Unstuck, Guild, Banco, Tour)",
    free: true,
    pro: true,
    category: "core",
  },
  {
    feature: "Panel Admin v4.1.2 + Bans IP/HWID + Diagnóstico BD + Logs",
    free: true,
    pro: true,
    category: "core",
  },
  {
    feature: "Multi-Emulador (MuDevs S6–S21, Louis, IGCN, MuEmu, ZTeam, TitanTech)",
    free: true,
    pro: true,
    category: "core",
  },
  {
    feature: "Instalador Web en 4 Pasos y Protección Anti-Fuerza Bruta",
    free: true,
    pro: true,
    category: "core",
  },
  {
    feature: "WebShop Oficial + Importador XML/TXT (Season 6 a Season 21)",
    free: false,
    pro: true,
    category: "pro",
  },
  {
    feature: "Mercado P2P de Ítems desde Baúl y Mercado de Personajes",
    free: false,
    pro: true,
    category: "pro",
  },
  {
    feature: "Donaciones, Pasarelas (Binance, PayPal, PagoMóvil, Nequi) y Gráficas",
    free: false,
    pro: true,
    category: "pro",
  },
  {
    feature: "Gestión VIP (Niveles 1–3 por Fecha o Días)",
    free: false,
    pro: true,
    category: "pro",
  },
  {
    feature: "Ruleta de Monedas, Reset Rewards, Vote Rewards, Referidos y Gift Codes",
    free: false,
    pro: true,
    category: "pro",
  },
  {
    feature: "Tickets de Soporte, Buzón de Sugerencias, Encuestas y Streamers",
    free: false,
    pro: true,
    category: "pro",
  },
  {
    feature: "Cambio de Clase (hasta S21), Cambio de Nombre y Transferencias",
    free: false,
    pro: true,
    category: "pro",
  },
  {
    feature: "Estudio de Diseño PRO (Paletas, 4 Cabeceras, Video BG y Sliders)",
    free: false,
    pro: true,
    category: "pro",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Con qué emuladores y temporadas de MU Online es compatible?",
    answer:
      "Onyx CMS v4.1.2 incluye auto-detección de esquema y soporte nativo desde Season 6 hasta Season 21, cubriendo MuDevs (S6–S21), Louis Emulator, IGCN, MuEmu, ZTeam y TitanTech sobre Microsoft SQL Server 2008 R2 hasta 2022.",
  },
  {
    question: "¿Puedo empezar en Edición FREE y pasar a PRO después sin perder datos?",
    answer:
      "Sí. La Edición FREE utiliza la misma base y estructura. Cuando decidas activar tu licencia PRO, solo ingresas tu clave desde el Panel de Administración en 1 clic y se desbloquean todos los módulos al instante, sin reinstalar ni tocar tu base de datos.",
  },
  {
    question: "¿Necesito compilar código o instalar librerías en mi VPS?",
    answer:
      "No. Onyx CMS v4.1.2 se entrega empaquetado y listo para ejecutarse en Node.js 18, 20, 22 o 24+. Solo subes los archivos, ejecutas node app.js (o con PM2) y abres /install en el navegador para completar la conexión en menos de 3 minutos.",
  },
  {
    question: "¿Cómo funciona la licencia PRO y el cambio de dominio?",
    answer:
      "La licencia PRO Vitalicia tiene un pago único de $200 sin mensualidades e incluye instalación gratuita y soporte prioritario. Solo debes crear tu cuenta en el portal y solicitar la activación por WhatsApp; una vez activada por el administrador, podrás gestionar tu clave y cambiar tu dominio/IP desde el Área de Cliente.",
  },
];

function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#121218] via-[#0c0c10] to-[#08080b] text-zinc-400 p-8 ${className}`}
      >
        <Shield className="w-8 h-8 text-amber-500/70 mb-3" />
        <span className="text-sm font-medium text-zinc-200">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState<"portal" | "market" | "admin">("portal");
  const [activeEdition, setActiveEdition] = useState<"free" | "pro">("pro");
  const [tableFilter, setTableFilter] = useState<"all" | "core" | "pro">("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [demoUrl, setDemoUrl] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("584242770219");

  useEffect(() => {
    let active = true;
    const loadPublicLinks = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "cms"));
        if (active && snap.exists()) {
          const data = snap.data();
          if (typeof data.downloadUrl === "string") setDownloadUrl(data.downloadUrl.trim());
          if (typeof data.demoUrl === "string") setDemoUrl(data.demoUrl.trim());
          if (typeof data.whatsappNumber === "string" && data.whatsappNumber.trim()) {
            setWhatsappNumber(data.whatsappNumber.trim());
          }
        }
      } catch {
        // Fallback gracefully if settings are restricted or offline
      }
    };
    loadPublicLinks();
    return () => {
      active = false;
    };
  }, []);

  const cleanWhatsapp = whatsappNumber.replace(/[^\d]/g, "") || "584242770219";
  const makeWhatsappLink = (message: string) =>
    `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`;

  const currentShowcase =
    SHOWCASE_TABS.find((t) => t.id === activeShowcase) || SHOWCASE_TABS[0];

  const filteredRows = COMPARISON_ROWS.filter((row) => {
    if (tableFilter === "all") return true;
    return row.category === tableFilter;
  });

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100">
      {/* Top Bar: strict 3-zone contract */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#070709]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Clean single-element wordmark */}
          <a
            href="#inicio"
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2.5"
          >
            <span className="w-7 h-7 rounded-md bg-amber-500 text-zinc-950 inline-flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 stroke-[2.25]" />
            </span>
            <span>Onyx CMS</span>
          </a>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400"
          >
            <a
              href="#arquitectura"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Arquitectura
            </a>
            <a
              href="#ediciones"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Ediciones
            </a>
            <a
              href="#comparativa"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Comparativa
            </a>
            <a
              href="#precios"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Precios
            </a>
            <a
              href="#requisitos"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Requisitos
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              Área de Cliente
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="md:hidden p-2.5 rounded-lg border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-[#0b0b0f] px-6 py-5 space-y-4">
            <div className="flex flex-col gap-3 text-sm font-medium text-zinc-300">
              <a
                href="#arquitectura"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-white"
              >
                Arquitectura
              </a>
              <a
                href="#ediciones"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-white"
              >
                Ediciones FREE y PRO
              </a>
              <a
                href="#comparativa"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-white"
              >
                Comparativa
              </a>
              <a
                href="#precios"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-white"
              >
                Precios
              </a>
              <a
                href="#requisitos"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-white"
              >
                Requisitos
              </a>
            </div>
            <div className="pt-3 border-t border-white/[0.08]">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-amber-500 text-zinc-950"
              >
                Área de Cliente
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section id="inicio" className="relative overflow-hidden border-b border-white/[0.08]">
          {/* Atmospheric dark RPG background with measured contrast scrim */}
          <div className="absolute inset-0 pointer-events-none">
            <ImageWithFallback
              src={heroBannerImg}
              alt="Fortaleza oscura de obsidiana con braseros dorados inspirada en el universo MU Online"
              fallbackTitle="Onyx CMS v4.1.2"
              className="w-full h-full object-cover object-center opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/80 via-[#070709]/65 to-[#070709]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-amber-400/95 mb-5">
                  <span>Onyx CMS v4.1.2</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Edición FREE y PRO</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Season 6 a Season 21</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight leading-[1.06] text-white [text-wrap:balance] max-w-2xl">
                  El sistema web definitivo para servidores de MU Online
                </h1>

                <p className="mt-6 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
                  Deja atrás las webs lentas en PHP antiguo. Onyx CMS v4.1.2 corre sobre
                  React y Node.js con instalador guiado en 4 pasos, estética RPG oscura de
                  alto impacto y dos modalidades: comienza gratis hoy en Edición FREE o
                  desbloquea la suite completa de monetización PRO en 1 clic.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Edición FREE
                    </a>
                  ) : (
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Edición FREE
                    </Link>
                  )}

                  <a
                    href="#precios"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-zinc-100 border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] transition-colors whitespace-nowrap shrink-0"
                  >
                    Ver Licencia PRO
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-3 text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
                    >
                      Demo en Vivo
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Right Focal Preview Frame */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="rounded-xl overflow-hidden border border-white/12 bg-[#0d0d12] h-full flex flex-col">
                  <div className="aspect-video lg:flex-1 relative overflow-hidden">
                    <ImageWithFallback
                      src={showcasePortalImg}
                      alt="Vista previa del portal Onyx CMS v4.1.2 con rankings en vivo y contadores de eventos"
                      fallbackTitle="Portal Onyx CMS v4.1.2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-5 py-4 border-t border-white/[0.08] flex items-center justify-between gap-4 text-xs text-zinc-400">
                    <span>Portal RPG + UCP + ACP v4.1.2</span>
                    <a
                      href="#capturas"
                      className="text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap shrink-0"
                    >
                      Ver capturas
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-width 4-column Technical Proof Strip below the Hero Split */}
            <div className="mt-14 pt-10 border-t border-white/[0.08] grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  S6 – S21
                </div>
                <p className="mt-1.5 text-sm text-zinc-400 leading-snug">
                  MuDevs, Louis Emulator, IGCN, MuEmu, ZTeam y TitanTech
                </p>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  &lt; 3 min
                </div>
                <p className="mt-1.5 text-sm text-zinc-400 leading-snug">
                  Instalador web guiado en 4 pasos con diagnóstico SQL automático
                </p>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  Node 18–24+
                </div>
                <p className="mt-1.5 text-sm text-zinc-400 leading-snug">
                  Empaquetado listo para ejecutar con node app.js o PM2 sin compilar
                </p>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-amber-400 tabular-nums">
                  1 clic
                </div>
                <p className="mt-1.5 text-sm text-zinc-400 leading-snug">
                  Pasa de Edición FREE a PRO desde el Panel Admin sin perder datos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Why Onyx CMS v4.1.2 (Asymmetric Bento Grid) */}
        <section id="arquitectura" className="py-24 px-6 border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs font-medium text-amber-400 mb-3">
                Ingeniería y rendimiento · Arquitectura v4.1.2
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                Por qué los administradores migran a Onyx CMS
              </h2>
              <p className="mt-4 text-base text-zinc-400 leading-relaxed">
                Cada capa fue diseñada para responder en milisegundos bajo carga real,
                proteger la economía del servidor y eliminar la configuración manual de archivos.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <article className="lg:col-span-7 bg-[#0d0d12] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-zinc-500">01</span>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">
                    Velocidad y rendimiento extremo en React + Node.js
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
                    Carga modular bajo demanda y sistema de caché inteligente en base de
                    datos. Tus jugadores inician sesión en milisegundos y navegan entre
                    rankings, mercado y perfiles sin recargas pesadas ni cuellos de botella de PHP.
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400 font-mono">
                  <span>SPA React moderna</span>
                  <span>Caché SQL inteligente</span>
                  <span>Carga bajo demanda</span>
                </div>
              </article>

              <article className="lg:col-span-5 bg-[#0d0d12] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-zinc-500">02</span>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">
                    Compatibilidad Multi-Emulador (S6 – S21)
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
                    Auto-detección de esquema SQL y soporte nativo para MuDevs (Season 6 a
                    Season 21), Louis Emulator, IGCN, MuEmu, ZTeam y TitanTech.
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-white/[0.06] text-xs text-zinc-400 font-mono">
                  SQL Server 2008 R2 / 2012 / 2014 / 2017 / 2019 / 2022
                </div>
              </article>

              <article className="lg:col-span-5 bg-[#0d0d12] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-zinc-500">03</span>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">
                    Seguridad de nivel producción
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
                    Autenticación reforzada por tokens y cookies seguras, Rate-Limit contra
                    fuerza bruta y abusos en economía, consultas blindadas contra inyección
                    SQL, Bans por Cuenta, IP y HWID, y auditoría completa de logs.
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-white/[0.06] text-xs text-zinc-400 font-mono">
                  Rate-Limit · Anti-SQLi · Bans IP/HWID · Auditoría
                </div>
              </article>

              <article className="lg:col-span-7 bg-[#0d0d12] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-zinc-500">04</span>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">
                    Instalador web guiado en 4 pasos y despliegue en 1 minuto
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
                    Sin editar archivos de configuración a mano. Conecta tu SQL Server desde
                    el navegador, ejecuta el diagnóstico automático de tablas y monedas, crea
                    tu cuenta administradora y deja la web operativa en menos de 3 minutos.
                    Se entrega empaquetada para Node.js 18, 20, 22 y 24+ sin compilar nada en tu VPS.
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400 font-mono">
                  <span>Asistente /install</span>
                  <span>Diagnóstico de tablas</span>
                  <span>Listo para PM2</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Visual Showcase */}
        <section id="capturas" className="py-24 px-6 border-b border-white/[0.08] bg-[#0a0a0e]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <p className="text-xs font-medium text-amber-400 mb-3">
                  Recorrido visual · Interfaz v4.1.2
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                  Diseñado para retener jugadores y simplificar tu gestión
                </h2>
              </div>

              {/* Interactive Segmented Control */}
              <div
                role="tablist"
                aria-label="Vistas de la plataforma"
                className="inline-flex items-center p-1 rounded-lg bg-[#13131a] border border-white/[0.08] self-start lg:self-auto overflow-x-auto max-w-full"
              >
                {SHOWCASE_TABS.map((tab) => {
                  const isActive = tab.id === activeShowcase;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveShowcase(tab.id)}
                      className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? "bg-amber-500 text-zinc-950 font-semibold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 rounded-xl overflow-hidden border border-white/10 bg-[#0d0d12]">
                <div className="aspect-video lg:h-full">
                  <ImageWithFallback
                    src={currentShowcase.image}
                    alt={currentShowcase.imageAlt}
                    fallbackTitle={currentShowcase.label}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#0d0d12] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-400">
                    {currentShowcase.caption}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-white leading-snug">
                    {currentShowcase.title}
                  </h3>
                  <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                    {currentShowcase.description}
                  </p>

                  <ul className="mt-6 space-y-3.5 border-t border-white/[0.08] pt-6">
                    {currentShowcase.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-zinc-300 leading-snug"
                      >
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
                  <span className="text-xs text-zinc-500">
                    100% adaptable a PC y móvil
                  </span>
                  <a
                    href="#comparativa"
                    className="text-sm font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    Ver comparativa
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Ediciones FREE y PRO Explorer */}
        <section id="ediciones" className="py-24 px-6 border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
              <div className="max-w-2xl">
                <p className="text-xs font-medium text-amber-400 mb-3">
                  Dos ediciones · Una sola plataforma
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                  Lanza gratis con FREE o monetiza al máximo con PRO
                </h2>
                <p className="mt-4 text-base text-zinc-400 leading-relaxed">
                  Explora en detalle cada módulo incluido en la Edición FREE (100% gratuita) y
                  todo lo que desbloquea la Edición PRO al activar tu licencia.
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Seleccionar edición"
                className="inline-flex items-center p-1 rounded-lg bg-[#121218] border border-white/[0.08] self-start lg:self-auto"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeEdition === "free"}
                  onClick={() => setActiveEdition("free")}
                  className={`px-5 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeEdition === "free"
                      ? "bg-white text-zinc-950 font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Edición FREE · Gratis
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeEdition === "pro"}
                  onClick={() => setActiveEdition("pro")}
                  className={`px-5 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeEdition === "pro"
                      ? "bg-amber-500 text-zinc-950 font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Edición PRO · Suite Completa
                </button>
              </div>
            </div>

            {activeEdition === "free" ? (
              <div>
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">
                      Edición FREE — 100% funcional desde el primer día
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Ideal para abrir tu servidor con presentación moderna, rápida y segura sin costo inicial.
                    </p>
                  </div>
                  <a
                    href="#precios"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
                  >
                    Descargar versión gratuita
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {FREE_MODULES.map((mod, idx) => (
                    <div
                      key={mod.title}
                      className="bg-[#0d0d12] border border-white/[0.08] rounded-xl p-6"
                    >
                      <div className="font-mono text-xs text-zinc-500 mb-2">
                        0{idx + 1}
                      </div>
                      <h4 className="font-display text-lg font-bold text-white mb-4">
                        {mod.title}
                      </h4>
                      <ul className="space-y-2.5">
                        {mod.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm text-zinc-400 leading-relaxed"
                          >
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">
                      Edición PRO — Suite de Monetización, Gamificación y Diseño
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Incluye todo lo de la Edición FREE y desbloquea los módulos comerciales y de retención diaria.
                    </p>
                  </div>
                  <a
                    href="#precios"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
                  >
                    Ver licencia PRO ($200 único)
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {PRO_MODULES.map((group) => (
                    <div
                      key={group.category}
                      className="bg-[#0d0d12] border border-white/[0.08] rounded-xl p-7 flex flex-col"
                    >
                      <h4 className="font-display text-lg font-bold text-amber-400 pb-4 border-b border-white/[0.08]">
                        {group.category}
                      </h4>
                      <div className="mt-5 space-y-5 flex-1">
                        {group.items.map((item) => (
                          <div key={item.name}>
                            <h5 className="text-sm font-semibold text-white">
                              {item.name}
                            </h5>
                            <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                              {item.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 5: Comparison Matrix FREE vs PRO */}
        <section id="comparativa" className="py-24 px-6 border-b border-white/[0.08] bg-[#0a0a0e]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-medium text-amber-400 mb-3">
                  Comparativa transparente
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Edición FREE frente a Edición PRO
                </h2>
              </div>

              <div className="inline-flex items-center p-1 rounded-lg bg-[#13131a] border border-white/[0.08] self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setTableFilter("all")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    tableFilter === "all"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Todas (14)
                </button>
                <button
                  type="button"
                  onClick={() => setTableFilter("core")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    tableFilter === "core"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  En FREE (6)
                </button>
                <button
                  type="button"
                  onClick={() => setTableFilter("pro")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    tableFilter === "pro"
                      ? "bg-amber-500/20 text-amber-300"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Exclusivas PRO (8)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0d0d12]">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#111118] text-xs font-semibold text-zinc-400">
                    <th className="py-4 px-6">Característica o módulo</th>
                    <th className="py-4 px-6 w-40 text-center">Edición FREE</th>
                    <th className="py-4 px-6 w-40 text-center text-amber-400">
                      Edición PRO
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-sm">
                  {filteredRows.map((row) => (
                    <tr
                      key={row.feature}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-6 text-zinc-200 font-medium">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.free ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                            <Check className="w-4 h-4" />
                            Incluido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                            <Minus className="w-4 h-4" />
                            Solo PRO
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                          <Check className="w-4 h-4" />
                          Incluido
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 6: Pricing Plans */}
        <section id="precios" className="py-24 px-6 border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs font-medium text-amber-400 mb-3">
                Licenciamiento simple · Sin mensualidades ocultas
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Elige la edición ideal para tu servidor
              </h2>
              <p className="mt-4 text-base text-zinc-400 leading-relaxed">
                Empieza sin inversión con la Edición FREE o activa la licencia PRO vitalicia
                cuando necesites WebShop, Mercado P2P, donaciones y personalización avanzada.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Plan 1: FREE */}
              <div className="bg-[#0d0d12] border border-white/[0.08] rounded-xl p-8 flex flex-col">
                <p className="text-xs font-medium text-zinc-400">Para arrancar hoy</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">
                  Edición FREE
                </h3>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-bold text-white tabular-nums">
                    $0
                  </span>
                  <span className="text-sm text-zinc-400">gratis para siempre</span>
                </div>
                <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                  Todo lo necesario para lanzar tu servidor de MU Online con velocidad,
                  rankings completos, UCP y Panel Admin v4.1.2.
                </p>

                <ul className="mt-7 space-y-3 text-sm text-zinc-300 flex-1 border-t border-white/[0.08] pt-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Portal, Noticias, Rankings, Castle Siege y Eventos</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Panel UCP completo y ACP v4.1.2 con Bans IP/HWID</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Multi-emulador S6 – S21 e instalador web en 4 pasos</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Actualizable a PRO en 1 clic sin perder datos</span>
                  </li>
                </ul>

                <div className="mt-8">
                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-white/[0.06] border border-white/12 hover:bg-white/[0.12] transition-colors whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Edición FREE
                    </a>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-white/[0.06] border border-white/12 hover:bg-white/[0.12] transition-colors whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      Obtener Edición FREE
                    </Link>
                  )}
                </div>
              </div>

              {/* Plan 2: PRO Lifetime (Single Dominant Focus) */}
              <div className="bg-[#121218] border border-amber-500/45 rounded-xl p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-amber-500" />
                <p className="text-xs font-medium text-amber-400">
                  Recomendado · Licencia vitalicia
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">
                  Licencia PRO
                </h3>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-bold text-white tabular-nums">
                    $200
                  </span>
                  <span className="text-sm text-zinc-400">pago único</span>
                </div>
                <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                  La licencia definitiva para proyectos serios. Desbloquea WebShop S6–S21,
                  Mercado P2P, donaciones, gamificación y Estudio de Diseño PRO.
                </p>

                <ul className="mt-7 space-y-3 text-sm text-zinc-200 flex-1 border-t border-white/[0.08] pt-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Licencia PRO de por vida sin renovaciones</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Todos los módulos de monetización, VIP y gamificación</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Estudio de Diseño PRO, Tickets y Servicios S21</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Instalación remota gratuita y soporte prioritario</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>1 dominio o IP modificable desde tu Área de Cliente</span>
                  </li>
                </ul>

                <div className="mt-8 space-y-3">
                  <a
                    href={makeWhatsappLink(
                      "Hola, quiero adquirir la Licencia PRO Vitalicia ($200) de Onyx CMS v4.1.2"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors whitespace-nowrap"
                  >
                    Adquirir Licencia PRO
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    to="/login?mode=register"
                    className="block text-center text-xs text-zinc-400 hover:text-amber-300 transition-colors py-1"
                  >
                    Regístrate primero en el portal para activar tu licencia
                  </Link>
                </div>
              </div>

              {/* Plan 3: Reseller */}
              <div className="bg-[#0d0d12] border border-white/[0.08] rounded-xl p-8 flex flex-col">
                <p className="text-xs font-medium text-zinc-400">
                  Desarrolladores y revendedores
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">
                  Plan Reseller
                </h3>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-bold text-white">
                    A medida
                  </span>
                </div>
                <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                  Para estudios, hostings y desarrolladores de servidores MU Online que
                  desean distribuir Onyx CMS PRO a sus clientes.
                </p>

                <ul className="mt-7 space-y-3 text-sm text-zinc-300 flex-1 border-t border-white/[0.08] pt-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Paquetes de licencias PRO a precio preferencial</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Panel propio para emitir, editar y revocar licencias</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Opción de marca blanca disponible</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Soporte técnico directo Nivel 2</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <a
                    href={makeWhatsappLink(
                      "Hola, estoy interesado en activar el Plan Reseller de Onyx CMS v4.1.2"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-white/[0.06] border border-white/12 hover:bg-white/[0.12] transition-colors whitespace-nowrap"
                  >
                    Consultar Plan Reseller
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Technical Requirements + Quick Deploy + FAQ */}
        <section id="requisitos" className="py-24 px-6 bg-[#0a0a0e]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Technical Requirements */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <p className="text-xs font-medium text-amber-400 mb-3">
                  Requisitos técnicos y despliegue
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                  Operativo en tu VPS en minutos
                </h2>
                <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
                  Sin dependencias rotas ni configuraciones complejas. Compatible con
                  entornos Windows Server y Linux.
                </p>
              </div>

              <dl className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                <div className="py-4 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-sm font-medium text-zinc-400">Servidor</dt>
                  <dd className="text-sm text-white sm:text-right">
                    VPS Windows / Linux o Hosting Node.js
                  </dd>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-sm font-medium text-zinc-400">Node.js</dt>
                  <dd className="text-sm font-mono text-white sm:text-right tabular-nums">
                    v18, v20, v22 o v24+
                  </dd>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-sm font-medium text-zinc-400">Base de Datos</dt>
                  <dd className="text-sm text-white sm:text-right">
                    Microsoft SQL Server (2008 R2 – 2022)
                  </dd>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-sm font-medium text-zinc-400">Emuladores</dt>
                  <dd className="text-sm text-white sm:text-right">
                    MuDevs S6–S21, Louis, IGCN, MuEmu, ZTeam, TitanTech
                  </dd>
                </div>
              </dl>

              <div className="rounded-xl border border-white/[0.08] bg-[#0d0d12] p-6">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-4">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>Flujo de instalación limpia</span>
                </div>
                <ol className="space-y-3 text-sm text-zinc-300 font-mono">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400">01.</span>
                    <span>Sube los archivos empaquetados a tu VPS</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400">02.</span>
                    <span>Ejecuta node app.js (o pm2 start app.js)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400">03.</span>
                    <span>Abre /install en tu navegador y conecta tu SQL</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="lg:col-span-7">
              <p className="text-xs font-medium text-amber-400 mb-3">
                Preguntas frecuentes
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-8">
                Dudas comunes antes de instalar
              </h2>

              <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                {FAQ_ITEMS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={faq.question} className="py-5">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-4 text-left"
                      >
                        <span className="text-base font-semibold text-white">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-150 ${
                            isOpen ? "rotate-180 text-amber-400" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed pr-8">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#0d0d12] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    ¿Tienes dudas sobre tu emulador o migración?
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Escríbenos directamente por WhatsApp y te asesoramos con tu configuración SQL.
                  </p>
                </div>
                <a
                  href={makeWhatsappLink(
                    "Hola, tengo una consulta sobre Onyx CMS v4.1.2"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-zinc-950 bg-amber-500 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0"
                >
                  Contactar soporte
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-white/[0.08] bg-[#070709] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2.5 text-zinc-200 font-display font-bold">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Onyx CMS</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <a href="#arquitectura" className="hover:text-white transition-colors">
              Arquitectura
            </a>
            <a href="#ediciones" className="hover:text-white transition-colors">
              FREE y PRO
            </a>
            <a href="#comparativa" className="hover:text-white transition-colors">
              Comparativa
            </a>
            <a href="#precios" className="hover:text-white transition-colors">
              Precios
            </a>
            <Link to="/login" className="hover:text-amber-400 transition-colors">
              Área de Cliente
            </Link>
            <a
              href={makeWhatsappLink(
                "Hola, necesito soporte con Onyx CMS v4.1.2"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              WhatsApp
            </a>
          </div>

          <p className="text-xs text-zinc-500">
            © 2026 Onyx CMS. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
