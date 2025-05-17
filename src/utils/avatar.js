/**
 * Genera una URL de avatar usando DiceBear
 * @param {string} seed - String usado para generar el avatar (ej: nombre de usuario)
 * @param {string} style - Estilo de DiceBear (bottts, avataaars, identicon, etc)
 * @param {object} options - Opciones adicionales para el avatar
 * @returns {string} URL del avatar
 */
export const generateAvatar = (seed, style = "avataaars", options = {}) => {
  // Si no hay seed, generamos uno aleatorio
  const finalSeed = seed || Math.random().toString(36).substring(2, 10);

  // Sanitizamos el seed para URL
  const sanitizedSeed = encodeURIComponent(finalSeed);

  // Convertir opciones a parámetros de URL
  let optionsString = "";
  if (Object.keys(options).length > 0) {
    optionsString = Object.entries(options)
      .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
      .join("");
  }

  // Retornamos la URL del avatar con las opciones
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${sanitizedSeed}${optionsString}`;
};

/**
 * Obtiene avatar para un usuario basado en su rol o tipo
 * @param {string|null} avatarUrl - URL del avatar del usuario (si existe)
 * @param {string} username - Nombre de usuario para generar avatar si no hay URL
 * @param {string} userType - Tipo de usuario para determinar el estilo de avatar
 * @returns {string} URL del avatar
 */
export const getAvatarUrl = (avatarUrl, username, userType = "default") => {
  // Si hay URL y no es nula o indefinida, la usamos
  if (avatarUrl && avatarUrl !== "null" && avatarUrl !== "undefined") {
    return avatarUrl;
  }

  // Seleccionar estilo según el tipo de usuario
  let style = "avataaars";
  let options = {};

  switch (userType) {
    case "admin":
      style = "bottts";
      options = { backgroundColor: "b6e3f4" };
      break;
    case "moderator":
      style = "personas";
      options = { backgroundColor: "c0aede" };
      break;
    case "author":
      style = "micah";
      break;
    case "premium":
      style = "miniavs";
      options = { backgroundColor: "ffdfbf" };
      break;
    case "profile":
      style = "big-ears";
      break;
    default:
      // Asignar aleatoriamente uno de los estilos disponibles para variedad
      const styles = [
        "avataaars",
        "bottts",
        "personas",
        "micah",
        "miniavs",
        "lorelei",
        "initials",
      ];
      const randomIndex = Math.floor(Math.seed(username || "") * styles.length);
      style = styles[randomIndex] || "avataaars";
  }

  // Generar avatar con el estilo correspondiente
  return generateAvatar(username, style, options);
};

/**
 * Función auxiliar para generar números pseudoaleatorios pero deterministas basados en una semilla
 * @param {string} seed - Semilla para el generador
 * @returns {number} Un número entre 0 y 1
 */
Math.seed = function (seed) {
  // Algoritmo simple para generar un número basado en un string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // Convertir a entero de 32 bits
  }

  // Normalizar a un valor entre 0 y 1
  return Math.abs(hash) / 2147483647;
};
