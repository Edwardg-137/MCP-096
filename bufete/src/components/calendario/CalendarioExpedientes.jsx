import { useEffect, useState } from 'react'
import {
  ETIQUETAS,
  citasDelDia,
  citasDelMes,
  citasVisibles,
  claveLocal,
  hoyClave,
  nombresDia,
  partesClave,
  rejillaMes,
  sumarMes,
  tituloDia,
  tituloMes,
} from '../../domain/calendario.js'
import { formatearFecha } from '../../utils/fecha.js'
import { Icono } from '../layout/Icono.jsx'

const CLASE_ESTADO = {
  Abierto: 'abierto',
  'En seguimiento': 'seguimiento',
  Cerrado: 'cerrado',
}

const MARCA_ESTADO = {
  Abierto: 'A',
  'En seguimiento': 'S',
  Cerrado: 'C',
}

const NOMBRES_CORTOS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']

function movimientoReducido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Rejilla({ anio, mes, citas, hoy, fecha, onElegirDia }) {
  const delMes = citasDelMes(citas, anio, mes)
  const porDia = new Map()
  for (const cita of delMes) {
    const grupo = porDia.get(cita.clave) ?? []
    grupo.push(cita)
    porDia.set(cita.clave, grupo)
  }

  return (
    <div className="rejilla">
      {rejillaMes(anio, mes).map((dia, indice) => {
        if (!dia) return <span className="dia-vacio" key={`vacio-${anio}-${mes}-${indice}`} />
        const clave = claveLocal(new Date(anio, mes, dia))
        const delDia = porDia.get(clave) ?? []
        const visibles = delDia.slice(0, 2)
        const resto = delDia.length - visibles.length
        const detalle = delDia.map((cita) => `${cita.alias}, ${cita.estado}`).join('; ')
        const nombre = `${dia} de ${tituloMes(anio, mes).replace(` de ${anio}`, '')}${
          clave === hoy ? ', hoy' : ''
        }${detalle ? `. ${detalle}` : '. Sin expedientes'}`

        return (
          <button
            key={clave}
            type="button"
            className={`dia${clave === hoy ? ' dia-hoy' : ''}${clave === fecha ? ' dia-elegido' : ''}`}
            aria-pressed={clave === fecha}
            aria-label={nombre}
            onClick={() => onElegirDia(clave)}
          >
            <span className="dia-numero">{dia}</span>
            {visibles.length > 0 && (
              <ul className="dia-citas">
                {visibles.map((cita) => (
                  <li key={cita.id} className={`dia-cita ${CLASE_ESTADO[cita.estado]}`}>
                    <span className="dia-etiqueta">{cita.estado}</span>
                    <span className="dia-marca" aria-hidden="true">
                      {MARCA_ESTADO[cita.estado]}
                    </span>
                    <span className="dia-alias">{cita.alias}</span>
                  </li>
                ))}
                {resto > 0 && <li className="dia-resto">+{resto}</li>}
              </ul>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function CalendarioExpedientes({ expedientes, onElegir }) {
  const ahora = new Date()
  const [visible, setVisible] = useState({ anio: ahora.getFullYear(), mes: ahora.getMonth() })
  const [etiquetas, setEtiquetas] = useState(ETIQUETAS)
  const [fecha, setFecha] = useState('')
  const [hoja, setHoja] = useState(null)
  const hoy = hoyClave(ahora)
  const citas = citasVisibles(expedientes, etiquetas)
  const delMes = citasDelMes(citas, visible.anio, visible.mes)
  const agenda = fecha ? citasDelDia(citas, fecha) : delMes
  const nombres = nombresDia()

  useEffect(() => {
    if (!hoja) return undefined
    const id = setTimeout(() => setHoja(null), 760)
    return () => clearTimeout(id)
  }, [hoja])

  function cambiarMes(delta) {
    if (!movimientoReducido()) {
      setHoja({
        anio: visible.anio,
        mes: visible.mes,
        sentido: delta > 0 ? 'adelante' : 'atras',
        id: Date.now(),
      })
    }
    setFecha('')
    setVisible((actual) => sumarMes(actual.anio, actual.mes, delta))
  }

  function elegirDia(clave) {
    setFecha((actual) => (actual === clave ? '' : clave))
  }

  function cambiarFecha(valor) {
    setFecha(valor)
    const partes = partesClave(valor)
    if (partes) setVisible({ anio: partes.anio, mes: partes.mes })
  }

  function irHoy() {
    const partes = partesClave(hoy)
    setVisible({ anio: partes.anio, mes: partes.mes })
    setFecha(hoy)
  }

  function alternarEtiqueta(estado) {
    setEtiquetas((actuales) =>
      actuales.includes(estado) ? actuales.filter((item) => item !== estado) : [...actuales, estado],
    )
  }

  let vacio = ''
  if (expedientes.length === 0) vacio = 'Todavía no hay expedientes.'
  else if (etiquetas.length === 0) vacio = 'Elige al menos una etiqueta.'
  else if (fecha && agenda.length === 0) vacio = 'No hay expedientes en esta fecha.'
  else if (!fecha && agenda.length === 0) vacio = 'No hay expedientes en este mes.'

  return (
    <section className="calendario" aria-label="Calendario">
      <div className="calendario-filtros">
        <fieldset className="etiquetas">
          <legend>Etiquetas</legend>
          <div className="etiqueta-grupo">
            {ETIQUETAS.map((estado) => {
              const activa = etiquetas.includes(estado)
              return (
                <button
                  key={estado}
                  type="button"
                  className={`etiqueta ${CLASE_ESTADO[estado]}${activa ? ' etiqueta-activa' : ''}`}
                  aria-pressed={activa}
                  onClick={() => alternarEtiqueta(estado)}
                >
                  {estado}
                </button>
              )
            })}
          </div>
        </fieldset>
        <label className="campo campo-fecha">
          <span>Fecha</span>
          <input type="date" value={fecha} onChange={(evento) => cambiarFecha(evento.target.value)} />
        </label>
        {fecha && (
          <button className="boton boton-secundario" type="button" onClick={() => setFecha('')}>
            Quitar fecha
          </button>
        )}
      </div>

      <div className="calendario-nav">
        <div className="nav-lado">
          <button className="paso" type="button" onClick={() => cambiarMes(-1)}>
            <Icono nombre="volver" />
            Mes anterior
          </button>
        </div>
        <h2>{tituloMes(visible.anio, visible.mes)}</h2>
        <div className="nav-lado nav-lado-fin">
          <button className="paso" type="button" onClick={() => cambiarMes(1)}>
            Mes siguiente
            <Icono nombre="siguiente" />
          </button>
          <button className="boton boton-secundario" type="button" onClick={irHoy}>
            Hoy
          </button>
        </div>
      </div>

      <div className="libro">
        <div className="rejilla rejilla-nombres" aria-hidden="true">
          {NOMBRES_CORTOS.map((nombre, indice) => (
            <span key={nombre} title={nombres[indice]}>
              {nombre}
            </span>
          ))}
        </div>
        <div className="rejilla-marco">
          <Rejilla
            anio={visible.anio}
            mes={visible.mes}
            citas={citas}
            hoy={hoy}
            fecha={fecha}
            onElegirDia={elegirDia}
          />
          {hoja && (
            <div
              key={hoja.id}
              className={`hoja-vuelta ${hoja.sentido}`}
              aria-hidden="true"
              inert
              onAnimationEnd={() => setHoja(null)}
            >
              <Rejilla
                anio={hoja.anio}
                mes={hoja.mes}
                citas={citas}
                hoy={hoy}
                fecha={fecha}
                onElegirDia={() => {}}
              />
            </div>
          )}
        </div>
      </div>

      <div className="agenda">
        <h3>{fecha ? tituloDia(fecha) : 'Expedientes del mes'}</h3>
        {vacio ? (
          <p className="vacio">{vacio}</p>
        ) : (
          <ul className="lista">
            {agenda.map((cita) => (
              <li key={cita.id}>
                <button className="fila" type="button" onClick={() => onElegir(cita.id)}>
                  <span className="fila-alias">{cita.alias}</span>
                  <span className={`pastilla ${CLASE_ESTADO[cita.estado]}`}>{cita.estado}</span>
                  <span className="fila-id">{cita.id}</span>
                  <span className="fila-responsable">{formatearFecha(cita.en)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
