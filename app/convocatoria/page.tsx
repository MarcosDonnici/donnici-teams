"use client";

import Link from "next/link";
import {
  DragEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type EstadoJugador =
  | "Disponible"
  | "Molestias"
  | "Lesionado"
  | "Ausente";

type OrigenJugador =
  | "Plantilla"
  | "Juvenil";

type Jugador = {
  id: number;
  nombre: string;
  dorsal?: string;
  demarcacion: string;
  pie: string;
  origen: OrigenJugador;
  seleccionado: boolean;
  estado: EstadoJugador;
};

type Entrenamiento = {
  fecha: string;
  jugadores: Jugador[];
};

type PosicionJugador = {
  izquierda: number;
  arriba: number;
};

type Sistema =
  | "Libre"
  | "1-4-4-2"
  | "1-4-3-3"
  | "1-4-2-3-1"
  | "1-4-1-4-1"
  | "1-4-4-1-1"
  | "1-4-3-1-2"
  | "1-4-1-2-1-2"
  | "1-3-5-2"
  | "1-3-4-3"
  | "1-3-4-2-1"
  | "1-3-1-4-2"
  | "1-5-3-2"
  | "1-5-4-1"
  | "1-5-2-2-1"
  | "1-5-1-3-1";

type Filtro =
  | "Todos"
  | EstadoJugador;

type ConvocatoriaGuardada = {
  sistema: Sistema;
  posiciones: Record<
    string,
    PosicionJugador
  >;
};

type PuntoGuia = {
  id: string;
  izquierda: number;
  arriba: number;
};

const CLAVE_ENTRENAMIENTO =
  "donnici-teams-entrenamiento-actual";

const CLAVE_CONVOCATORIA =
  "donnici-teams-convocatoria-tactica-libre";

const SISTEMAS: Sistema[] = [
  "Libre",
  "1-4-4-2",
  "1-4-3-3",
  "1-4-2-3-1",
  "1-4-1-4-1",
  "1-4-4-1-1",
  "1-4-3-1-2",
  "1-4-1-2-1-2",
  "1-3-5-2",
  "1-3-4-3",
  "1-3-4-2-1",
  "1-3-1-4-2",
  "1-5-3-2",
  "1-5-4-1",
  "1-5-2-2-1",
  "1-5-1-3-1",
];

const FILTROS: Filtro[] = [
  "Todos",
  "Disponible",
  "Molestias",
  "Lesionado",
  "Ausente",
];

function claveJugador(
  jugador: Jugador,
) {
  return `${jugador.origen}-${jugador.id}`;
}

function limitar(
  valor: number,
  minimo: number,
  maximo: number,
) {
  return Math.min(
    Math.max(valor, minimo),
    maximo,
  );
}

function crearFila(
  cantidad: number,
  arriba: number,
  prefijo: string,
) {
  if (cantidad <= 0) {
    return [] as PuntoGuia[];
  }

  if (cantidad === 1) {
    return [
      {
        id: `${prefijo}-1`,
        izquierda: 50,
        arriba,
      },
    ];
  }

  const margen =
    cantidad >= 5
      ? 10
      : cantidad === 4
        ? 15
        : cantidad === 3
          ? 24
          : 37;

  const espacio =
    (100 - margen * 2) /
    (cantidad - 1);

  return Array.from(
    { length: cantidad },
    (_, indice) => ({
      id: `${prefijo}-${indice}`,
      izquierda:
        margen + espacio * indice,
      arriba,
    }),
  );
}

function crearGuia(
  sistema: Sistema,
) {
  if (sistema === "Libre") {
    return [] as PuntoGuia[];
  }

  const lineas = sistema
    .split("-")
    .map(Number)
    .filter(Number.isFinite);

  return lineas.flatMap(
    (cantidad, indice) => {
      const arriba =
        lineas.length === 1
          ? 50
          : 90 -
            (indice * 78) /
              (lineas.length - 1);

      return crearFila(
        cantidad,
        arriba,
        `linea-${indice}`,
      );
    },
  );
}

function obtenerEstiloJugador(
  jugador: Jugador,
) {
  if (
    jugador.estado === "Molestias"
  ) {
    return {
      ficha:
        "border-amber-200 bg-amber-400 text-slate-950",
      lista:
        "border-amber-400/40 bg-amber-400/10 text-amber-200",
      punto: "bg-amber-400",
    };
  }

  if (
    jugador.estado === "Lesionado"
  ) {
    return {
      ficha:
        "border-red-200 bg-red-600 text-white",
      lista:
        "border-red-400/40 bg-red-500/10 text-red-200",
      punto: "bg-red-500",
    };
  }

  if (
    jugador.estado === "Ausente"
  ) {
    return {
      ficha:
        "border-slate-300 bg-slate-600 text-white",
      lista:
        "border-slate-400/30 bg-slate-500/10 text-slate-300",
      punto: "bg-slate-400",
    };
  }

  if (
    jugador.origen === "Juvenil"
  ) {
    return {
      ficha:
        "border-violet-200 bg-violet-600 text-white",
      lista:
        "border-violet-400/40 bg-violet-500/10 text-violet-200",
      punto: "bg-violet-400",
    };
  }

  return {
    ficha:
      "border-cyan-100 bg-cyan-600 text-white",
    lista:
      "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
    punto: "bg-cyan-400",
  };
}

function obtenerEtiquetaFiltro(
  filtro: Filtro,
) {
  if (filtro === "Disponible") {
    return "Disponibles";
  }

  if (filtro === "Molestias") {
    return "Molestias";
  }

  if (filtro === "Lesionado") {
    return "Lesionados";
  }

  if (filtro === "Ausente") {
    return "Ausentes";
  }

  return "Todos";
}

function crearPosicionesAutomaticas(
  cantidad: number,
) {
  const posiciones:
    PosicionJugador[] = [];

  if (cantidad === 0) {
    return posiciones;
  }

  const columnas =
    cantidad <= 8
      ? 3
      : cantidad <= 15
        ? 4
        : 5;

  const filas = Math.ceil(
    cantidad / columnas,
  );

  for (
    let indice = 0;
    indice < cantidad;
    indice += 1
  ) {
    const columna =
      indice % columnas;

    const fila = Math.floor(
      indice / columnas,
    );

    posiciones.push({
      izquierda:
        12 +
        (columna * 76) /
          (columnas - 1),
      arriba:
        filas === 1
          ? 50
          : 12 +
            (fila * 76) /
              (filas - 1),
    });
  }

  return posiciones;
}

export default function ConvocatoriaPage() {
  const campoRef =
    useRef<HTMLDivElement | null>(null);

  const [
    entrenamiento,
    setEntrenamiento,
  ] = useState<Entrenamiento>({
    fecha: "",
    jugadores: [],
  });

  const [sistema, setSistema] =
    useState<Sistema>("Libre");

  const [filtro, setFiltro] =
    useState<Filtro>("Todos");

  const [
    posiciones,
    setPosiciones,
  ] = useState<
    Record<string, PosicionJugador>
  >({});

  const [
    jugadorSeleccionado,
    setJugadorSeleccionado,
  ] = useState<string | null>(null);

  const [
    jugadorMoviendose,
    setJugadorMoviendose,
  ] = useState<string | null>(null);

  const [cargado, setCargado] =
    useState(false);

  const [
    guardadoVisible,
    setGuardadoVisible,
  ] = useState(false);

  useEffect(() => {
    const entrenamientoGuardado =
      localStorage.getItem(
        CLAVE_ENTRENAMIENTO,
      );

    if (entrenamientoGuardado) {
      try {
        const datos = JSON.parse(
          entrenamientoGuardado,
        ) as Partial<Entrenamiento>;

        setEntrenamiento({
          fecha: datos.fecha || "",
          jugadores: Array.isArray(
            datos.jugadores,
          )
            ? datos.jugadores
            : [],
        });
      } catch {
        setEntrenamiento({
          fecha: "",
          jugadores: [],
        });
      }
    }

    const convocatoriaGuardada =
      localStorage.getItem(
        CLAVE_CONVOCATORIA,
      );

    if (convocatoriaGuardada) {
      try {
        const datos = JSON.parse(
          convocatoriaGuardada,
        ) as Partial<ConvocatoriaGuardada>;

        if (
          datos.sistema &&
          SISTEMAS.includes(
            datos.sistema,
          )
        ) {
          setSistema(datos.sistema);
        }

        if (
          datos.posiciones &&
          typeof datos.posiciones ===
            "object"
        ) {
          setPosiciones(
            datos.posiciones,
          );
        }
      } catch {
        setPosiciones({});
      }
    }

    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) {
      return;
    }

    localStorage.setItem(
      CLAVE_ENTRENAMIENTO,
      JSON.stringify(entrenamiento),
    );

    localStorage.setItem(
      CLAVE_CONVOCATORIA,
      JSON.stringify({
        sistema,
        posiciones,
      }),
    );
  }, [
    cargado,
    entrenamiento,
    sistema,
    posiciones,
  ]);

  const jugadores =
    useMemo(
      () =>
        entrenamiento.jugadores.filter(
          (jugador) =>
            jugador.seleccionado,
        ),
      [entrenamiento.jugadores],
    );

  const mapaJugadores =
    useMemo(
      () =>
        new Map(
          jugadores.map(
            (jugador) => [
              claveJugador(jugador),
              jugador,
            ],
          ),
        ),
      [jugadores],
    );

  const jugadoresFiltrados =
    useMemo(
      () =>
        jugadores.filter(
          (jugador) =>
            filtro === "Todos" ||
            jugador.estado === filtro,
        ),
      [jugadores, filtro],
    );

  const jugadoresEnCampo =
    useMemo(
      () =>
        jugadores.filter(
          (jugador) =>
            Boolean(
              posiciones[
                claveJugador(jugador)
              ],
            ),
        ),
      [jugadores, posiciones],
    );

  const guia =
    useMemo(
      () => crearGuia(sistema),
      [sistema],
    );

  const jugadorActivo =
    jugadorSeleccionado
      ? mapaJugadores.get(
          jugadorSeleccionado,
        )
      : undefined;

  const conteos = useMemo(
    () => ({
      disponibles:
        jugadores.filter(
          (jugador) =>
            jugador.estado ===
            "Disponible",
        ).length,
      molestias:
        jugadores.filter(
          (jugador) =>
            jugador.estado ===
            "Molestias",
        ).length,
      lesionados:
        jugadores.filter(
          (jugador) =>
            jugador.estado ===
            "Lesionado",
        ).length,
      ausentes:
        jugadores.filter(
          (jugador) =>
            jugador.estado ===
            "Ausente",
        ).length,
    }),
    [jugadores],
  );

  function calcularPosicion(
    clienteX: number,
    clienteY: number,
  ) {
    const campo = campoRef.current;

    if (!campo) {
      return null;
    }

    const rectangulo =
      campo.getBoundingClientRect();

    return {
      izquierda: limitar(
        ((clienteX -
          rectangulo.left) /
          rectangulo.width) *
          100,
        4,
        96,
      ),
      arriba: limitar(
        ((clienteY -
          rectangulo.top) /
          rectangulo.height) *
          100,
        3,
        97,
      ),
    };
  }

  function colocarJugador(
    clave: string,
    posicion: PosicionJugador,
  ) {
    if (!mapaJugadores.has(clave)) {
      return;
    }

    setPosiciones((actuales) => ({
      ...actuales,
      [clave]: posicion,
    }));

    setJugadorSeleccionado(clave);
  }

  function colocarAutomaticamente(
    clave: string,
  ) {
    const cantidad =
      Object.keys(posiciones).length;

    const columna = cantidad % 5;
    const fila =
      Math.floor(cantidad / 5) % 7;

    colocarJugador(clave, {
      izquierda:
        14 + columna * 18,
      arriba: 13 + fila * 12,
    });
  }

  function quitarDelCampo(
    clave: string,
  ) {
    setPosiciones((actuales) => {
      const nuevas = {
        ...actuales,
      };

      delete nuevas[clave];

      return nuevas;
    });

    if (
      jugadorSeleccionado === clave
    ) {
      setJugadorSeleccionado(null);
    }
  }

  function cambiarEstado(
    clave: string,
    estado: EstadoJugador,
  ) {
    setEntrenamiento((actual) => ({
      ...actual,
      jugadores:
        actual.jugadores.map(
          (jugador) =>
            claveJugador(jugador) ===
            clave
              ? {
                  ...jugador,
                  estado,
                }
              : jugador,
        ),
    }));

    if (
      estado === "Lesionado" ||
      estado === "Ausente"
    ) {
      quitarDelCampo(clave);
    }
  }

  function iniciarArrastre(
    evento: DragEvent,
    clave: string,
  ) {
    evento.dataTransfer.setData(
      "text/plain",
      clave,
    );

    evento.dataTransfer.effectAllowed =
      "move";
  }

  function recibirEnCampo(
    evento: DragEvent<HTMLDivElement>,
  ) {
    evento.preventDefault();

    const clave =
      evento.dataTransfer.getData(
        "text/plain",
      );

    const posicion =
      calcularPosicion(
        evento.clientX,
        evento.clientY,
      );

    if (clave && posicion) {
      colocarJugador(
        clave,
        posicion,
      );
    }
  }

  function iniciarMovimiento(
    evento: ReactPointerEvent,
    clave: string,
  ) {
    evento.preventDefault();
    evento.stopPropagation();

    setJugadorSeleccionado(clave);
    setJugadorMoviendose(clave);

    evento.currentTarget.setPointerCapture(
      evento.pointerId,
    );
  }

  function moverJugador(
    evento: ReactPointerEvent,
  ) {
    if (!jugadorMoviendose) {
      return;
    }

    const posicion =
      calcularPosicion(
        evento.clientX,
        evento.clientY,
      );

    if (!posicion) {
      return;
    }

    setPosiciones((actuales) => ({
      ...actuales,
      [jugadorMoviendose]:
        posicion,
    }));
  }

  function terminarMovimiento() {
    setJugadorMoviendose(null);
  }

  function colocarTodos() {
    const jugadoresActivos =
      jugadores.filter(
        (jugador) =>
          jugador.estado !==
            "Lesionado" &&
          jugador.estado !==
            "Ausente",
      );

    const posicionesNuevas =
      crearPosicionesAutomaticas(
        jugadoresActivos.length,
      );

    const resultado:
      Record<
        string,
        PosicionJugador
      > = {};

    jugadoresActivos.forEach(
      (jugador, indice) => {
        resultado[
          claveJugador(jugador)
        ] = posicionesNuevas[indice];
      },
    );

    setPosiciones(resultado);
    setJugadorSeleccionado(null);
  }

  function aplicarSistema() {
    if (sistema === "Libre") {
      return;
    }

    const jugadoresActivos =
      jugadores.filter(
        (jugador) =>
          jugador.estado ===
            "Disponible" ||
          jugador.estado ===
            "Molestias",
      );

    const nuevas = {
      ...posiciones,
    };

    jugadoresActivos
      .slice(0, guia.length)
      .forEach(
        (jugador, indice) => {
          nuevas[
            claveJugador(jugador)
          ] = {
            izquierda:
              guia[indice].izquierda,
            arriba:
              guia[indice].arriba,
          };
        },
      );

    setPosiciones(nuevas);
  }

  function vaciarCampo() {
    if (
      Object.keys(posiciones).length ===
      0
    ) {
      return;
    }

    const confirmar =
      window.confirm(
        "¿Quieres vaciar el campo?",
      );

    if (!confirmar) {
      return;
    }

    setPosiciones({});
    setJugadorSeleccionado(null);
  }

  function guardar() {
    localStorage.setItem(
      CLAVE_CONVOCATORIA,
      JSON.stringify({
        sistema,
        posiciones,
      }),
    );

    localStorage.setItem(
      CLAVE_ENTRENAMIENTO,
      JSON.stringify(entrenamiento),
    );

    setGuardadoVisible(true);

    window.setTimeout(() => {
      setGuardadoVisible(false);
    }, 1800);
  }

  if (!cargado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b12] text-white">
        <p className="font-bold text-slate-300">
          Cargando convocatoria...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <header className="border-b border-white/10 bg-[#0b111b]">
        <div className="mx-auto flex max-w-[1900px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
            >
              ←
            </Link>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                Donnici Teams
              </p>

              <h1 className="font-black">
                Convocatoria
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-500 sm:block">
              {jugadoresEnCampo.length} en
              campo
            </span>

            <Link
              href="/equipos"
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-300"
            >
              Equipos →
            </Link>
          </div>
        </div>
      </header>

      {jugadores.length === 0 ? (
        <section className="mx-auto mt-10 max-w-xl rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
          <h2 className="text-2xl font-black">
            No hay jugadores
            seleccionados
          </h2>

          <p className="mt-2 text-slate-400">
            Selecciona los jugadores del
            entrenamiento antes de abrir la
            convocatoria.
          </p>

          <Link
            href="/entrenamiento"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950"
          >
            Seleccionar jugadores
          </Link>
        </section>
      ) : (
        <div className="mx-auto grid max-w-[1900px] gap-3 p-3 xl:h-[calc(100vh-65px)] xl:grid-cols-[260px_minmax(600px,1fr)_280px]">
          <aside className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-[#0b111b]">
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Jugadores
                  </p>

                  <h2 className="mt-1 font-black">
                    {jugadores.length} convocados
                  </h2>
                </div>

                <Link
                  href="/entrenamiento"
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  Editar
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {FILTROS.map(
                  (opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() =>
                        setFiltro(opcion)
                      }
                      className={`rounded-lg px-2.5 py-1.5 text-[10px] font-black transition ${
                        filtro === opcion
                          ? "bg-white text-slate-950"
                          : "bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {obtenerEtiquetaFiltro(
                        opcion,
                      )}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-3">
              {jugadoresFiltrados.map(
                (jugador) => {
                  const clave =
                    claveJugador(jugador);

                  const enCampo =
                    Boolean(
                      posiciones[clave],
                    );

                  const estilos =
                    obtenerEstiloJugador(
                      jugador,
                    );

                  return (
                    <div
                      key={clave}
                      draggable
                      onDragStart={(evento) =>
                        iniciarArrastre(
                          evento,
                          clave,
                        )
                      }
                      className={`flex cursor-grab items-center gap-2 rounded-lg border px-2 py-2 active:cursor-grabbing ${
                        jugadorSeleccionado ===
                        clave
                          ? "border-white/70 bg-white/10"
                          : estilos.lista
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${estilos.punto}`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setJugadorSeleccionado(
                            clave,
                          )
                        }
                        className="min-w-0 flex-1 truncate text-left text-xs font-black"
                      >
                        {jugador.nombre}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          enCampo
                            ? quitarDelCampo(
                                clave,
                              )
                            : colocarAutomaticamente(
                                clave,
                              )
                        }
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-black ${
                          enCampo
                            ? "bg-red-500/15 text-red-300 hover:bg-red-500/25"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {enCampo ? "−" : "+"}
                      </button>
                    </div>
                  );
                },
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3 text-[10px] font-bold">
              <Leyenda
                color="bg-cyan-500"
                texto="Primer equipo"
              />

              <Leyenda
                color="bg-violet-500"
                texto="Juvenil"
              />

              <Leyenda
                color="bg-amber-400"
                texto="Molestias"
              />

              <Leyenda
                color="bg-red-500"
                texto="Lesionado"
              />

              <Leyenda
                color="bg-slate-500"
                texto="Ausente"
              />
            </div>
          </aside>

          <section className="flex min-h-[650px] min-w-0 flex-col rounded-2xl border border-white/10 bg-[#0b111b] p-3 xl:min-h-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
                  Campo táctico
                </p>

                <h2 className="font-black">
                  {sistema === "Libre"
                    ? "Campo libre"
                    : sistema}
                </h2>
              </div>

              <p className="text-xs text-slate-500">
                Arrastra y mueve libremente
              </p>
            </div>

            <div
              ref={campoRef}
              onDragOver={(evento) =>
                evento.preventDefault()
              }
              onDrop={recibirEnCampo}
              onPointerMove={
                moverJugador
              }
              onPointerUp={
                terminarMovimiento
              }
              onPointerCancel={
                terminarMovimiento
              }
              onClick={(evento) => {
                if (
                  !jugadorSeleccionado
                ) {
                  return;
                }

                const posicion =
                  calcularPosicion(
                    evento.clientX,
                    evento.clientY,
                  );

                if (posicion) {
                  colocarJugador(
                    jugadorSeleccionado,
                    posicion,
                  );
                }
              }}
              className="relative mx-auto h-full min-h-[580px] w-full max-w-[850px] touch-none overflow-hidden rounded-2xl border-2 border-white/80 bg-gradient-to-b from-emerald-700 to-emerald-900 shadow-2xl shadow-black/40"
            >
              <LineasCampo />

              {guia.map((punto) => (
                <div
                  key={punto.id}
                  style={{
                    left: `${punto.izquierda}%`,
                    top: `${punto.arriba}%`,
                  }}
                  className="pointer-events-none absolute z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/35 bg-black/5"
                />
              ))}

              {jugadoresEnCampo.map(
                (jugador) => {
                  const clave =
                    claveJugador(jugador);

                  const posicion =
                    posiciones[clave];

                  const estilos =
                    obtenerEstiloJugador(
                      jugador,
                    );

                  return (
                    <button
                      key={clave}
                      type="button"
                      onPointerDown={(
                        evento,
                      ) =>
                        iniciarMovimiento(
                          evento,
                          clave,
                        )
                      }
                      onDoubleClick={() =>
                        quitarDelCampo(
                          clave,
                        )
                      }
                      style={{
                        left: `${posicion.izquierda}%`,
                        top: `${posicion.arriba}%`,
                      }}
                      className={`absolute z-30 flex h-8 max-w-[120px] -translate-x-1/2 -translate-y-1/2 cursor-grab select-none items-center justify-center truncate rounded-lg border-2 px-2 text-[10px] font-black shadow-lg hover:z-40 hover:scale-105 active:cursor-grabbing sm:max-w-[145px] sm:text-xs ${estilos.ficha} ${
                        jugadorSeleccionado ===
                        clave
                          ? "ring-2 ring-white ring-offset-2 ring-offset-emerald-800"
                          : ""
                      }`}
                    >
                      <span className="truncate">
                        {jugador.nombre}
                      </span>
                    </button>
                  );
                },
              )}

              {jugadoresEnCampo.length ===
                0 && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="rounded-xl bg-black/25 px-5 py-3 text-center backdrop-blur-sm">
                    <p className="font-black">
                      Campo vacío
                    </p>

                    <p className="mt-1 text-xs text-white/70">
                      Arrastra jugadores desde
                      la izquierda
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="flex min-h-0 flex-col gap-3">
            <section className="rounded-2xl border border-white/10 bg-[#0b111b] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Sistema
              </p>

              <select
                value={sistema}
                onChange={(evento) =>
                  setSistema(
                    evento.target
                      .value as Sistema,
                  )
                }
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#151c28] px-3 py-2.5 text-sm font-black outline-none focus:border-cyan-400"
              >
                {SISTEMAS.map(
                  (opcion) => (
                    <option
                      key={opcion}
                      value={opcion}
                    >
                      {opcion === "Libre"
                        ? "Campo libre"
                        : opcion}
                    </option>
                  ),
                )}
              </select>

              <button
                type="button"
                onClick={aplicarSistema}
                disabled={
                  sistema === "Libre"
                }
                className="mt-2 w-full rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2.5 text-xs font-black text-cyan-300 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Aplicar sistema
              </button>

              <button
                type="button"
                onClick={colocarTodos}
                className="mt-2 w-full rounded-lg bg-violet-500 px-3 py-2.5 text-xs font-black text-white hover:bg-violet-400"
              >
                Colocar a todos
              </button>

              <button
                type="button"
                onClick={vaciarCampo}
                className="mt-2 w-full rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-xs font-black text-red-300 hover:bg-red-500/20"
              >
                Vaciar campo
              </button>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#0b111b] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Jugador seleccionado
              </p>

              {jugadorActivo ? (
                <>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        obtenerEstiloJugador(
                          jugadorActivo,
                        ).punto
                      }`}
                    />

                    <p className="truncate text-sm font-black">
                      {
                        jugadorActivo.nombre
                      }
                    </p>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-[10px] font-black uppercase text-slate-500">
                      Estado
                    </span>

                    <select
                      value={
                        jugadorActivo.estado
                      }
                      onChange={(evento) =>
                        cambiarEstado(
                          claveJugador(
                            jugadorActivo,
                          ),
                          evento.target
                            .value as EstadoJugador,
                        )
                      }
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#151c28] px-3 py-2.5 text-sm font-bold outline-none"
                    >
                      <option value="Disponible">
                        Disponible
                      </option>

                      <option value="Molestias">
                        Molestias
                      </option>

                      <option value="Lesionado">
                        Lesionado
                      </option>

                      <option value="Ausente">
                        Ausente
                      </option>
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const clave =
                        claveJugador(
                          jugadorActivo,
                        );

                      posiciones[clave]
                        ? quitarDelCampo(
                            clave,
                          )
                        : colocarAutomaticamente(
                            clave,
                          );
                    }}
                    className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-black hover:bg-white/10"
                  >
                    {posiciones[
                      claveJugador(
                        jugadorActivo,
                      )
                    ]
                      ? "Sacar del campo"
                      : "Añadir al campo"}
                  </button>
                </>
              ) : (
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Pulsa un jugador de la lista
                  o una ficha del campo.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#0b111b] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Estado de la sesión
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <MiniDato
                  valor={
                    conteos.disponibles
                  }
                  texto="Disponibles"
                  clase="text-emerald-300"
                />

                <MiniDato
                  valor={
                    conteos.molestias
                  }
                  texto="Molestias"
                  clase="text-amber-300"
                />

                <MiniDato
                  valor={
                    conteos.lesionados
                  }
                  texto="Lesionados"
                  clase="text-red-300"
                />

                <MiniDato
                  valor={conteos.ausentes}
                  texto="Ausentes"
                  clase="text-slate-300"
                />
              </div>
            </section>

            <section className="mt-auto rounded-2xl border border-white/10 bg-[#0b111b] p-4">
              <button
                type="button"
                onClick={guardar}
                className="w-full rounded-lg bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-300"
              >
                Guardar
              </button>

              {guardadoVisible && (
                <p className="mt-2 text-center text-xs font-black text-cyan-300">
                  Guardado correctamente
                </p>
              )}

              <p className="mt-3 text-center text-[10px] text-slate-600">
                Doble clic en una ficha para
                sacarla
              </p>
            </section>
          </aside>
        </div>
      )}
    </main>
  );
}

type LeyendaProps = {
  color: string;
  texto: string;
};

function Leyenda({
  color,
  texto,
}: LeyendaProps) {
  return (
    <div className="flex items-center gap-2 text-slate-500">
      <span
        className={`h-2.5 w-2.5 rounded-full ${color}`}
      />

      <span>{texto}</span>
    </div>
  );
}

type MiniDatoProps = {
  valor: number;
  texto: string;
  clase: string;
};

function MiniDato({
  valor,
  texto,
  clase,
}: MiniDatoProps) {
  return (
    <div className="rounded-lg bg-white/[0.04] p-2 text-center">
      <p
        className={`text-xl font-black ${clase}`}
      >
        {valor}
      </p>

      <p className="mt-0.5 text-[9px] font-black uppercase text-slate-600">
        {texto}
      </p>
    </div>
  );
}

function LineasCampo() {
  return (
    <>
      <div className="pointer-events-none absolute inset-3 rounded-xl border-2 border-white/70" />

      <div className="pointer-events-none absolute left-3 right-3 top-1/2 h-0.5 bg-white/70" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />

      <div className="pointer-events-none absolute left-1/2 top-3 h-[15%] w-[45%] -translate-x-1/2 border-2 border-t-0 border-white/70" />

      <div className="pointer-events-none absolute bottom-3 left-1/2 h-[15%] w-[45%] -translate-x-1/2 border-2 border-b-0 border-white/70" />

      <div className="pointer-events-none absolute left-1/2 top-3 h-[7%] w-[21%] -translate-x-1/2 border-2 border-t-0 border-white/70" />

      <div className="pointer-events-none absolute bottom-3 left-1/2 h-[7%] w-[21%] -translate-x-1/2 border-2 border-b-0 border-white/70" />

      <div className="pointer-events-none absolute left-1/2 top-[11%] h-2 w-2 -translate-x-1/2 rounded-full bg-white/70" />

      <div className="pointer-events-none absolute bottom-[11%] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white/70" />

      <div className="pointer-events-none absolute -top-1 left-1/2 h-4 w-[22%] -translate-x-1/2 border-x-2 border-b-2 border-white/70 bg-black/10" />

      <div className="pointer-events-none absolute -bottom-1 left-1/2 h-4 w-[22%] -translate-x-1/2 border-x-2 border-t-2 border-white/70 bg-black/10" />
    </>
  );
}