export const CLAVE_EXPEDIENTES = 'bufete.expedientes'

const MENSAJE_LECTURA =
  'No se pudieron leer los expedientes guardados en este navegador.'
const MENSAJE_ESCRITURA =
  'No se pudo guardar en el navegador. Los cambios siguen disponibles durante esta visita.'

export function leerExpedientes() {
  try {
    const crudo = localStorage.getItem(CLAVE_EXPEDIENTES)
    if (!crudo) return { ok: true, expedientes: [] }
    const datos = JSON.parse(crudo)
    if (!Array.isArray(datos)) return { ok: false, expedientes: [], mensaje: MENSAJE_LECTURA }
    return { ok: true, expedientes: datos }
  } catch {
    return { ok: false, expedientes: [], mensaje: MENSAJE_LECTURA }
  }
}

export function guardarExpedientes(expedientes) {
  try {
    localStorage.setItem(CLAVE_EXPEDIENTES, JSON.stringify(expedientes))
    return { ok: true }
  } catch {
    return { ok: false, mensaje: MENSAJE_ESCRITURA }
  }
}
