// Importamos las traducciones de cada idioma
import { es } from "./es";
import { ca } from "./ca";
import { en } from "./en";

// Objeto básico de traducción en español como fallback para situaciones críticas
const basicTranslation = {
  common: {
    appName: "StreamHub",
    loading: "Cargando...",
    error: "Error",
  },
};

// Verificamos que cada traducción sea un objeto válido
const validateTranslation = (translation, name) => {
  try {
    if (
      !translation ||
      typeof translation !== "object" ||
      translation === null
    ) {
      console.error(`Error: La traducción '${name}' no es un objeto válido.`);
      return { ...basicTranslation };
    }
    console.log(
      `Traducción '${name}' cargada correctamente.`,
      Object.keys(translation).length
    );
    return translation;
  } catch (error) {
    console.error(`Error al procesar la traducción '${name}':`, error);
    return { ...basicTranslation };
  }
};

// Exportamos un objeto con todas las traducciones validadas
export const translations = {
  es: validateTranslation(es, "es"),
  ca: validateTranslation(ca, "ca"),
  en: validateTranslation(en, "en"),
};

// Verificación de integridad
console.log("Estado de todas las traducciones:", {
  es: Object.keys(translations.es).length > 0 ? "✅ Cargada" : "❌ Error",
  ca: Object.keys(translations.ca).length > 0 ? "✅ Cargada" : "❌ Error",
  en: Object.keys(translations.en).length > 0 ? "✅ Cargada" : "❌ Error",
});

// Exportar directamente los idiomas para facilitar su uso
export { es, ca, en };
