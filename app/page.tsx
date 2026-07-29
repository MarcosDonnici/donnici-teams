import Link from "next/link";
import Image from "next/image";

type IconoProps = {
  className?: string;
};

type Acceso = {
  titulo: string;
  descripcion: string;
  href: string;
  enlace: string;
  color: string;
  icono: string;
  texto: string;
  Icono: ({ className }: IconoProps) => React.ReactNode;
};

function IconoInicio({
  className = "h-6 w-6",
}: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function IconoPlantilla({
  className = "h-6 w-6",
}: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconoJuveniles({
  className = "h-6 w-6",
}: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 20h18" />
      <path d="m5 16 4-4 3 3 6-7" />
      <path d="M14 8h4v4" />
    </svg>
  );
}

function IconoEntrenamiento({
  className = "h-6 w-6",
}: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m12 7 3 2.2-1.1 3.5h-3.8L9 9.2 12 7Z" />
      <path d="m4.8 9.5 4.2-.3" />
      <path d="m15 9.2 4.2.3" />
      <path d="m10.1 12.7-2.4 3.5" />
      <path d="m13.9 12.7 2.4 3.5" />
    </svg>
  );
}

function IconoConvocatoria({
  className = "h-6 w-6",
}: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
      />

      <path d="M12 3v18" />
      <circle cx="12" cy="12" r="3" />
      <path d="M3 8h4v8H3" />
      <path d="M21 8h-4v8h4" />
    </svg>
  );
}

function IconoEquipos({
  className = "h-6 w-6",
}: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <circle cx="12" cy="12" r="2" />
      <path d="M3.8 7h4" />
      <path d="M16.2 17h4" />
    </svg>
  );
}

function IconoHistorial({
  className = "h-6 w-6",
}: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16v-4" />
      <path d="M12 16V8" />
      <path d="M17 16v-7" />
    </svg>
  );
}

function IconoAjustes({
  className = "h-6 w-6",
}: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />

      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20h-3v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7 15.4a1.7 1.7 0 0 0-1.55-1H5v-3h.09a1.7 1.7 0 0 0 1.55-1A1.7 1.7 0 0 0 6.3 8.5l-.06-.06 2.12-2.12.06.06A1.7 1.7 0 0 0 10.3 6a1.7 1.7 0 0 0 1-1.55V4h3v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06A1.7 1.7 0 0 0 19 9.3a1.7 1.7 0 0 0 1.55 1H21v3h-.09a1.7 1.7 0 0 0-1.51 1Z" />
    </svg>
  );
}

function IconoFlecha({
  className = "h-5 w-5",
}: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function IconoCalendario({
  className = "h-6 w-6",
}: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
      />

      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 11h18" />
    </svg>
  );
}

const accesos: Acceso[] = [
  {
    titulo: "Plantilla",
    descripcion:
      "Gestiona los jugadores, dorsales, posiciones y datos de tu equipo.",
    href: "/plantilla",
    enlace: "Ir a plantilla",
    color:
      "border-blue-500/25 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent",
    icono:
      "bg-blue-500 text-white shadow-blue-500/30",
    texto: "text-blue-400",
    Icono: IconoPlantilla,
  },
  {
    titulo: "Juveniles",
    descripcion:
      "Controla y añade jugadores de categorías inferiores a tus sesiones.",
    href: "/juveniles",
    enlace: "Ir a juveniles",
    color:
      "border-emerald-500/25 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent",
    icono:
      "bg-emerald-500 text-white shadow-emerald-500/30",
    texto: "text-emerald-400",
    Icono: IconoJuveniles,
  },
  {
    titulo: "Nuevo entrenamiento",
    descripcion:
      "Selecciona los jugadores disponibles y configura la sesión del día.",
    href: "/entrenamiento",
    enlace: "Crear entrenamiento",
    color:
      "border-orange-500/25 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent",
    icono:
      "bg-orange-500 text-white shadow-orange-500/30",
    texto: "text-orange-400",
    Icono: IconoEntrenamiento,
  },
  {
    titulo: "Convocatoria táctica",
    descripcion:
      "Coloca libremente a todos los jugadores sobre el campo de entrenamiento.",
    href: "/convocatoria",
    enlace: "Abrir convocatoria",
    color:
      "border-cyan-500/25 bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent",
    icono:
      "bg-cyan-500 text-slate-950 shadow-cyan-500/30",
    texto: "text-cyan-400",
    Icono: IconoConvocatoria,
  },
  {
    titulo: "Generar equipos",
    descripcion:
      "Crea equipos equilibrados y organiza los grupos de cada tarea.",
    href: "/equipos",
    enlace: "Generar equipos",
    color:
      "border-violet-500/25 bg-gradient-to-br from-violet-500/20 via-violet-500/10 to-transparent",
    icono:
      "bg-violet-500 text-white shadow-violet-500/30",
    texto: "text-violet-400",
    Icono: IconoEquipos,
  },
];

