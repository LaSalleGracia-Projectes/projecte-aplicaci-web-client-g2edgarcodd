import React, { createContext, useState, useContext, useEffect } from "react";
import { es } from "../translations/es";
import { ca } from "../translations/ca";
import { en } from "../translations/en";

// Objeto simple con todas las traducciones
const allTranslations = {
  es,
  ca,
  en,
};

// Crear el contexto
const LanguageContext = createContext();

// Hook para usar el contexto de idioma
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage debe usarse dentro de un LanguageProvider");
  }
  return context;
}

export function LanguageProvider({ children }) {
  // Estado para el idioma actual (español por defecto)
  const [language, setLanguage] = useState(() => {
    try {
      // Intentar recuperar el idioma guardado en localStorage
      const savedLanguage = localStorage.getItem("language");
      return savedLanguage || "es"; // Español como valor predeterminado
    } catch (error) {
      console.error("Error al acceder a localStorage:", error);
      return "es"; // Español como fallback
    }
  });

  // Estado para controlar si las traducciones están cargadas correctamente
  const [translationsLoaded, setTranslationsLoaded] = useState(false);
  const [translationsError, setTranslationsError] = useState(null);

  // Verificar que las traducciones estén correctamente cargadas
  useEffect(() => {
    try {
      // Comprobar que todos los idiomas sean objetos válidos
      let valid = true;
      if (!allTranslations.es || typeof allTranslations.es !== "object") {
        console.error("Error: Traducciones en español no son válidas");
        valid = false;
      }
      if (!allTranslations.ca || typeof allTranslations.ca !== "object") {
        console.error("Error: Traducciones en catalán no son válidas");
        valid = false;
      }
      if (!allTranslations.en || typeof allTranslations.en !== "object") {
        console.error("Error: Traducciones en inglés no son válidas");
        valid = false;
      }

      if (valid) {
        console.log("Todas las traducciones se cargaron correctamente");
        setTranslationsLoaded(true);
      } else {
        setTranslationsError("Error al cargar las traducciones");
        // Fallback al español básico en caso de error
        console.warn("Usando traducciones básicas como fallback");
        setTranslationsLoaded(true); // Permitir que la app continúe cargando
      }
    } catch (error) {
      console.error("Error al verificar traducciones:", error);
      setTranslationsError("Error al verificar las traducciones");
      setTranslationsLoaded(true); // Permitir que la app continúe cargando
    }
  }, []);

  // Función para cambiar el idioma
  const changeLanguage = (newLanguage) => {
    if (newLanguage !== language && ["es", "ca", "en"].includes(newLanguage)) {
      console.log(`Cambiando idioma de ${language} a ${newLanguage}`);
      setLanguage(newLanguage);

      try {
        // Guardar la selección en localStorage
        localStorage.setItem("language", newLanguage);

        // Actualizar el atributo lang en el documento HTML
        document.documentElement.setAttribute("lang", newLanguage);
      } catch (error) {
        console.error("Error al guardar el idioma:", error);
      }
    }
  };

  // Función de traducción simplificada con mejor manejo de errores
  const t = (key, defaultValue = "") => {
    if (!key) return defaultValue || "";

    try {
      // Dividir la clave en partes (por ejemplo, "blog.title" -> ["blog", "title"])
      const keyParts = key.split(".");

      // Comenzar con las traducciones del idioma actual
      let translation = allTranslations[language];

      if (!translation) {
        console.warn(
          `No hay traducciones disponibles para el idioma: ${language}, usando español`
        );
        translation = allTranslations["es"] || {}; // Fallback a español o un objeto vacío
      }

      // Navegar por el objeto de traducción siguiendo las partes de la clave
      for (const part of keyParts) {
        if (!translation || typeof translation !== "object") {
          // Si en algún momento no podemos seguir navegando, intentar con español
          if (language !== "es") {
            // Intentar con el idioma español como fallback
            let fallbackTranslation = allTranslations["es"] || {};
            for (const fallbackPart of keyParts) {
              if (
                fallbackTranslation &&
                typeof fallbackTranslation === "object" &&
                fallbackPart in fallbackTranslation
              ) {
                fallbackTranslation = fallbackTranslation[fallbackPart];
              } else {
                return defaultValue || key;
              }
            }
            return fallbackTranslation || defaultValue || key;
          }
          return defaultValue || key;
        }

        if (!(part in translation)) {
          // Si la parte de la clave no existe en la traducción
          if (language !== "es") {
            // Intentar con el español como fallback
            let fallbackTranslation = allTranslations["es"] || {};
            for (const fallbackPart of keyParts) {
              if (
                fallbackTranslation &&
                typeof fallbackTranslation === "object" &&
                fallbackPart in fallbackTranslation
              ) {
                fallbackTranslation = fallbackTranslation[fallbackPart];
              } else {
                return defaultValue || key;
              }
            }
            return fallbackTranslation || defaultValue || key;
          }
          return defaultValue || key;
        }

        translation = translation[part];
      }

      return translation || defaultValue || key;
    } catch (error) {
      console.error(`Error al traducir la clave '${key}':`, error);
      return defaultValue || key;
    }
  };

  // Actualizar el atributo lang del documento al cambiar el idioma
  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  // Registrar el idioma actual en la consola para depuración
  useEffect(() => {
    console.log(`Idioma actual: ${language}`);
  }, [language]);

  // Si hay un error crítico en las traducciones, mostrar un mensaje básico en lugar de romper la aplicación
  if (translationsError && !translationsLoaded) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Error al cargar las traducciones</h2>
        <p>Por favor, recarga la página o contacta con el soporte técnico.</p>
      </div>
    );
  }

  // Proporcionar el contexto a los componentes hijos
  const value = {
    language,
    changeLanguage,
    t,
    translationsLoaded,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
