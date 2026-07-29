"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then(() => {
        console.log("Service Worker registrado");
      })
      .catch((error) => {
        console.error(
          "Error al registrar el Service Worker:",
          error,
        );
      });
  }, []);

  return null;
}