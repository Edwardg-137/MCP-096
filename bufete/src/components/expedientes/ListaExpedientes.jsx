import { Icono } from '../layout/Icono.jsx'

const CLASE_ESTADO = {
  Abierto: 'abierto',
  'En seguimiento': 'seguimiento',
  Cerrado: 'cerrado',
}

export function PastillaEstado({ estado }) {
  return <span className={`pastilla ${CLASE_ESTADO[estado] ?? ''}`}>{estado}</span>
}

export function ListaExpedientes({
  expedientes,
  hayGuardados,
  seleccionadoId,
  mensajeSinResultados,
  onElegir,
}) {
  if (!hayGuardados) {
    return (
      <div className="vacio">
        <Icono nombre="expediente" />
        <p>Todavía no hay expedientes.</p>
      </div>
    )
  }

  if (expedientes.length === 0) {
    return (
      <div className="vacio">
        <Icono nombre="buscar" />
        <p>{mensajeSinResultados}</p>
      </div>
    )
  }

  return (
    <ul className="lista">
      {expedientes.map((expediente) => {
        const activo = expediente.id === seleccionadoId
        return (
          <li key={expediente.id}>
            <button
              type="button"
              className={activo ? 'fila fila-activa' : 'fila'}
              aria-current={activo ? 'true' : undefined}
              onClick={() => onElegir(expediente.id)}
            >
              <span className="fila-id">{expediente.id}</span>
              <span className="fila-alias">{expediente.alias}</span>
              <span className="fila-responsable">{expediente.responsable}</span>
              <PastillaEstado estado={expediente.estado} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
