"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Juvenil = {
  id: number;
  nombre: string;
  demarcacion: string;
  pie: string;
};

const CLAVE_JUVENILES = "donnici-teams-juveniles";

export default function Juveniles() {
  const [juveniles, setJuveniles] = useState<Juvenil[]>([]);
  const [cargado, setCargado] = useState(false);

  const [nombre, setNombre] = useState("");
  const [demarcacion, setDemarcacion] = useState("Portero");
  const [pie, setPie] = useState("Derecho");

  useEffect(() => {
    const guardados = localStorage.getItem(CLAVE_JUVENILES);

    if (guardados) {
      try {
        setJuveniles(JSON.parse(guardados));
      } catch {
        setJuveniles([]);
      }
    }

    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) {
      localStorage.setItem(CLAVE_JUVENILES, JSON.stringify(juveniles));
    }
  }, [juveniles, cargado]);

  function añadirJuvenil() {
    if (!nombre.trim()) {
      alert("Escribe el nombre del juvenil.");
      return;
    }

    if (juveniles.length >= 10) {
      alert("Ya tienes los 10 juveniles disponibles.");
      return;
    }

    const nuevoJuvenil: Juvenil = {
      id: Date.now(),
      nombre: nombre.trim(),
      demarcacion,
      pie,
    };

    setJuveniles((actuales) => [...actuales, nuevoJuvenil]);
    setNombre("");
    setDemarcacion("Portero");
    setPie("Derecho");
  }

  function eliminarJuvenil(id: number) {
    const confirmar = window.confirm(
      "¿Quieres eliminar este juvenil de la lista?",
    );

    if (confirmar) {
      setJuveniles((actuales) =>
        actuales.filter((juvenil) => juvenil.id !== id),
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

        <h1 className="mb-2 text-4xl font-bold">
          🔝 Juveniles disponibles
        </h1>

        <p className="mb-8 text-slate-400">
          Jugadores que pueden incorporarse a los entrenamientos.
        </p>

        <section className="mb-8 rounded-2xl bg-slate-800 p-6">
          <h2 className="mb-5 text-2xl font-bold">➕ Añadir juvenil</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 md:col-span-2">
              <span>Nombre</span>

              <input
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                placeholder="Nombre del juvenil"
                className="rounded-lg bg-slate-700 p-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span>Demarcación</span>

              <select
                value={demarcacion}
                onChange={(evento) => setDemarcacion(evento.target.value)}
                className="rounded-lg bg-slate-700 p-3 outline-none focus:ring-2 focus:ring-green-500"
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
                className="rounded-lg bg-slate-700 p-3 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>Derecho</option>
                <option>Izquierdo</option>
                <option>Ambidiestro</option>
              </select>
            </label>
          </div>

          <button
            onClick={añadirJuvenil}
            className="mt-5 w-full rounded-xl bg-green-600 p-4 text-lg font-bold hover:bg-green-700"
          >
            Guardar juvenil
          </button>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Lista de juveniles</h2>

            <span className="rounded-full bg-green-600 px-4 py-2 font-bold">
              {juveniles.length} / 10
            </span>
          </div>

          <div className="space-y-4">
            {juveniles.map((juvenil) => (
              <article
                key={juvenil.id}
                className="flex flex-col gap-4 rounded-2xl bg-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold">{juvenil.nombre}</h3>

                  <p className="mt-1 text-slate-300">
                    {juvenil.demarcacion} · Pie {juvenil.pie.toLowerCase()}
                  </p>
                </div>

                <button
                  onClick={() => eliminarJuvenil(juvenil.id)}
                  className="rounded-lg bg-red-600 px-4 py-2 font-bold hover:bg-red-700"
                >
                  Eliminar
                </button>
              </article>
            ))}

            {juveniles.length === 0 && (
              <p className="rounded-xl bg-slate-800 p-5 text-slate-300">
                Todavía no has añadido ningún juvenil.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}