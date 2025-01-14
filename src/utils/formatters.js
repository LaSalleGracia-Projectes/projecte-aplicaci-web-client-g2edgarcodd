/**
 * Formatea una duración en minutos a formato horas y minutos (ej: "2h 35m")
 * @param {number} minutes - Duración en minutos
 * @return {string} Duración formateada
 */
export function formatDuration(minutes) {
    if (!minutes) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  }
  
  /**
   * Formatea una fecha ISO a formato legible
   * @param {string} isoDate - Fecha en formato ISO
   * @return {string} Fecha formateada
   */
  export function formatDate(isoDate) {
    if (!isoDate) return 'N/A';
    
    const date = new Date(isoDate);
    
    // Opciones para formato español
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('es-ES', options);
  }
  
  /**
   * Trunca un texto si excede cierta longitud
   * @param {string} text - Texto a truncar
   * @param {number} maxLength - Longitud máxima
   * @return {string} Texto truncado
   */
  export function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Convierte un array en una lista formateada con comas
   * @param {Array} array - Array a formatear
   * @return {string} Lista formateada
   */
  export function formatList(array) {
    if (!array || !array.length) return 'N/A';
    
    if (array.length === 1) return array[0];
    
    return array.join(', ');
  }