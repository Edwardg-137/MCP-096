import { useState } from 'react'
import { FormularioActividad } from '../actividades/FormularioActividad.jsx'
import { Historial } from '../actividades/Historial.jsx'
import { Icono } from '../layout/Icono.jsx'
import { formatearFecha } from '../../utils/fecha.js'
import { cierresDe } from '../../domain/expediente.js'
import { PastillaEstado } from './ListaExpedientes.jsx'

export function DetalleExpediente({
  expediente,
  recienteId,
  onActividad,
  onSeguimiento,
  onCerrar,
  onReabrir,
}) {
  const abierto = expediente.estado === 'Abierto'
  const enSeguimiento = expediente.estado === 'En seguimiento'
  const cerrado = expediente.estado === 'Cerrado'
  const cierres = cierresDe(expediente)

  return (
    <article className="detalle">
      <header className="detalle-cabecera">
        <div className="detalle-titulo">
          <h2>{expediente.alias}</h2>
          <PastillaEstado estado={expediente.estado} />
        </div>
        <p className="identificador">{expediente.id}</p>
      </header>

      <div className="metas">
        <p>
          <Icono nombre="persona" />
          <span>{expediente.responsable}</span>
        </p>
        <p>
          <Icono nombre="reloj" />
          <span>Abierto el {formatearFecha(expediente.abiertoEn)}</span>
        </p>
        {expediente.categoria ? (
          <p>
            <Icono nombre="expediente" />
            <span>{expediente.categoria}</span>
          </p>
        ) : null}
      </div>

      <p className="asunto">{expediente.descripcion}</p>

      {cierres.length > 0 && (
        <section className="bloque-cierres">
          <h3>Cierres</h3>
          <ul className="cierres">
            {cierres.map((cierre, indice) => (
              <li key={`${cierre.en}-${indice}`}>
                <span>Cerrado el {formatearFecha(cierre.en)}</span>
                <span>Motivo: {cierre.motivo}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {cerrado && <p className="nota-cerrado">No admite nuevas actividades.</p>}

      {cerrado && <Reapertura key={expediente.historial.length} onReabrir={onReabrir} />}

      {abierto && (
        <button className="boton boton-secundario" type="button" onClick={onSeguimiento}>
          Pasar a seguimiento
        </button>
      )}

      {enSeguimiento && <Cierre key={expediente.historial.length} onCerrar={onCerrar} />}

      {(abierto || enSeguimiento) && <FormularioActividad key={expediente.id} onRegistrar={onActividad} />}

      <Historial historial={expediente.historial} recienteId={recienteId} />
    </article>
  )
}

function Cierre({ onCerrar }) {
  const [motivo, setMotivo] = useState('')
  const [errores, setErrores] = useState({})

  function cambiarMotivo(valor) {
    setMotivo(valor)
    setErrores((actual) => {
      if (!actual.motivo) return actual
      const siguiente = { ...actual }
      delete siguiente.motivo
      return siguiente
    })
  }

  function enviar(evento) {
    evento.preventDefault()
    const resultado = onCerrar(motivo)
    if (!resultado.ok) {
      setErrores(resultado.errores)
      return
    }
    setMotivo('')
    setErrores({})
  }

  return (
    <form className="formulario formulario-corto" onSubmit={enviar} noValidate>
      <h3>Cerrar expediente</h3>
      <label className="campo" htmlFor="motivo-cierre">
        <span>Motivo de cierre</span>
        <textarea
          id="motivo-cierre"
          rows="3"
          value={motivo}
          aria-invalid={errores.motivo ? 'true' : undefined}
          aria-describedby={errores.motivo ? 'error-motivo' : undefined}
          onChange={(evento) => cambiarMotivo(evento.target.value)}
        />
        {errores.motivo && (
          <span className="error-campo" id="error-motivo">
            {errores.motivo}
          </span>
        )}
      </label>
      {errores.actividad && <p className="error-campo">{errores.actividad}</p>}
      <button className="boton" type="submit">
        Cerrar expediente
      </button>
    </form>
  )
}

function Reapertura({ onReabrir }) {
  const [motivo, setMotivo] = useState('')
  const [errores, setErrores] = useState({})

  function cambiarMotivo(valor) {
    setMotivo(valor)
    setErrores((actual) => {
      if (!actual.motivo) return actual
      const siguiente = { ...actual }
      delete siguiente.motivo
      return siguiente
    })
  }

  function enviar(evento) {
    evento.preventDefault()
    const resultado = onReabrir(motivo)
    if (!resultado.ok) {
      setErrores(resultado.errores)
      return
    }
    setMotivo('')
    setErrores({})
  }

  return (
    <form className="formulario formulario-corto" onSubmit={enviar} noValidate>
      <h3>Reabrir expediente</h3>
      <label className="campo" htmlFor="motivo-reapertura">
        <span>Motivo de reapertura</span>
        <textarea
          id="motivo-reapertura"
          rows="3"
          value={motivo}
          aria-invalid={errores.motivo ? 'true' : undefined}
          aria-describedby={errores.motivo ? 'error-reapertura' : undefined}
          onChange={(evento) => cambiarMotivo(evento.target.value)}
        />
        {errores.motivo && (
          <span className="error-campo" id="error-reapertura">
            {errores.motivo}
          </span>
        )}
      </label>
      {errores.general && <p className="error-campo">{errores.general}</p>}
      <button className="boton" type="submit">
        Reabrir expediente
      </button>
    </form>
  )
}
