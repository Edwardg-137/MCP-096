import { ordenarHistorial } from '../../domain/expediente.js'
import { formatearFecha } from '../../utils/fecha.js'

const ETIQUETA = {
  apertura: 'Apertura',
  estado: 'Cambio de estado',
  actividad: 'Actividad',
}

export function Historial({ historial, recienteId }) {
  const entradas = ordenarHistorial(historial)

  return (
    <section className="historial">
      <h3>Historial</h3>
      <ol className="hilo">
        {entradas.map((entrada) => (
          <li
            key={entrada.id}
            className={entrada.id === recienteId ? 'hilo-entrada reciente' : 'hilo-entrada'}
            ref={entrada.id === recienteId ? desplazarSiHaceFalta : undefined}
          >
            <span className={`nodo nodo-${entrada.tipo}`} />
            <div>
              <p className="entrada-tipo">{ETIQUETA[entrada.tipo] ?? entrada.tipo}</p>
              {entrada.tipoActividad ? <p className="entrada-detalle">{entrada.tipoActividad}</p> : null}
              <p className="entrada-texto">{entrada.texto}</p>
              <p className="entrada-fecha">{formatearFecha(entrada.en)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function desplazarSiHaceFalta(nodo) {
  nodo?.scrollIntoView({ block: 'nearest' })
}
