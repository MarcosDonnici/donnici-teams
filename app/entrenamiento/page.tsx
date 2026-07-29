"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Jugador = {
  id: number;
  nombre: string;
  dorsal?: string;
  demarcacion: string;
  pie: string;
};

type OrigenJugador = "Plantilla" | "Juvenil";

type Estado = "Disponible" | "Molestias" | "Lesionado" | "Ausente";

type EstadoJugador = {
  id: number;
  nombre: string;
  dorsal?: string;
  demarcacion: string;
  pie: string;
  origen: OrigenJugador;
  seleccionado: boolean;
  estado: Estado;
};

type EntrenamientoGuardado = {
  fecha?: string;
  jugadores?: EstadoJugador[];
};

const CLAVE_JUGADORES = "donnici-teams-jugadores";
const CLAVE_JUVENILES = "donnici-teams-juveniles";
const CLAVE_ENTRENAMIENTO = "donnici-teams-entrenamiento-actual";

function obtenerFechaHoy() {
  return new Date().toISOString().split("T")[0];
}

function claveJugador(
  id: number,
  origen: OrigenJugador,
) {
  return `${origen}-${id}`;
}

function leerJugadoresGuardados(
  clave: string,
): Jugador[] {
  const datosGuardados =
    localStorage.getItem(clave);

  if (!datosGuardados) {
    return [];
  }

  try {
    const datos = JSON.parse(
      datosGuardados,
    );

    return Array.isArray(datos)
      ? datos
      : [];
  } catch {
    return [];
  }
}

function crearJugadorEntrenamiento(
  jugador: Jugador,
  origen: OrigenJugador,
): EstadoJugador {
  return {
    ...jugador,
    origen,
    seleccionado:
      origen === "Plantilla",
    estado: "Disponible",
  };
}

function sincronizarJugadores(
  plantilla: Jugador[],
  juveniles: Jugador[],
  entrenamientoAnterior: EstadoJugador[],
) {
  const estadosAnteriores =
    new Map<string, EstadoJugador>();

  entrenamientoAnterior.forEach(
    (jugador) => {
      estadosAnteriores.set(
        claveJugador(
          jugador.id,
          jugador.origen,
        ),
        jugador,
      );
    },
  );

  const jugadoresPlantilla =
    plantilla.map((jugador) => {
      const anterior =
        estadosAnteriores.get(
          claveJugador(
            jugador.id,
            "Plantilla",
          ),
        );

      if (!anterior) {
        return crearJugadorEntrenamiento(
          jugador,
          "Plantilla",
        );
      }

      return {
        ...jugador,
        origen:
          "Plantilla" as const,
        seleccionado:
          anterior.seleccionado,
        estado:
          anterior.estado ||
          "Disponible",
      };
    });

  const jugadoresJuveniles =
    juveniles.map((jugador) => {
      const anterior =
        estadosAnteriores.get(
          claveJugador(
            jugador.id,
            "Juvenil",
          ),
        );

      if (!anterior) {
        return crearJugadorEntrenamiento(
          jugador,
          "Juvenil",
        );
      }

      return {
        ...jugador,
        origen:
          "Juvenil" as const,
        seleccionado:
          anterior.seleccionado,
        estado:
          anterior.estado ||
          "Disponible",
      };
    });

  return [
    ...jugadoresPlantilla,
    ...jugadoresJuveniles,
  ];
}