type EnlaceMenuProps = {
  href: string;
  texto: string;
  Icono: ({
    className,
  }: IconoProps) => React.ReactNode;
  activo?: boolean;
};

function EnlaceMenu({
  href,
  texto,
  Icono,
  activo = false,
}: EnlaceMenuProps) {
  return (
    <Link
      href={href}
      className={
        activo
          ? "flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/15 px-4 py-3 font-bold text-blue-400"
          : "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
      }
    >
      <Icono />
      {texto}
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#081526]/95 lg:flex">
          <div className="flex h-28 items-center gap-4 border-b border-white/10 px-6">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#07111f] p-2 shadow-lg shadow-black/20">
              <Image
                src="/logo-nuevo.png"
                alt="Logo MDA"
                width={120}
                height={120}
                priority
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="font-black tracking-wide">
                DONNICI
              </p>

              <p className="text-sm font-bold text-blue-400">
                TEAMS
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            <EnlaceMenu
              href="/"
              texto="Inicio"
              Icono={IconoInicio}
              activo
            />

            <EnlaceMenu
              href="/plantilla"
              texto="Plantilla"
              Icono={IconoPlantilla}
            />

            <EnlaceMenu
              href="/juveniles"
              texto="Juveniles"
              Icono={IconoJuveniles}
            />

            <EnlaceMenu
              href="/entrenamiento"
              texto="Entrenamientos"
              Icono={IconoEntrenamiento}
            />

            <EnlaceMenu
              href="/convocatoria"
              texto="Convocatoria"
              Icono={IconoConvocatoria}
            />

            <EnlaceMenu
              href="/equipos"
              texto="Equipos"
              Icono={IconoEquipos}
            />

            <button
              type="button"
              className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold text-slate-600"
            >
              <IconoHistorial />
              Historial
            </button>

            <button
              type="button"
              className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold text-slate-600"
            >
              <IconoAjustes />
              Ajustes
            </button>
          </nav>

          <div className="border-t border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
              Donnici Teams
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Versión en desarrollo
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b border-white/10 bg-[#081526]/80 px-5 py-4 backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#07111f] p-1.5">
                  <Image
                    src="/logo-nuevo.png"
                    alt="Logo MDA"
                    width={96}
                    height={96}
                    priority
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <p className="font-black tracking-wider">
                    DONNICI TEAMS
                  </p>

                  <p className="text-xs text-slate-500">
                    SD Compostela
                  </p>
                </div>
              </div>

              <Link
                href="/convocatoria"
                className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-400"
              >
                Convocatoria
              </Link>
            </div>
          </header>

          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[550px] bg-[radial-gradient(circle_at_70%_10%,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.12),transparent_30%)]" />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-[0.04]">
              <div className="absolute left-1/2 top-28 h-96 w-96 -translate-x-1/2 rounded-full border border-white" />

              <div className="absolute left-1/2 top-28 h-96 w-px -translate-x-1/2 bg-white" />

              <div className="absolute left-1/2 top-72 h-px w-full -translate-x-1/2 bg-white" />
            </div>

            <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
              <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
                <div className="flex min-h-[320px] flex-col justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-7 shadow-2xl shadow-black/20 backdrop-blur sm:p-10">
                  <div className="mb-7 flex items-center">
                    <Image
                      src="/logo-nuevo.png"
                      alt="Logo Donnici Teams"
                      width={420}
                      height={180}
                      priority
                      className="h-auto w-[220px] object-contain sm:w-[300px]"
                    />
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-400">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    Panel de entrenamiento
                  </div>

                  <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                    DONNICI{" "}
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      TEAMS
                    </span>
                  </h1>

                  <div className="mt-5 flex items-center gap-3">
                    <span className="h-9 w-1 rounded-full bg-blue-500" />

                    <div>
                      <p className="text-lg font-bold text-slate-200">
                        SD Compostela
                      </p>

                      <p className="text-sm text-slate-500">
                        Gestión deportiva y planificación
                        táctica
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/entrenamiento"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
                    >
                      Crear entrenamiento
                      <IconoFlecha />
                    </Link>

                    <Link
                      href="/convocatoria"
                      className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-bold text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/20"
                    >
                      Abrir convocatoria
                      <IconoConvocatoria className="h-5 w-5" />
                    </Link>

                    <Link
                      href="/equipos"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                    >
                      Generar equipos
                    </Link>
                  </div>
                </div>

                <aside className="rounded-3xl border border-white/10 bg-[#0b192b]/90 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                      <IconoCalendario />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Preparación
                      </p>

                      <p className="font-bold">
                        Nueva sesión
                      </p>
                    </div>
                  </div>

                  <div className="my-6 h-px bg-white/10" />

                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Flujo recomendado
                  </p>

                  <h2 className="mt-3 text-2xl font-black">
                    Prepara tu entrenamiento
                  </h2>

                  <p className="mt-3 leading-7 text-slate-400">
                    Selecciona los jugadores, prepara la
                    convocatoria táctica y genera los equipos
                    de la sesión.
                  </p>

                  <Link
                    href="/entrenamiento"
                    className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold transition hover:bg-white/10"
                  >
                    Empezar ahora

                    <IconoFlecha className="h-5 w-5 text-cyan-400" />
                  </Link>
                </aside>
              </section>

              <section className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {accesos.map((acceso) => {
                  const Icono = acceso.Icono;

                  return (
                    <Link
                      key={acceso.titulo}
                      href={acceso.href}
                      className={`group relative min-h-64 overflow-hidden rounded-3xl border p-6 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-white/20 ${acceso.color}`}
                    >
                      <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/[0.04] blur-2xl" />

                      <div
                        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${acceso.icono}`}
                      >
                        <Icono className="h-7 w-7" />
                      </div>

                      <h2 className="relative mt-6 text-2xl font-black">
                        {acceso.titulo}
                      </h2>

                      <p className="relative mt-3 max-w-sm leading-7 text-slate-400">
                        {acceso.descripcion}
                      </p>

                      <div className="relative mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                        <span
                          className={`font-bold ${acceso.texto}`}
                        >
                          {acceso.enlace}
                        </span>

                        <IconoFlecha
                          className={`h-6 w-6 transition group-hover:translate-x-1 ${acceso.texto}`}
                        />
                      </div>
                    </Link>
                  );
                })}
              </section>

              <section className="mt-5 rounded-3xl border border-white/10 bg-[#0b192b]/80 p-6 shadow-xl shadow-black/10 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-400">
                      Flujo de trabajo
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Prepara la sesión en cuatro pasos
                    </h2>
                  </div>

                  <Link
                    href="/entrenamiento"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500"
                  >
                    Comenzar
                    <IconoFlecha />
                  </Link>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Link
                    href="/entrenamiento"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 font-black text-blue-400">
                      1
                    </span>

                    <h3 className="mt-4 font-black">
                      Entrenamiento
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Elige la fecha, los jugadores y su estado.
                    </p>
                  </Link>

                  <Link
                    href="/convocatoria"
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5 transition hover:bg-cyan-400/[0.08]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 font-black text-cyan-400">
                      2
                    </span>

                    <h3 className="mt-4 font-black">
                      Convocatoria
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Coloca libremente a los jugadores sobre
                      el campo.
                    </p>
                  </Link>

                  <Link
                    href="/equipos"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/15 font-black text-orange-400">
                      3
                    </span>

                    <h3 className="mt-4 font-black">
                      Tareas
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Configura las tareas y los grupos de la
                      sesión.
                    </p>
                  </Link>

                  <Link
                    href="/equipos"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 font-black text-violet-400">
                      4
                    </span>

                    <h3 className="mt-4 font-black">
                      Equipos
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Genera y ajusta los equipos
                      automáticamente.
                    </p>
                  </Link>
                </div>
              </section>

              <section className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-800/60 to-slate-900/60 shadow-xl shadow-black/10">
                <div className="grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr_auto]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-700 text-slate-200 shadow-lg">
                    <IconoHistorial className="h-8 w-8" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black">
                      Historial
                    </h2>

                    <p className="mt-2 max-w-2xl text-slate-400">
                      Consulta entrenamientos anteriores,
                      convocatorias, equipos generados y futuras
                      estadísticas.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-slate-500"
                  >
                    Próximamente
                  </button>
                </div>
              </section>

              <footer className="py-8 text-center text-sm text-slate-600">
                Planifica. Entrena. Mejora.{" "}

                <span className="font-bold text-blue-500">
                  Donnici Teams
                </span>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}