"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type EstadoJugador =
  | "Disponible"
  | "Molestias"
  | "Lesionado"
  | "Ausente";

type OrigenJugador = "Plantilla" | "Juvenil";

type GrupoPosicional =
  | "Portero"
  | "Defensa"
  | "Centrocampista"
  | "Atacante";

type FuncionComodin =
  | "General"
  | "Ofensivo"
  | "Defensivo";

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

type EquipoTarea = {
  id: string;
  nombre: string;
  color: string;
  cantidad: number;
  jugadores: Jugador[];
};

type ComodinTarea = {
  jugador: Jugador;
  funcion: FuncionComodin;
};

type Tarea = {
  id: string;
  nombre: string;
  equipos: EquipoTarea[];
  comodinesSeleccionados: string[];
  funcionComodines: FuncionComodin;
  comodines: ComodinTarea[];
  generada: boolean;
};

type SeleccionIntercambio = {
  equipoId: string;
  jugador: Jugador;
};

const CLAVE_ENTRENAMIENTO =
  "donnici-teams-entrenamiento-actual";

const CLAVE_TAREAS =
  "donnici-teams-tareas";

const COLORES_EQUIPOS = [
  {
    nombre: "Azul",
    circulo: "bg-blue-500",
    cabecera: "bg-blue-600",
    borde: "border-blue-500/50",
    suave: "bg-blue-500/10",
    texto: "text-blue-300",
  },
  {
    nombre: "Rojo",
    circulo: "bg-red-500",
    cabecera: "bg-red-600",
    borde: "border-red-500/50",
    suave: "bg-red-500/10",
    texto: "text-red-300",
  },
  {
    nombre: "Amarillo",
    circulo: "bg-yellow-400",
    cabecera: "bg-yellow-400",
    borde: "border-yellow-400/50",
    suave: "bg-yellow-400/10",
    texto: "text-yellow-300",
  },
  {
    nombre: "Verde",
    circulo: "bg-emerald-500",
    cabecera: "bg-emerald-600",
    borde: "border-emerald-500/50",
    suave: "bg-emerald-500/10",
    texto: "text-emerald-300",
  },
  {
    nombre: "Blanco",
    circulo: "bg-slate-100",
    cabecera: "bg-slate-100",
    borde: "border-slate-300/50",
    suave: "bg-slate-100/10",
    texto: "text-slate-200",
  },
  {
    nombre: "Negro",
    circulo: "bg-slate-950",
    cabecera: "bg-slate-950",
    borde: "border-slate-500/50",
    suave: "bg-slate-700/20",
    texto: "text-slate-300",
  },
  {
    nombre: "Naranja",
    circulo: "bg-orange-500",
    cabecera: "bg-orange-500",
    borde: "border-orange-500/50",
    suave: "bg-orange-500/10",
    texto: "text-orange-300",
  },
  {
    nombre: "Morado",
    circulo: "bg-violet-500",
    cabecera: "bg-violet-600",
    borde: "border-violet-500/50",
    suave: "bg-violet-500/10",
    texto: "text-violet-300",
  },
];

function crearId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function claveJugador(jugador: Jugador) {
  return `${jugador.origen}-${jugador.id}`;
}

function mezclarJugadores(jugadores: Jugador[]) {
  const copia = [...jugadores];

  for (
    let indice = copia.length - 1;
    indice > 0;
    indice--
  ) {
    const posicionAleatoria = Math.floor(
      Math.random() * (indice + 1),
    );

    [copia[indice], copia[posicionAleatoria]] = [
      copia[posicionAleatoria],
      copia[indice],
    ];
  }

  return copia;
}

function obtenerGrupoPosicional(
  demarcacion: string,
): GrupoPosicional {
  const posicion = demarcacion
    .toLowerCase()
    .trim();

  if (
    posicion.includes("portero") ||
    posicion === "por"
  ) {
    return "Portero";
  }

  if (
    posicion.includes("central") ||
    posicion.includes("lateral") ||
    posicion.includes("carrilero") ||
    posicion.includes("defensa")
  ) {
    return "Defensa";
  }

  if (
    posicion.includes("medio") ||
    posicion.includes("interior") ||
    posicion.includes("pivote") ||
    posicion.includes("volante")
  ) {
    return "Centrocampista";
  }

  return "Atacante";
}

function abreviaturaPosicion(
  demarcacion: string,
) {
  const grupo =
    obtenerGrupoPosicional(
      demarcacion,
    );

  if (grupo === "Portero") {
    return "POR";
  }

  if (grupo === "Defensa") {
    return "DEF";
  }

  if (grupo === "Centrocampista") {
    return "MED";
  }

  return "ATA";
}

function contarGrupo(
  jugadores: Jugador[],
  grupo: GrupoPosicional,
) {
  return jugadores.filter(
    (jugador) =>
      obtenerGrupoPosicional(
        jugador.demarcacion,
      ) === grupo,
  ).length;
}

function crearEquipo(indice: number): EquipoTarea {
  const color =
    COLORES_EQUIPOS[
      indice % COLORES_EQUIPOS.length
    ].nombre;

  return {
    id: crearId(),
    nombre: `Equipo ${color}`,
    color,
    cantidad: 4,
    jugadores: [],
  };
}

function crearTarea(indice: number): Tarea {
  return {
    id: crearId(),
    nombre: `Tarea ${indice}`,
    equipos: [
      crearEquipo(0),
      crearEquipo(1),
    ],
    comodinesSeleccionados: [],
    funcionComodines: "General",
    comodines: [],
    generada: false,
  };
}

function obtenerEstiloEquipo(color: string) {
  return (
    COLORES_EQUIPOS.find(
      (elemento) =>
        elemento.nombre === color,
    ) || COLORES_EQUIPOS[0]
  );
}

