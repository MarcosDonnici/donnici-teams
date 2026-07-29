"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Jugador = {
  id: number;
  nombre: string;
  dorsal: string;
  demarcacion: string;
  pie: string;
};

const CLAVE_JUGADORES = "donnici-teams-jugadores";

export default function Plantilla() {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [cargado, setCargado] = useState(false);

  const [nombre, setNombre] = useState("");
  const [dorsal, setDorsal] = useState("");
  const [demarcacion, setDemarcacion] = useState("Portero");
  const [pie, setPie] = useState("Derecho");

  useEffect(() => {
    const guardados = localStorage.getItem(CLAVE_JUGADORES);

    if (guardados) {
      try {
        setJugadores(JSON.parse(guardados));
      } catch {
        setJugadores([]);
      }
    } else {
      setJugadores([
        {
          id: 1,
          nombre: "Rabanillo",
          dorsal: "1",
          demarcacion: "Portero",
          pie: "Derecho",
        },
      ]);
    }

    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) {
      localStorage.setItem(CLAVE_JUGADORES, JSON.stringify(jugadores));
    }
  }, [jugadores, cargado]);

  function añadirJugador() {
    if (!nombre.trim()) {
      alert("Escribe el nombre del jugador.");
      return;
    }

    if (jugadores.length >= 24) {
      alert("La plantilla ya tiene 24 jugadores.");
      return;
    }

    const nuevoJugador: Jugador = {
      id: Date.now(),
      nombre: nombre.trim(),
      dorsal: dorsal.trim(),
      demarcacion,
      pie,
    };

    setJugadores((actuales) => [...actuales, nuevoJugador]);
    setNombre("");
    setDorsal("");
    setDemarcacion("Portero");
    setPie("Derecho");
  }

  function eliminarJugador(id: number) {
    const confirmar = window.confirm("¿Quieres eliminar este jugador?");

    if (confirmar) {
      setJugadores((actuales) =>
        actuales.filter((jugador) => jugador.id !== id),
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 px-5 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600"
        >
          ← Volver al inicio
        </Link>

        <h1 className="mb-8 text-4xl font-bold">
          👥 Plantilla SD Compostela
        </h1>

        <section className="mb-8 rounded-2xl bg-slate-800 p-6">
          <h2 className="mb-5 text-2xl font-bold">➕ Añadir jugador</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Nombre</span>
              <input
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                placeholder="Nombre del jugador"
                className="rounded-lg bg-slate-700 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span>Dorsal</span>
              <input
                value={dorsal}
                onChange={(evento) => setDorsal(evento.target.value)}
                placeholder="Ejemplo: 8"
                className="rounded-lg bg-slate-700 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span>Demarcación</span>
              <select
                value={demarcacion}
                onChange={(evento) => setDemarcacion(evento.target.value)}
                className="rounded-lg bg-slate-700 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Portero</option>
                <option>Central</option>
                <option>Lateral derecho</option>
                <option>Lateral izquierdo</option>
                <option>Mediocentro</option>
                <option>Interior</option>
                <option>Mediapunta</option>
                <option>Extremo derecho</option>
                <option>Extremo izquierdo</option>
                <option>Delantero</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span>Pie dominante</span>
              <select
                value={pie}
                onChange={(evento) => setPie(evento.target.value)}
                className="rounded-lg bg-slate-700 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Derecho</option>
                <option>Izquierdo</option>
                <option>Ambidiestro</option>
              </select>
            </label>
          </div>

          <button
            onClick={añadirJugador}
            className="mt-5 w-full rounded-xl bg-blue-600 p-4 text-lg font-bold hover:bg-blue-700"
          >
            Guardar jugador
          </button>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Jugadores</h2>

            <span className="rounded-full bg-blue-600 px-4 py-2 font-bold">
              {jugadores.length} / 24
            </span>
          </div>

          <div className="space-y-4">
            {jugadores.map((jugador) => (
              <article
                key={jugador.id}
                className="flex flex-col gap-4 rounded-2xl bg-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold">
                    {jugador.dorsal ? `${jugador.dorsal} · ` : ""}
                    {jugador.nombre}
                  </h3>

                  <p className="mt-1 text-slate-300">
                    {jugador.demarcacion} · Pie {jugador.pie.toLowerCase()}
                  </p>
                </div>

                <button
                  onClick={() => eliminarJugador(jugador.id)}
                  className="rounded-lg bg-red-600 px-4 py-2 font-bold hover:bg-red-700"
                >
                  Eliminar
                </button>
              </article>
            ))}

            {jugadores.length === 0 && (
              <p className="rounded-xl bg-slate-800 p-5 text-slate-300">
                Todavía no hay jugadores en la plantilla.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}