import { ahoraIso } from '../utils/fecha.js'
import { enBlanco, recortar } from '../utils/texto.js'

export const ESTADOS = ['Abierto', 'En seguimiento', 'Cerrado']
export const CATEGORIAS = ['Civil', 'Familiar', 'Laboral']

const MENSAJE_SIN_ACTIVIDAD =
  'Este expediente está cerrado. No admite nuevas actividades.'

function crearId(prefijo) {
  const aleatorio = Math.random().toString(36).slice(2, 6)
  return `${prefijo}-${Date.now().toString(36)}-${aleatorio}`
}

function entrada(tipo, texto, ahora, extra = {}) {
  return { id: crearId('evt'), tipo, en: ahora, texto, ...extra }
}

export function crearExpediente(datos = {}, ahora = ahoraIso()) {
  const alias = recortar(datos.alias)
  const descripcion = recortar(datos.descripcion)
  const responsable = recortar(datos.responsable)
  const categoria = recortar(datos.categoria)
  const errores = {}

  if (enBlanco(datos.alias)) {
    errores.alias = 'Escribe el alias de la persona. No puede quedar vacío.'
  }
  if (enBlanco(datos.descripcion)) {
    errores.descripcion = 'Escribe una descripción breve del asunto.'
  }
  if (enBlanco(datos.responsable)) {
    errores.responsable = 'Escribe el nombre del responsable.'
  }
  if (categoria && !CATEGORIAS.includes(categoria)) {
    errores.categoria = 'Elige Civil, Familiar o Laboral, o deja la categoría vacía.'
  }
  if (Object.keys(errores).length > 0) return { ok: false, errores }

  return {
    ok: true,
    expediente: {
      id: crearId('exp'),
      abiertoEn: ahora,
      estado: 'Abierto',
      alias,
      descripcion,
      responsable,
      categoria,
      cerradoEn: null,
      motivoCierre: '',
      cierres: [],
      historial: [entrada('apertura', 'Expediente abierto.', ahora)],
    },
  }
}

export function cierresDe(expediente) {
  if (Array.isArray(expediente.cierres)) return expediente.cierres
  if (expediente.cerradoEn && !enBlanco(expediente.motivoCierre)) {
    return [{ en: expediente.cerradoEn, motivo: recortar(expediente.motivoCierre) }]
  }
  return []
}

export function agregarActividad(expediente, datos = {}, ahora = ahoraIso()) {
  if (expediente.estado === 'Cerrado') {
    return { ok: false, errores: { general: MENSAJE_SIN_ACTIVIDAD } }
  }
  if (enBlanco(datos.descripcion)) {
    return {
      ok: false,
      errores: { descripcion: 'Escribe la descripción de la actividad.' },
    }
  }

  const descripcion = recortar(datos.descripcion)
  const tipoActividad = recortar(datos.tipoActividad)
  return {
    ok: true,
    expediente: {
      ...expediente,
      historial: [
        ...expediente.historial,
        entrada('actividad', descripcion, ahora, { descripcion, tipoActividad }),
      ],
    },
  }
}

export function pasarASeguimiento(expediente, ahora = ahoraIso()) {
  if (expediente.estado !== 'Abierto') {
    return {
      ok: false,
      errores: { general: 'Solo un expediente abierto puede pasar a seguimiento.' },
    }
  }

  return {
    ok: true,
    expediente: {
      ...expediente,
      estado: 'En seguimiento',
      historial: [
        ...expediente.historial,
        entrada('estado', 'Pasó a seguimiento.', ahora),
      ],
    },
  }
}

export function cerrarExpediente(expediente, motivo, ahora = ahoraIso()) {
  if (expediente.estado === 'Cerrado') {
    return { ok: false, errores: { general: 'Este expediente ya está cerrado.' } }
  }
  if (expediente.estado !== 'En seguimiento') {
    return {
      ok: false,
      errores: { general: 'Pasa el expediente a seguimiento antes de cerrarlo.' },
    }
  }

  const errores = {}
  const motivoLimpio = recortar(motivo)
  const hayActividad = expediente.historial.some((item) => item.tipo === 'actividad')
  if (!hayActividad) {
    errores.actividad = 'Agrega al menos una actividad antes de cerrar.'
  }
  if (enBlanco(motivo)) {
    errores.motivo = 'Escribe el motivo de cierre.'
  }
  if (Object.keys(errores).length > 0) return { ok: false, errores }

  return {
    ok: true,
    expediente: {
      ...expediente,
      estado: 'Cerrado',
      cerradoEn: ahora,
      motivoCierre: motivoLimpio,
      cierres: [...cierresDe(expediente), { en: ahora, motivo: motivoLimpio }],
      historial: [
        ...expediente.historial,
        entrada('estado', `Cerrado. Motivo: ${motivoLimpio}`, ahora, { motivo: motivoLimpio }),
      ],
    },
  }
}

export function reabrirExpediente(expediente, motivo, ahora = ahoraIso()) {
  if (expediente.estado !== 'Cerrado') {
    return { ok: false, errores: { general: 'Solo se puede reabrir un expediente cerrado.' } }
  }
  if (enBlanco(motivo)) {
    return { ok: false, errores: { motivo: 'Escribe el motivo de reapertura.' } }
  }

  const motivoLimpio = recortar(motivo)
  return {
    ok: true,
    expediente: {
      ...expediente,
      estado: 'En seguimiento',
      cierres: cierresDe(expediente),
      historial: [
        ...expediente.historial,
        entrada(
          'estado',
          `Reabierto. Pasó de Cerrado a En seguimiento. Motivo: ${motivoLimpio}`,
          ahora,
          { motivo: motivoLimpio },
        ),
      ],
    },
  }
}

export function buscarExpedientes(lista, texto, estado) {
  const consulta = recortar(texto).toLowerCase()
  const filtro = !estado || estado === 'Todos' ? '' : estado

  return lista.filter((expediente) => {
    if (filtro && expediente.estado !== filtro) return false
    if (!consulta) return true
    return (
      expediente.id.toLowerCase().includes(consulta) ||
      expediente.alias.toLowerCase().includes(consulta)
    )
  })
}

export function ordenarExpedientes(lista) {
  return [...lista].sort((a, b) => (a.abiertoEn < b.abiertoEn ? 1 : a.abiertoEn > b.abiertoEn ? -1 : 0))
}

export function ordenarHistorial(historial) {
  return [...historial].sort((a, b) => (a.en < b.en ? -1 : a.en > b.en ? 1 : 0))
}
