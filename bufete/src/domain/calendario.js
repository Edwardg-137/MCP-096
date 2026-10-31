import { cierresDe } from './expediente.js'

export const ETIQUETAS = ['Abierto', 'En seguimiento', 'Cerrado']

const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

export function nombresDia() {
  return DIAS
}

export function claveLocal(valor) {
  const fecha = valor instanceof Date ? valor : new Date(valor)
  if (Number.isNaN(fecha.getTime())) return ''
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

export function hoyClave(ahora = new Date()) {
  return claveLocal(ahora)
}

export function partesClave(clave) {
  const [anio, mes, dia] = clave.split('-').map(Number)
  if (!anio || !mes || !dia) return null
  return { anio, mes: mes - 1, dia }
}

export function tituloMes(anio, mes) {
  const texto = new Intl.DateTimeFormat('es-MX', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(anio, mes, 1))
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function tituloDia(clave) {
  const partes = partesClave(clave)
  if (!partes) return ''
  const texto = new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(
    new Date(partes.anio, partes.mes, partes.dia),
  )
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function sumarMes(anio, mes, delta) {
  const fecha = new Date(anio, mes + delta, 1)
  return { anio: fecha.getFullYear(), mes: fecha.getMonth() }
}

export function rejillaMes(anio, mes) {
  const primero = new Date(anio, mes, 1)
  const huecos = (primero.getDay() + 6) % 7
  const total = new Date(anio, mes + 1, 0).getDate()
  const celdas = Array.from({ length: huecos }, () => null)
  for (let dia = 1; dia <= total; dia += 1) celdas.push(dia)
  while (celdas.length % 7 !== 0) celdas.push(null)
  return celdas
}

function marcaEstado(expediente) {
  if (expediente.estado === 'Cerrado') {
    const cierres = cierresDe(expediente)
    return cierres.at(-1)?.en || expediente.cerradoEn || expediente.abiertoEn
  }
  if (expediente.estado === 'En seguimiento') {
    const historial = Array.isArray(expediente.historial) ? expediente.historial : []
    const marca = [...historial]
      .reverse()
      .find(
        (item) =>
          item.tipo === 'estado' &&
          typeof item.texto === 'string' &&
          !item.texto.startsWith('Cerrado.'),
      )
    return marca?.en || expediente.abiertoEn
  }
  return expediente.abiertoEn
}

export function citaDeExpediente(expediente) {
  const en = marcaEstado(expediente)
  const clave = claveLocal(en)
  if (!clave || !ETIQUETAS.includes(expediente.estado)) return null
  return {
    id: expediente.id,
    alias: expediente.alias,
    responsable: expediente.responsable,
    estado: expediente.estado,
    en,
    clave,
  }
}

export function citasVisibles(expedientes, etiquetas) {
  const activas = new Set(etiquetas)
  return expedientes
    .map(citaDeExpediente)
    .filter((cita) => cita && activas.has(cita.estado))
    .sort((a, b) => (a.en < b.en ? -1 : a.en > b.en ? 1 : a.alias.localeCompare(b.alias, 'es')))
}

export function citasDelMes(citas, anio, mes) {
  const prefijo = `${anio}-${String(mes + 1).padStart(2, '0')}-`
  return citas.filter((cita) => cita.clave.startsWith(prefijo))
}

export function citasDelDia(citas, clave) {
  if (!clave) return []
  return citas.filter((cita) => cita.clave === clave)
}