export default function Entrenamiento() {
  const [fecha, setFecha] =
    useState("");

  const [jugadores, setJugadores] =
    useState<EstadoJugador[]>([]);

  const [cargado, setCargado] =
    useState(false);

  useEffect(() => {
    const fechaHoy =
      obtenerFechaHoy();

    const plantilla =
      leerJugadoresGuardados(
        CLAVE_JUGADORES,
      );

    const juveniles =
      leerJugadoresGuardados(
        CLAVE_JUVENILES,
      );

    let fechaEntrenamiento =
      fechaHoy;

    let jugadoresAnteriores:
      EstadoJugador[] = [];

    const entrenamientoGuardado =
      localStorage.getItem(
        CLAVE_ENTRENAMIENTO,
      );

    if (entrenamientoGuardado) {
      try {
        const datos: EntrenamientoGuardado =
          JSON.parse(
            entrenamientoGuardado,
          );

        fechaEntrenamiento =
          datos.fecha || fechaHoy;

        jugadoresAnteriores =
          Array.isArray(
            datos.jugadores,
          )
            ? datos.jugadores
            : [];
      } catch {
        localStorage.removeItem(
          CLAVE_ENTRENAMIENTO,
        );
      }
    }

    const jugadoresSincronizados =
      sincronizarJugadores(
        plantilla,
        juveniles,
        jugadoresAnteriores,
      );

    setFecha(
      fechaEntrenamiento,
    );

    setJugadores(
      jugadoresSincronizados,
    );

    localStorage.setItem(
      CLAVE_ENTRENAMIENTO,
      JSON.stringify({
        fecha:
          fechaEntrenamiento,
        jugadores:
          jugadoresSincronizados,
      }),
    );

    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) {
      return;
    }

    const datosEntrenamiento = {
      fecha,
      jugadores,
    };

    localStorage.setItem(
      CLAVE_ENTRENAMIENTO,
      JSON.stringify(
        datosEntrenamiento,
      ),
    );
  }, [
    fecha,
    jugadores,
    cargado,
  ]);

  function cambiarSeleccion(
    id: number,
    origen: OrigenJugador,
  ) {
    setJugadores((actuales) =>
      actuales.map((jugador) => {
        const esJugador =
          jugador.id === id &&
          jugador.origen === origen;

        if (!esJugador) {
          return jugador;
        }

        if (
          jugador.estado ===
            "Lesionado" ||
          jugador.estado ===
            "Ausente"
        ) {
          return jugador;
        }

        return {
          ...jugador,
          seleccionado:
            !jugador.seleccionado,
        };
      }),
    );
  }

  function cambiarEstado(
    id: number,
    origen: OrigenJugador,
    nuevoEstado: Estado,
  ) {
    setJugadores((actuales) =>
      actuales.map((jugador) => {
        const esJugador =
          jugador.id === id &&
          jugador.origen === origen;

        if (!esJugador) {
          return jugador;
        }

        const puedeParticipar =
          nuevoEstado ===
            "Disponible" ||
          nuevoEstado ===
            "Molestias";

        return {
          ...jugador,
          estado: nuevoEstado,
          seleccionado:
            puedeParticipar
              ? jugador.seleccionado
              : false,
        };
      }),
    );
  }

  function seleccionarDisponibles() {
    setJugadores((actuales) =>
      actuales.map(
        (jugador) => ({
          ...jugador,
          seleccionado:
            jugador.origen ===
              "Plantilla" &&
            jugador.estado ===
              "Disponible",
        }),
      ),
    );
  }

  function seleccionarTodaLaPlantilla() {
    setJugadores((actuales) =>
      actuales.map(
        (jugador) => ({
          ...jugador,
          seleccionado:
            jugador.origen ===
              "Plantilla" &&
            (jugador.estado ===
              "Disponible" ||
              jugador.estado ===
                "Molestias"),
        }),
      ),
    );
  }

  function desmarcarTodos() {
    setJugadores((actuales) =>
      actuales.map(
        (jugador) => ({
          ...jugador,
          seleccionado:
            false,
        }),
      ),
    );
  }

  function limpiarEntrenamiento() {
    const confirmar =
      window.confirm(
        "¿Quieres reiniciar la selección y los estados del entrenamiento?",
      );

    if (!confirmar) {
      return;
    }

    const plantilla =
      leerJugadoresGuardados(
        CLAVE_JUGADORES,
      );

    const juveniles =
      leerJugadoresGuardados(
        CLAVE_JUVENILES,
      );

    const jugadoresReiniciados =
      sincronizarJugadores(
        plantilla,
        juveniles,
        [],
      );

    const nuevaFecha =
      obtenerFechaHoy();

    setJugadores(
      jugadoresReiniciados,
    );

    setFecha(nuevaFecha);

    localStorage.setItem(
      CLAVE_ENTRENAMIENTO,
      JSON.stringify({
        fecha: nuevaFecha,
        jugadores:
          jugadoresReiniciados,
      }),
    );
  }

  const seleccionados =
    jugadores.filter(
      (jugador) =>
        jugador.seleccionado,
    ).length;

  const disponibles =
    jugadores.filter(
      (jugador) =>
        jugador.seleccionado &&
        (jugador.estado ===
          "Disponible" ||
          jugador.estado ===
            "Molestias"),
    ).length;

  const jugadoresPlantilla =
    jugadores.filter(
      (jugador) =>
        jugador.origen ===
        "Plantilla",
    ).length;

  const juvenilesSeleccionados =
    jugadores.filter(
      (jugador) =>
        jugador.seleccionado &&
        jugador.origen ===
          "Juvenil",
    ).length;

  const lesionados =
    jugadores.filter(
      (jugador) =>
        jugador.estado ===
        "Lesionado",
    ).length;

  const ausentes =
    jugadores.filter(
      (jugador) =>
        jugador.estado ===
        "Ausente",
    ).length;

  if (!cargado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <p className="text-lg font-bold">
          Cargando jugadores...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="rounded-lg bg-slate-700 px-4 py-2 transition hover:bg-slate-600"
          >
            ← Volver al inicio
          </Link>

          <button
            onClick={
              limpiarEntrenamiento
            }
            className="rounded-lg bg-red-600 px-4 py-2 font-bold transition hover:bg-red-700"
          >
            Reiniciar entrenamiento
          </button>
        </div>

        <h1 className="text-4xl font-bold">
          ⚽ Nuevo entrenamiento
        </h1>

        <p className="mt-2 text-slate-400">
          Selecciona los jugadores
          disponibles para la sesión.
        </p>

        <section className="mt-8 rounded-2xl bg-slate-800 p-6">
          <label className="flex max-w-sm flex-col gap-2">
            <span className="font-bold">
              Fecha del entrenamiento
            </span>

            <input
              type="date"
              value={fecha}
              onChange={(evento) =>
                setFecha(
                  evento.target.value,
                )
              }
              className="rounded-lg bg-slate-700 p-3 outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-2xl bg-orange-500 p-5">
            <p className="text-sm font-bold uppercase">
              Convocados
            </p>

            <p className="mt-2 text-4xl font-black">
              {seleccionados}
            </p>
          </div>

          <div className="rounded-2xl bg-green-600 p-5">
            <p className="text-sm font-bold uppercase">
              Disponibles
            </p>

            <p className="mt-2 text-4xl font-black">
              {disponibles}
            </p>
          </div>

          <div className="rounded-2xl bg-purple-600 p-5">
            <p className="text-sm font-bold uppercase">
              Plantilla
            </p>

            <p className="mt-2 text-4xl font-black">
              {jugadoresPlantilla}
            </p>
          </div>

          <div className="rounded-2xl bg-blue-600 p-5">
            <p className="text-sm font-bold uppercase">
              Juveniles
            </p>

            <p className="mt-2 text-4xl font-black">
              {
                juvenilesSeleccionados
              }
            </p>
          </div>

          <div className="rounded-2xl bg-red-600 p-5">
            <p className="text-sm font-bold uppercase">
              Lesionados
            </p>

            <p className="mt-2 text-4xl font-black">
              {lesionados}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-700 p-5">
            <p className="text-sm font-bold uppercase">
              Ausentes
            </p>

            <p className="mt-2 text-4xl font-black">
              {ausentes}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Jugadores
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Hay{" "}
                {jugadoresPlantilla}{" "}
                jugadores cargados desde
                Plantilla.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={
                  seleccionarTodaLaPlantilla
                }
                className="rounded-lg bg-orange-500 px-4 py-2 font-bold transition hover:bg-orange-600"
              >
                Seleccionar toda la
                plantilla
              </button>

              <button
                onClick={
                  seleccionarDisponibles
                }
                className="rounded-lg bg-slate-700 px-4 py-2 font-bold transition hover:bg-slate-600"
              >
                Solo disponibles
              </button>

              <button
                onClick={
                  desmarcarTodos
                }
                className="rounded-lg bg-slate-700 px-4 py-2 font-bold transition hover:bg-slate-600"
              >
                Desmarcar todos
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {jugadores.map(
              (jugador) => (
                <article
                  key={claveJugador(
                    jugador.id,
                    jugador.origen,
                  )}
                  className={`rounded-2xl border p-5 ${
                    jugador.seleccionado
                      ? "border-orange-500 bg-slate-800"
                      : "border-slate-700 bg-slate-800/60"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <button
                      onClick={() =>
                        cambiarSeleccion(
                          jugador.id,
                          jugador.origen,
                        )
                      }
                      disabled={
                        jugador.estado ===
                          "Lesionado" ||
                        jugador.estado ===
                          "Ausente"
                      }
                      className="flex flex-1 items-center gap-4 text-left disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 ${
                          jugador.seleccionado
                            ? "border-orange-500 bg-orange-500"
                            : "border-slate-500"
                        }`}
                      >
                        {jugador.seleccionado
                          ? "✓"
                          : ""}
                      </span>

                      <div>
                        <h3 className="text-xl font-bold">
                          {jugador.dorsal
                            ? `${jugador.dorsal} · `
                            : ""}
                          {jugador.nombre}
                        </h3>

                        <p className="mt-1 text-slate-300">
                          {
                            jugador.demarcacion
                          }
                          {jugador.pie
                            ? ` · Pie ${jugador.pie.toLowerCase()}`
                            : ""}
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold ${
                            jugador.origen ===
                            "Juvenil"
                              ? "bg-blue-600"
                              : "bg-slate-600"
                          }`}
                        >
                          {jugador.origen}
                        </span>
                      </div>
                    </button>

                    <label className="flex flex-col gap-2 lg:w-52">
                      <span className="text-sm font-bold text-slate-300">
                        Estado
                      </span>

                      <select
                        value={
                          jugador.estado
                        }
                        onChange={(
                          evento,
                        ) =>
                          cambiarEstado(
                            jugador.id,
                            jugador.origen,
                            evento.target
                              .value as Estado,
                          )
                        }
                        className={`rounded-lg p-3 font-bold outline-none ${
                          jugador.estado ===
                          "Disponible"
                            ? "bg-green-600"
                            : jugador.estado ===
                                "Molestias"
                              ? "bg-yellow-500 text-black"
                              : jugador.estado ===
                                  "Lesionado"
                                ? "bg-red-600"
                                : "bg-slate-600"
                        }`}
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
                  </div>
                </article>
              ),
            )}

            {jugadores.length ===
              0 && (
              <div className="rounded-2xl bg-slate-800 p-6">
                <p className="text-slate-300">
                  No hay jugadores
                  guardados. Añádelos
                  primero en Plantilla o
                  Juveniles.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-slate-800 p-6">
          <h2 className="text-2xl font-bold">
            Resumen de la sesión
          </h2>

          <p className="mt-3 text-slate-300">
            Fecha:{" "}
            <strong>
              {fecha || "Sin fecha"}
            </strong>
          </p>

          <p className="mt-2 text-slate-300">
            Jugadores disponibles para
            crear equipos:{" "}
            <strong>
              {disponibles}
            </strong>
          </p>

          <Link
            href="/equipos"
            className={`mt-6 block rounded-xl p-4 text-center text-lg font-bold ${
              disponibles >= 2
                ? "bg-purple-600 transition hover:bg-purple-700"
                : "pointer-events-none bg-slate-600 opacity-50"
            }`}
          >
            🧠 Continuar para generar
            equipos
          </Link>
        </section>
      </div>
    </main>
  );
}