function calcularPuntuacionEquipo(
  equipo: EquipoTarea,
  grupo: GrupoPosicional,
) {
  if (
    equipo.jugadores.length >=
    equipo.cantidad
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const ocupacion =
    equipo.jugadores.length /
    equipo.cantidad;

  const jugadoresDelGrupo = contarGrupo(
    equipo.jugadores,
    grupo,
  );

  const proporcionGrupo =
    jugadoresDelGrupo / equipo.cantidad;

  let penalizacionPortero = 0;

  if (
    grupo === "Portero" &&
    jugadoresDelGrupo >= 1
  ) {
    penalizacionPortero = 10;
  }

  return (
    ocupacion * 5 +
    proporcionGrupo * 3 +
    penalizacionPortero +
    Math.random() * 0.15
  );
}

function asignarGrupo(
  grupoJugadores: Jugador[],
  equipos: EquipoTarea[],
  grupo: GrupoPosicional,
) {
  grupoJugadores.forEach((jugador) => {
    const equiposConHueco =
      equipos.filter(
        (equipo) =>
          equipo.jugadores.length <
          equipo.cantidad,
      );

    if (
      equiposConHueco.length === 0
    ) {
      return;
    }

    const equiposOrdenados = [
      ...equiposConHueco,
    ].sort(
      (equipoA, equipoB) =>
        calcularPuntuacionEquipo(
          equipoA,
          grupo,
        ) -
        calcularPuntuacionEquipo(
          equipoB,
          grupo,
        ),
    );

    equiposOrdenados[0].jugadores.push(
      jugador,
    );
  });
}

function repartirEquilibrado(
  jugadores: Jugador[],
  equiposOriginales: EquipoTarea[],
) {
  const equipos =
    equiposOriginales.map(
      (equipo) => ({
        ...equipo,
        jugadores: [] as Jugador[],
      }),
    );

  const porteros = mezclarJugadores(
    jugadores.filter(
      (jugador) =>
        obtenerGrupoPosicional(
          jugador.demarcacion,
        ) === "Portero",
    ),
  );

  const defensas = mezclarJugadores(
    jugadores.filter(
      (jugador) =>
        obtenerGrupoPosicional(
          jugador.demarcacion,
        ) === "Defensa",
    ),
  );

  const centrocampistas =
    mezclarJugadores(
      jugadores.filter(
        (jugador) =>
          obtenerGrupoPosicional(
            jugador.demarcacion,
          ) === "Centrocampista",
      ),
    );

  const atacantes = mezclarJugadores(
    jugadores.filter(
      (jugador) =>
        obtenerGrupoPosicional(
          jugador.demarcacion,
        ) === "Atacante",
    ),
  );

  asignarGrupo(
    porteros,
    equipos,
    "Portero",
  );

  asignarGrupo(
    defensas,
    equipos,
    "Defensa",
  );

  asignarGrupo(
    centrocampistas,
    equipos,
    "Centrocampista",
  );

  asignarGrupo(
    atacantes,
    equipos,
    "Atacante",
  );

  return equipos;
}

function formatearFecha(fecha: string) {
  if (!fecha) {
    return "Sin fecha";
  }

  const fechaLocal = new Date(
    `${fecha}T12:00:00`,
  );

  if (
    Number.isNaN(fechaLocal.getTime())
  ) {
    return fecha;
  }

  return new Intl.DateTimeFormat(
    "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(fechaLocal);
}

export default function EquiposPage() {
  const [fecha, setFecha] =
    useState("");

  const [jugadores, setJugadores] =
    useState<Jugador[]>([]);

  const [tareas, setTareas] =
    useState<Tarea[]>([]);

  const [tareaActivaId, setTareaActivaId] =
    useState("");

  const [cargado, setCargado] =
    useState(false);

  useEffect(() => {
    const entrenamientoGuardado =
      localStorage.getItem(
        CLAVE_ENTRENAMIENTO,
      );

    if (entrenamientoGuardado) {
      try {
        const entrenamiento: Entrenamiento =
          JSON.parse(
            entrenamientoGuardado,
          );

        setFecha(
          entrenamiento.fecha || "",
        );

        const seleccionados =
          entrenamiento.jugadores.filter(
            (jugador) =>
              jugador.seleccionado &&
              (jugador.estado ===
                "Disponible" ||
                jugador.estado ===
                  "Molestias"),
          );

        setJugadores(seleccionados);
      } catch {
        setJugadores([]);
      }
    }

    const tareasGuardadas =
      localStorage.getItem(
        CLAVE_TAREAS,
      );

    if (tareasGuardadas) {
      try {
        const tareasRecuperadas: Tarea[] =
          JSON.parse(tareasGuardadas);

        if (
          tareasRecuperadas.length > 0
        ) {
          setTareas(
            tareasRecuperadas,
          );

          setTareaActivaId(
            tareasRecuperadas[0].id,
          );
        } else {
          const inicial =
            crearTarea(1);

          setTareas([inicial]);
          setTareaActivaId(
            inicial.id,
          );
        }
      } catch {
        const inicial =
          crearTarea(1);

        setTareas([inicial]);
        setTareaActivaId(
          inicial.id,
        );
      }
    } else {
      const inicial =
        crearTarea(1);

      setTareas([inicial]);
      setTareaActivaId(
        inicial.id,
      );
    }

    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) {
      return;
    }

    localStorage.setItem(
      CLAVE_TAREAS,
      JSON.stringify(tareas),
    );
  }, [tareas, cargado]);

  useEffect(() => {
    if (
      tareas.length > 0 &&
      !tareas.some(
        (tarea) =>
          tarea.id === tareaActivaId,
      )
    ) {
      setTareaActivaId(
        tareas[0].id,
      );
    }
  }, [tareas, tareaActivaId]);

  const jugadoresDisponibles =
    useMemo(
      () =>
        jugadores.filter(
          (jugador) =>
            jugador.estado ===
            "Disponible",
        ),
      [jugadores],
    );

  const jugadoresConMolestias =
    useMemo(
      () =>
        jugadores.filter(
          (jugador) =>
            jugador.estado ===
            "Molestias",
        ),
      [jugadores],
    );

  const tareaActiva =
    tareas.find(
      (tarea) =>
        tarea.id === tareaActivaId,
    ) || tareas[0];

  function actualizarTarea(
    tareaId: string,
    cambios: Partial<Tarea>,
  ) {
    setTareas((actuales) =>
      actuales.map((tarea) =>
        tarea.id === tareaId
          ? {
              ...tarea,
              ...cambios,
            }
          : tarea,
      ),
    );
  }

  function actualizarNombreTarea(
    tareaId: string,
    nombre: string,
  ) {
    actualizarTarea(tareaId, {
      nombre,
      generada: false,
    });
  }

  function añadirTarea() {
    const nuevaTarea = crearTarea(
      tareas.length + 1,
    );

    setTareas((actuales) => [
      ...actuales,
      nuevaTarea,
    ]);

    setTareaActivaId(
      nuevaTarea.id,
    );
  }

  function duplicarTarea(
    tareaId: string,
  ) {
    const tareaOriginal =
      tareas.find(
        (tarea) =>
          tarea.id === tareaId,
      );

    if (!tareaOriginal) {
      return;
    }

    const nuevaTarea: Tarea = {
      ...tareaOriginal,
      id: crearId(),
      nombre: `${tareaOriginal.nombre} copia`,
      equipos:
        tareaOriginal.equipos.map(
          (equipo) => ({
            ...equipo,
            id: crearId(),
            jugadores: [],
          }),
        ),
      comodines: [],
      generada: false,
    };

    setTareas((actuales) => [
      ...actuales,
      nuevaTarea,
    ]);

    setTareaActivaId(
      nuevaTarea.id,
    );
  }

  function eliminarTarea(
    tareaId: string,
  ) {
    const confirmar =
      window.confirm(
        "¿Quieres eliminar esta tarea?",
      );

    if (!confirmar) {
      return;
    }

    setTareas((actuales) => {
      const nuevasTareas =
        actuales.filter(
          (tarea) =>
            tarea.id !== tareaId,
        );

      if (
        nuevasTareas.length === 0
      ) {
        const nuevaTarea =
          crearTarea(1);

        setTareaActivaId(
          nuevaTarea.id,
        );

        return [nuevaTarea];
      }

      if (
        tareaActivaId === tareaId
      ) {
        setTareaActivaId(
          nuevasTareas[0].id,
        );
      }

      return nuevasTareas;
    });
  }

  function añadirEquipo(
    tareaId: string,
  ) {
    setTareas((actuales) =>
      actuales.map((tarea) => {
        if (tarea.id !== tareaId) {
          return tarea;
        }

        return {
          ...tarea,
          equipos: [
            ...tarea.equipos,
            crearEquipo(
              tarea.equipos.length,
            ),
          ],
          generada: false,
        };
      }),
    );
  }

  function eliminarEquipo(
    tareaId: string,
    equipoId: string,
  ) {
    setTareas((actuales) =>
      actuales.map((tarea) => {
        if (tarea.id !== tareaId) {
          return tarea;
        }

        if (
          tarea.equipos.length <= 2
        ) {
          alert(
            "Cada tarea debe tener al menos dos equipos.",
          );

          return tarea;
        }

        return {
          ...tarea,
          equipos:
            tarea.equipos.filter(
              (equipo) =>
                equipo.id !==
                equipoId,
            ),
          generada: false,
        };
      }),
    );
  }

  function actualizarEquipo(
    tareaId: string,
    equipoId: string,
    cambios: Partial<EquipoTarea>,
  ) {
    setTareas((actuales) =>
      actuales.map((tarea) => {
        if (tarea.id !== tareaId) {
          return tarea;
        }

        return {
          ...tarea,
          equipos: tarea.equipos.map(
            (equipo) =>
              equipo.id === equipoId
                ? {
                    ...equipo,
                    ...cambios,
                    jugadores: [],
                  }
                : equipo,
          ),
          generada: false,
        };
      }),
    );
  }

  function seleccionarComodin(
    tareaId: string,
    jugador: Jugador,
  ) {
    const clave =
      claveJugador(jugador);

    setTareas((actuales) =>
      actuales.map((tarea) => {
        if (tarea.id !== tareaId) {
          return tarea;
        }

        const yaSeleccionado =
          tarea.comodinesSeleccionados.includes(
            clave,
          );

        return {
          ...tarea,
          comodinesSeleccionados:
            yaSeleccionado
              ? tarea.comodinesSeleccionados.filter(
                  (elemento) =>
                    elemento !== clave,
                )
              : [
                  ...tarea.comodinesSeleccionados,
                  clave,
                ],
          comodines: [],
          generada: false,
        };
      }),
    );
  }

  function generarTarea(
    tareaId: string,
  ) {
    const tarea = tareas.find(
      (elemento) =>
        elemento.id === tareaId,
    );

    if (!tarea) {
      return;
    }

    const comodinesElegidos =
      jugadores.filter((jugador) =>
        tarea.comodinesSeleccionados.includes(
          claveJugador(jugador),
        ),
      );

    const clavesComodines =
      new Set(
        comodinesElegidos.map(
          claveJugador,
        ),
      );

    const jugadoresParaEquipos =
      jugadores.filter(
        (jugador) =>
          jugador.estado ===
            "Disponible" &&
          !clavesComodines.has(
            claveJugador(jugador),
          ),
      );

    const plazasNecesarias =
      tarea.equipos.reduce(
        (total, equipo) =>
          total +
          Math.max(
            1,
            equipo.cantidad,
          ),
        0,
      );

    if (
      jugadoresParaEquipos.length <
      plazasNecesarias
    ) {
      const faltan =
        plazasNecesarias -
        jugadoresParaEquipos.length;

      alert(
        `No hay suficientes jugadores disponibles.\n\n` +
          `Plazas en equipos: ${plazasNecesarias}\n` +
          `Disponibles para equipos: ${jugadoresParaEquipos.length}\n` +
          `Comodines seleccionados: ${comodinesElegidos.length}\n\n` +
          `Faltan ${faltan} jugador${
            faltan === 1
              ? ""
              : "es"
          }.`,
      );

      return;
    }

    const jugadoresElegidos =
      mezclarJugadores(
        jugadoresParaEquipos,
      ).slice(
        0,
        plazasNecesarias,
      );

    const equiposGenerados =
      repartirEquilibrado(
        jugadoresElegidos,
        tarea.equipos,
      );

    const comodinesGenerados:
      ComodinTarea[] =
      comodinesElegidos.map(
        (jugador) => ({
          jugador,
          funcion:
            tarea.funcionComodines,
        }),
      );

    setTareas((actuales) =>
      actuales.map((elemento) =>
        elemento.id === tareaId
          ? {
              ...elemento,
              equipos:
                equiposGenerados,
              comodines:
                comodinesGenerados,
              generada: true,
            }
          : elemento,
      ),
    );
  }

  function moverJugador(
    tareaId: string,
    jugador: Jugador,
    equipoOrigenId: string,
    equipoDestinoId: string,
  ) {
    if (
      equipoOrigenId ===
      equipoDestinoId
    ) {
      return;
    }

    setTareas((actuales) =>
      actuales.map((tarea) => {
        if (tarea.id !== tareaId) {
          return tarea;
        }

        const equipoDestino =
          tarea.equipos.find(
            (equipo) =>
              equipo.id ===
              equipoDestinoId,
          );

        if (!equipoDestino) {
          return tarea;
        }

        if (
          equipoDestino.jugadores
            .length >=
          equipoDestino.cantidad
        ) {
          alert(
            `${equipoDestino.nombre} está completo. Usa el intercambio.`,
          );

          return tarea;
        }

        return {
          ...tarea,
          equipos: tarea.equipos.map(
            (equipo) => {
              if (
                equipo.id ===
                equipoOrigenId
              ) {
                return {
                  ...equipo,
                  jugadores:
                    equipo.jugadores.filter(
                      (elemento) =>
                        claveJugador(
                          elemento,
                        ) !==
                        claveJugador(
                          jugador,
                        ),
                    ),
                };
              }

              if (
                equipo.id ===
                equipoDestinoId
              ) {
                return {
                  ...equipo,
                  jugadores: [
                    ...equipo.jugadores,
                    jugador,
                  ],
                };
              }

              return equipo;
            },
          ),
        };
      }),
    );
  }

  function intercambiarJugadores(
    tareaId: string,
    equipoOrigenId: string,
    jugadorOrigen: Jugador,
    equipoDestinoId: string,
    jugadorDestino: Jugador,
  ) {
    if (
      equipoOrigenId ===
      equipoDestinoId
    ) {
      return;
    }

    setTareas((actuales) =>
      actuales.map((tarea) => {
        if (tarea.id !== tareaId) {
          return tarea;
        }

        return {
          ...tarea,
          equipos: tarea.equipos.map(
            (equipo) => {
              if (
                equipo.id ===
                equipoOrigenId
              ) {
                return {
                  ...equipo,
                  jugadores:
                    equipo.jugadores.map(
                      (jugador) =>
                        claveJugador(
                          jugador,
                        ) ===
                        claveJugador(
                          jugadorOrigen,
                        )
                          ? jugadorDestino
                          : jugador,
                    ),
                };
              }

              if (
                equipo.id ===
                equipoDestinoId
              ) {
                return {
                  ...equipo,
                  jugadores:
                    equipo.jugadores.map(
                      (jugador) =>
                        claveJugador(
                          jugador,
                        ) ===
                        claveJugador(
                          jugadorDestino,
                        )
                          ? jugadorOrigen
                          : jugador,
                    ),
                };
              }

              return equipo;
            },
          ),
        };
      }),
    );
  }

  if (!cargado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />

          <p className="mt-4 font-semibold text-slate-300">
            Preparando sesión
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080b12] text-white">
      <header className="border-b border-white/5 bg-[#0c1019]/95">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg transition hover:bg-white/10"
            >
              ←
            </Link>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
                Donnici Teams
              </p>

              <h1 className="text-lg font-black sm:text-xl">
                Constructor de tareas
              </h1>
            </div>
          </div>

          <Link
            href="/entrenamiento"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
          >
            Jugadores
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#151b28] to-[#0c1019]">
          <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Sesión activa
              </span>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Organiza los equipos
                de cada tarea
              </h2>

              <p className="mt-3 text-sm text-slate-400 sm:text-base">
                {formatearFecha(fecha)}
                <span className="mx-2 text-slate-700">
                  /
                </span>
                {jugadores.length} jugadores
                seleccionados
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Indicador
                titulo="Disponibles"
                valor={
                  jugadoresDisponibles.length
                }
              />

              <Indicador
                titulo="Molestias"
                valor={
                  jugadoresConMolestias.length
                }
              />

              <Indicador
                titulo="Tareas"
                valor={tareas.length}
              />
            </div>
          </div>
        </section>

        {jugadores.length === 0 ? (
          <section className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl">
              ⚽
            </div>

            <h2 className="mt-5 text-2xl font-black">
              No hay jugadores
              seleccionados
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-400">
              Selecciona los jugadores
              del entrenamiento antes
              de crear los equipos.
            </p>

            <Link
              href="/entrenamiento"
              className="mt-6 inline-flex rounded-xl bg-emerald-500 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-400"
            >
              Seleccionar jugadores
            </Link>
          </section>
        ) : (
          <>
            <nav className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#0c1019] p-2">
              {tareas.map(
                (tarea, indice) => {
                  const activa =
                    tarea.id ===
                    tareaActiva?.id;

                  return (
                    <button
                      key={tarea.id}
                      onClick={() =>
                        setTareaActivaId(
                          tarea.id,
                        )
                      }
                      className={`shrink-0 rounded-xl px-4 py-3 text-left transition ${
                        activa
                          ? "bg-emerald-400 text-slate-950"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="block text-[10px] font-black uppercase tracking-widest opacity-70">
                        Tarea {indice + 1}
                      </span>

                      <span className="mt-0.5 block max-w-40 truncate text-sm font-black">
                        {tarea.nombre}
                      </span>
                    </button>
                  );
                },
              )}

              <button
                onClick={añadirTarea}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm font-bold text-slate-400 transition hover:border-emerald-400/60 hover:text-emerald-300"
              >
                <span className="text-lg">
                  +
                </span>
                Nueva tarea
              </button>
            </nav>

            {tareaActiva && (
              <EditorTarea
                key={tareaActiva.id}
                tarea={tareaActiva}
                jugadores={jugadores}
                disponibles={
                  jugadoresDisponibles.length
                }
                onCambiarNombre={(
                  nombre,
                ) =>
                  actualizarNombreTarea(
                    tareaActiva.id,
                    nombre,
                  )
                }
                onAñadirEquipo={() =>
                  añadirEquipo(
                    tareaActiva.id,
                  )
                }
                onEliminarEquipo={(
                  equipoId,
                ) =>
                  eliminarEquipo(
                    tareaActiva.id,
                    equipoId,
                  )
                }
                onActualizarEquipo={(
                  equipoId,
                  cambios,
                ) =>
                  actualizarEquipo(
                    tareaActiva.id,
                    equipoId,
                    cambios,
                  )
                }
                onSeleccionarComodin={(
                  jugador,
                ) =>
                  seleccionarComodin(
                    tareaActiva.id,
                    jugador,
                  )
                }
                onCambiarFuncionComodin={(
                  funcion,
                ) =>
                  actualizarTarea(
                    tareaActiva.id,
                    {
                      funcionComodines:
                        funcion,
                      generada: false,
                      comodines: [],
                    },
                  )
                }
                onGenerar={() =>
                  generarTarea(
                    tareaActiva.id,
                  )
                }
                onDuplicar={() =>
                  duplicarTarea(
                    tareaActiva.id,
                  )
                }
                onEliminar={() =>
                  eliminarTarea(
                    tareaActiva.id,
                  )
                }
                onMoverJugador={(
                  jugador,
                  origen,
                  destino,
                ) =>
                  moverJugador(
                    tareaActiva.id,
                    jugador,
                    origen,
                    destino,
                  )
                }
                onIntercambiarJugadores={(
                  equipoOrigenId,
                  jugadorOrigen,
                  equipoDestinoId,
                  jugadorDestino,
                ) =>
                  intercambiarJugadores(
                    tareaActiva.id,
                    equipoOrigenId,
                    jugadorOrigen,
                    equipoDestinoId,
                    jugadorDestino,
                  )
                }
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

type IndicadorProps = {
  titulo: string;
  valor: number;
};

function Indicador({
  titulo,
  valor,
}: IndicadorProps) {
  return (
    <div className="min-w-20 rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-center sm:min-w-28">
      <p className="text-2xl font-black">
        {valor}
      </p>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {titulo}
      </p>
    </div>
  );
}

type EditorTareaProps = {
  tarea: Tarea;
  jugadores: Jugador[];
  disponibles: number;
  onCambiarNombre: (
    nombre: string,
  ) => void;
  onAñadirEquipo: () => void;
  onEliminarEquipo: (
    equipoId: string,
  ) => void;
  onActualizarEquipo: (
    equipoId: string,
    cambios: Partial<EquipoTarea>,
  ) => void;
  onSeleccionarComodin: (
    jugador: Jugador,
  ) => void;
  onCambiarFuncionComodin: (
    funcion: FuncionComodin,
  ) => void;
  onGenerar: () => void;
  onDuplicar: () => void;
  onEliminar: () => void;
  onMoverJugador: (
    jugador: Jugador,
    equipoOrigenId: string,
    equipoDestinoId: string,
  ) => void;
  onIntercambiarJugadores: (
    equipoOrigenId: string,
    jugadorOrigen: Jugador,
    equipoDestinoId: string,
    jugadorDestino: Jugador,
  ) => void;
};

function EditorTarea({
  tarea,
  jugadores,
  disponibles,
  onCambiarNombre,
  onAñadirEquipo,
  onEliminarEquipo,
  onActualizarEquipo,
  onSeleccionarComodin,
  onCambiarFuncionComodin,
  onGenerar,
  onDuplicar,
  onEliminar,
  onMoverJugador,
  onIntercambiarJugadores,
}: EditorTareaProps) {
  const [
    seleccionIntercambio,
    setSeleccionIntercambio,
  ] =
    useState<SeleccionIntercambio | null>(
      null,
    );

  const jugadoresNecesarios =
    tarea.equipos.reduce(
      (total, equipo) =>
        total + equipo.cantidad,
      0,
    );

  const comodinesDisponibles =
    jugadores.filter(
      (jugador) =>
        jugador.estado ===
          "Disponible" &&
        tarea.comodinesSeleccionados.includes(
          claveJugador(jugador),
        ),
    ).length;

  const disponiblesParaEquipos =
    disponibles -
    comodinesDisponibles;

  const faltan = Math.max(
    0,
    jugadoresNecesarios -
      disponiblesParaEquipos,
  );

  const diferencia =
    disponiblesParaEquipos -
    jugadoresNecesarios;

  function gestionarIntercambio(
    equipoId: string,
    jugador: Jugador,
  ) {
    if (!seleccionIntercambio) {
      setSeleccionIntercambio({
        equipoId,
        jugador,
      });

      return;
    }

    const mismaSeleccion =
      seleccionIntercambio.equipoId ===
        equipoId &&
      claveJugador(
        seleccionIntercambio.jugador,
      ) === claveJugador(jugador);

    if (mismaSeleccion) {
      setSeleccionIntercambio(null);
      return;
    }

    if (
      seleccionIntercambio.equipoId ===
      equipoId
    ) {
      setSeleccionIntercambio({
        equipoId,
        jugador,
      });

      return;
    }

    onIntercambiarJugadores(
      seleccionIntercambio.equipoId,
      seleccionIntercambio.jugador,
      equipoId,
      jugador,
    );

    setSeleccionIntercambio(null);
  }

  return (
    <section className="mt-6">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className="rounded-3xl border border-white/10 bg-[#0c1019] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Configuración
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Datos de la tarea
                </h2>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={onDuplicar}
                  title="Duplicar tarea"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-sm text-slate-300 transition hover:bg-white/10"
                >
                  ⧉
                </button>

                <button
                  onClick={onEliminar}
                  title="Eliminar tarea"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-sm text-red-300 transition hover:bg-red-500/20"
                >
                  ×
                </button>
              </div>
            </div>

            <label className="mt-5 block text-xs font-bold text-slate-500">
              Nombre de la tarea
            </label>

            <input
              value={tarea.nombre}
              onChange={(evento) =>
                onCambiarNombre(
                  evento.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-bold outline-none transition focus:border-emerald-400/60"
            />
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#0c1019] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Petos
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Equipos
                </h2>
              </div>

              <button
                onClick={onAñadirEquipo}
                className="rounded-xl bg-white/5 px-3 py-2 text-xs font-black text-emerald-300 transition hover:bg-emerald-400/10"
              >
                + Equipo
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {tarea.equipos.map(
                (equipo) => (
                  <ConfiguracionEquipo
                    key={equipo.id}
                    equipo={equipo}
                    onActualizar={(
                      cambios,
                    ) =>
                      onActualizarEquipo(
                        equipo.id,
                        cambios,
                      )
                    }
                    onEliminar={() =>
                      onEliminarEquipo(
                        equipo.id,
                      )
                    }
                  />
                ),
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#0c1019] p-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Participación especial
              </p>

              <h2 className="mt-1 text-xl font-black">
                Comodines
              </h2>
            </div>

            <select
              value={
                tarea.funcionComodines
              }
              onChange={(evento) =>
                onCambiarFuncionComodin(
                  evento.target
                    .value as FuncionComodin,
                )
              }
              className="mt-4 w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm font-bold outline-none"
            >
              <option value="General">
                General
              </option>

              <option value="Ofensivo">
                Ofensivo
              </option>

              <option value="Defensivo">
                Defensivo
              </option>
            </select>

            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
              {jugadores.map(
                (jugador) => {
                  const seleccionado =
                    tarea.comodinesSeleccionados.includes(
                      claveJugador(
                        jugador,
                      ),
                    );

                  return (
                    <button
                      key={claveJugador(
                        jugador,
                      )}
                      onClick={() =>
                        onSeleccionarComodin(
                          jugador,
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                        seleccionado
                          ? "border-amber-400/60 bg-amber-400/10"
                          : "border-transparent bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                          seleccionado
                            ? "bg-amber-400 text-slate-950"
                            : "bg-white/5 text-slate-300"
                        }`}
                      >
                        {jugador.dorsal ||
                          abreviaturaPosicion(
                            jugador.demarcacion,
                          )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">
                          {jugador.nombre}
                        </span>

                        <span
                          className={`block text-[11px] ${
                            jugador.estado ===
                            "Molestias"
                              ? "text-orange-300"
                              : "text-slate-500"
                          }`}
                        >
                          {
                            jugador.demarcacion
                          }
                          {jugador.estado ===
                            "Molestias" &&
                            " · Molestias"}
                        </span>
                      </span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                          seleccionado
                            ? "border-amber-400 bg-amber-400 text-slate-950"
                            : "border-white/20"
                        }`}
                      >
                        {seleccionado
                          ? "✓"
                          : ""}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#0c1019] p-5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <ResumenPequeno
                titulo="Plazas"
                valor={
                  jugadoresNecesarios
                }
              />

              <ResumenPequeno
                titulo="Jugadores"
                valor={
                  disponiblesParaEquipos
                }
              />

              <ResumenPequeno
                titulo={
                  faltan > 0
                    ? "Faltan"
                    : "Sobran"
                }
                valor={
                  faltan > 0
                    ? faltan
                    : diferencia
                }
                alerta={faltan > 0}
              />
            </div>

            <button
              onClick={onGenerar}
              disabled={faltan > 0}
              className="mt-4 w-full rounded-xl bg-emerald-400 px-4 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {tarea.generada
                ? "Volver a generar"
                : "Generar equipos"}
            </button>

            {faltan > 0 && (
              <p className="mt-3 text-center text-xs font-bold text-red-300">
                Faltan {faltan} jugador
                {faltan === 1
                  ? ""
                  : "es"}
              </p>
            )}
          </section>
        </aside>

        <section className="min-w-0">
          {!tarea.generada ? (
            <EstadoVacio
              equipos={tarea.equipos}
              jugadoresNecesarios={
                jugadoresNecesarios
              }
            />
          ) : (
            <ResultadoTarea
              tarea={tarea}
              seleccionIntercambio={
                seleccionIntercambio
              }
              onMoverJugador={
                onMoverJugador
              }
              onSeleccionarIntercambio={
                gestionarIntercambio
              }
              onCancelarIntercambio={() =>
                setSeleccionIntercambio(
                  null,
                )
              }
            />
          )}
        </section>
      </div>
    </section>
  );
}

type ConfiguracionEquipoProps = {
  equipo: EquipoTarea;
  onActualizar: (
    cambios: Partial<EquipoTarea>,
  ) => void;
  onEliminar: () => void;
};

function ConfiguracionEquipo({
  equipo,
  onActualizar,
  onEliminar,
}: ConfiguracionEquipoProps) {
  const estilo =
    obtenerEstiloEquipo(
      equipo.color,
    );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-3">
        <span
          className={`h-4 w-4 shrink-0 rounded-full ${estilo.circulo}`}
        />

        <input
          value={equipo.nombre}
          onChange={(evento) =>
            onActualizar({
              nombre:
                evento.target.value,
            })
          }
          className="min-w-0 flex-1 bg-transparent text-sm font-black outline-none"
        />

        <button
          onClick={onEliminar}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-300"
        >
          ×
        </button>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <select
          value={equipo.color}
          onChange={(evento) => {
            const nuevoColor =
              evento.target.value;

            onActualizar({
              color: nuevoColor,
            });
          }}
          className="min-w-0 rounded-lg border border-white/10 bg-[#080b12] px-3 py-2 text-xs font-bold outline-none"
        >
          {COLORES_EQUIPOS.map(
            (color) => (
              <option
                key={color.nombre}
                value={color.nombre}
              >
                {color.nombre}
              </option>
            ),
          )}
        </select>

        <div className="flex items-center rounded-lg border border-white/10 bg-[#080b12]">
          <button
            onClick={() =>
              onActualizar({
                cantidad: Math.max(
                  1,
                  equipo.cantidad - 1,
                ),
              })
            }
            className="h-9 w-9 text-lg text-slate-400 transition hover:text-white"
          >
            −
          </button>

          <span className="min-w-8 text-center text-sm font-black">
            {equipo.cantidad}
          </span>

          <button
            onClick={() =>
              onActualizar({
                cantidad:
                  equipo.cantidad + 1,
              })
            }
            className="h-9 w-9 text-lg text-slate-400 transition hover:text-white"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

type ResumenPequenoProps = {
  titulo: string;
  valor: number;
  alerta?: boolean;
};

function ResumenPequeno({
  titulo,
  valor,
  alerta = false,
}: ResumenPequenoProps) {
  return (
    <div
      className={`rounded-xl px-2 py-3 ${
        alerta
          ? "bg-red-500/10"
          : "bg-white/[0.04]"
      }`}
    >
      <p
        className={`text-xl font-black ${
          alerta
            ? "text-red-300"
            : "text-white"
        }`}
      >
        {valor}
      </p>

      <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
        {titulo}
      </p>
    </div>
  );
}

type EstadoVacioProps = {
  equipos: EquipoTarea[];
  jugadoresNecesarios: number;
};

function EstadoVacio({
  equipos,
  jugadoresNecesarios,
}: EstadoVacioProps) {
  return (
    <div className="flex min-h-[650px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-[#0c1019] px-6 text-center">
      <div className="relative flex h-32 w-52 items-center justify-center rounded-[40%] border-2 border-emerald-400/20 bg-emerald-400/[0.03]">
        <div className="absolute left-1/2 top-0 h-full w-px bg-emerald-400/20" />

        <div className="h-12 w-12 rounded-full border border-emerald-400/20" />

        <span className="absolute left-5 top-5 h-4 w-4 rounded-full bg-blue-500" />
        <span className="absolute bottom-5 left-12 h-4 w-4 rounded-full bg-red-500" />
        <span className="absolute right-7 top-8 h-4 w-4 rounded-full bg-yellow-400" />
        <span className="absolute bottom-7 right-12 h-4 w-4 rounded-full bg-emerald-500" />
      </div>

      <h2 className="mt-7 text-2xl font-black">
        La tarea está preparada
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        Has configurado{" "}
        {equipos.length} equipos y{" "}
        {jugadoresNecesarios} plazas.
        Pulsa generar para repartir los
        jugadores.
      </p>
    </div>
  );
}

type ResultadoTareaProps = {
  tarea: Tarea;
  seleccionIntercambio:
    | SeleccionIntercambio
    | null;
  onMoverJugador: (
    jugador: Jugador,
    equipoOrigenId: string,
    equipoDestinoId: string,
  ) => void;
  onSeleccionarIntercambio: (
    equipoId: string,
    jugador: Jugador,
  ) => void;
  onCancelarIntercambio: () => void;
};

function ResultadoTarea({
  tarea,
  seleccionIntercambio,
  onMoverJugador,
  onSeleccionarIntercambio,
  onCancelarIntercambio,
}: ResultadoTareaProps) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0c1019] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">
            Resultado
          </p>

          <h2 className="mt-1 text-xl font-black">
            Equipos de la tarea
          </h2>
        </div>

        {seleccionIntercambio ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-cyan-400/10 px-4 py-2">
            <span className="text-sm font-bold text-cyan-200">
              {
                seleccionIntercambio
                  .jugador.nombre
              }{" "}
              seleccionado
            </span>

            <button
              onClick={
                onCancelarIntercambio
              }
              className="text-xs font-black text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Selecciona dos jugadores
            para intercambiarlos
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {tarea.equipos.map(
          (equipo) => (
            <EquipoGenerado
              key={equipo.id}
              equipo={equipo}
              todosLosEquipos={
                tarea.equipos
              }
              seleccionIntercambio={
                seleccionIntercambio
              }
              onMoverJugador={
                onMoverJugador
              }
              onSeleccionarIntercambio={
                onSeleccionarIntercambio
              }
            />
          ),
        )}
      </div>

      {tarea.comodines.length > 0 && (
        <section className="mt-4 rounded-3xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-300">
                Apoyo
              </p>

              <h2 className="mt-1 text-xl font-black">
                Comodines
              </h2>
            </div>

            <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-950">
              {tarea.comodines.length}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tarea.comodines.map(
              (comodin) => (
                <div
                  key={claveJugador(
                    comodin.jugador,
                  )}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0c1019] p-3"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-sm font-black text-slate-950">
                    {comodin.jugador
                      .dorsal || "C"}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black">
                      {
                        comodin.jugador
                          .nombre
                      }
                    </p>

                    <p className="text-xs text-amber-300">
                      {comodin.funcion}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}

type EquipoGeneradoProps = {
  equipo: EquipoTarea;
  todosLosEquipos: EquipoTarea[];
  seleccionIntercambio:
    | SeleccionIntercambio
    | null;
  onMoverJugador: (
    jugador: Jugador,
    equipoOrigenId: string,
    equipoDestinoId: string,
  ) => void;
  onSeleccionarIntercambio: (
    equipoId: string,
    jugador: Jugador,
  ) => void;
};

function EquipoGenerado({
  equipo,
  todosLosEquipos,
  seleccionIntercambio,
  onMoverJugador,
  onSeleccionarIntercambio,
}: EquipoGeneradoProps) {
  const estilo =
    obtenerEstiloEquipo(
      equipo.color,
    );

  const textoOscuro =
    equipo.color === "Amarillo" ||
    equipo.color === "Blanco";

  return (
    <article
      className={`overflow-hidden rounded-3xl border bg-[#0c1019] ${estilo.borde}`}
    >
      <header
        className={`flex items-center justify-between gap-3 px-5 py-4 ${estilo.cabecera}`}
      >
        <div className="min-w-0">
          <p
            className={`text-[10px] font-black uppercase tracking-widest ${
              textoOscuro
                ? "text-slate-700"
                : "text-white/70"
            }`}
          >
            Equipo
          </p>

          <h3
            className={`truncate text-lg font-black ${
              textoOscuro
                ? "text-slate-950"
                : "text-white"
            }`}
          >
            {equipo.nombre}
          </h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            textoOscuro
              ? "bg-black/10 text-slate-950"
              : "bg-black/20 text-white"
          }`}
        >
          {equipo.jugadores.length}/
          {equipo.cantidad}
        </span>
      </header>

      <div className="grid grid-cols-4 gap-px border-b border-white/5 bg-white/5">
        <DatoPosicion
          titulo="POR"
          valor={contarGrupo(
            equipo.jugadores,
            "Portero",
          )}
        />

        <DatoPosicion
          titulo="DEF"
          valor={contarGrupo(
            equipo.jugadores,
            "Defensa",
          )}
        />

        <DatoPosicion
          titulo="MED"
          valor={contarGrupo(
            equipo.jugadores,
            "Centrocampista",
          )}
        />

        <DatoPosicion
          titulo="ATA"
          valor={contarGrupo(
            equipo.jugadores,
            "Atacante",
          )}
        />
      </div>

      <div className="space-y-2 p-3">
        {equipo.jugadores.map(
          (jugador) => {
            const seleccionado =
              seleccionIntercambio !==
                null &&
              seleccionIntercambio
                .equipoId ===
                equipo.id &&
              claveJugador(
                seleccionIntercambio.jugador,
              ) ===
                claveJugador(jugador);

            const posibleIntercambio =
              seleccionIntercambio !==
                null &&
              seleccionIntercambio
                .equipoId !==
                equipo.id;

            return (
              <div
                key={claveJugador(
                  jugador,
                )}
                className={`group rounded-2xl border p-3 transition ${
                  seleccionado
                    ? "border-cyan-400 bg-cyan-400/10"
                    : posibleIntercambio
                      ? "border-cyan-400/30 bg-white/[0.04] hover:border-cyan-400"
                      : "border-white/5 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      onSeleccionarIntercambio(
                        equipo.id,
                        jugador,
                      )
                    }
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black transition ${
                      seleccionado
                        ? "bg-cyan-400 text-slate-950"
                        : `${estilo.suave} ${estilo.texto}`
                    }`}
                    title="Seleccionar para intercambiar"
                  >
                    {jugador.dorsal ||
                      abreviaturaPosicion(
                        jugador.demarcacion,
                      )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black">
                      {jugador.nombre}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                      {
                        jugador.demarcacion
                      }
                      {jugador.pie
                        ? ` · ${jugador.pie}`
                        : ""}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      onSeleccionarIntercambio(
                        equipo.id,
                        jugador,
                      )
                    }
                    className={`rounded-lg px-2.5 py-2 text-xs font-black transition ${
                      seleccionado
                        ? "bg-cyan-400 text-slate-950"
                        : posibleIntercambio
                          ? "bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
                          : "bg-white/5 text-slate-500 hover:text-white"
                    }`}
                  >
                    {seleccionado
                      ? "✓"
                      : "⇄"}
                  </button>
                </div>

                <select
                  value={equipo.id}
                  onChange={(evento) =>
                    onMoverJugador(
                      jugador,
                      equipo.id,
                      evento.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-[11px] font-bold text-slate-500 outline-none transition hover:border-white/10 hover:bg-black/20 hover:text-slate-300"
                >
                  <option
                    value={equipo.id}
                  >
                    Mantener en este equipo
                  </option>

                  {todosLosEquipos
                    .filter(
                      (otroEquipo) =>
                        otroEquipo.id !==
                        equipo.id,
                    )
                    .map(
                      (otroEquipo) => (
                        <option
                          key={
                            otroEquipo.id
                          }
                          value={
                            otroEquipo.id
                          }
                        >
                          Mover a{" "}
                          {
                            otroEquipo.nombre
                          }
                          {otroEquipo
                            .jugadores
                            .length >=
                          otroEquipo.cantidad
                            ? " — completo"
                            : ""}
                        </option>
                      ),
                    )}
                </select>
              </div>
            );
          },
        )}
      </div>
    </article>
  );
}

type DatoPosicionProps = {
  titulo: string;
  valor: number;
};

function DatoPosicion({
  titulo,
  valor,
}: DatoPosicionProps) {
  return (
    <div className="bg-[#0c1019] px-2 py-3 text-center">
      <p className="text-base font-black">
        {valor}
      </p>

      <p className="mt-0.5 text-[9px] font-black tracking-widest text-slate-600">
        {titulo}
      </p>
    </div>
  );
}