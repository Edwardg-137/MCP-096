import { useEffect, useState } from 'react'
import { CalendarioExpedientes } from '../components/calendario/CalendarioExpedientes.jsx'
import { FormularioApertura } from '../components/expedientes/FormularioApertura.jsx'
import { DetalleExpediente } from '../components/expedientes/DetalleExpediente.jsx'
import { ListaExpedientes } from '../components/expedientes/ListaExpedientes.jsx'
import { Aviso } from '../components/layout/Aviso.jsx'
import { Icono } from '../components/layout/Icono.jsx'
import {
  ESTADOS,
  agregarActividad,
  buscarExpedientes,
  cerrarExpediente,
  crearExpediente,
  ordenarExpedientes,
  pasarASeguimiento,
  reabrirExpediente,
} from '../domain/expediente.js'
import { guardarExpedientes, leerExpedientes } from '../services/expedientes.js'
import { recortar } from '../utils/texto.js'

export function PaginaExpedientes() {
  const [expedientes, setExpedientes] = useState([])
  const [listo, setListo] = useState(false)
  const [puedeGuardar, setPuedeGuardar] = useState(false)
  const [seleccionadoId, setSeleccionadoId] = useState(null)
  const [ultimaEntradaId, setUltimaEntradaId] = useState(null)
  const [zona, setZona] = useState('lista')
  const [vista, setVista] = useState('registro')
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [aviso, setAviso] = useState(null)
  const [avisoGuardado, setAvisoGuardado] = useState(null)

  useEffect(() => {
    const lectura = leerExpedientes()
    const ordenados = ordenarExpedientes(lectura.expedientes)
    setExpedientes(ordenados)
    setPuedeGuardar(lectura.ok)
    if (!lectura.ok) setAvisoGuardado({ tipo: 'error', texto: lectura.mensaje })
    if (ordenados.length > 0) {
      setSeleccionadoId(ordenados[0].id)
      setZona('lista')
    } else {
      setSeleccionadoId(null)
      setZona('panel')
    }
    setListo(true)
  }, [])

  useEffect(() => {
    if (!listo || !puedeGuardar) return
    const resultado = guardarExpedientes(expedientes)
    setAvisoGuardado(resultado.ok ? null : { tipo: 'error', texto: resultado.mensaje })
  }, [expedientes, listo, puedeGuardar])

  const ordenados = ordenarExpedientes(expedientes)
  const visibles = buscarExpedientes(ordenados, filtroTexto, filtroEstado)
  const seleccionado = ordenados.find((expediente) => expediente.id === seleccionadoId) ?? null
  const consulta = recortar(filtroTexto)
  const mensajeSinResultados = consulta
    ? 'No hay expedientes que coincidan con la búsqueda.'
    : 'No hay expedientes en este estado.'

  function abrir(valores) {
    const resultado = crearExpediente(valores)
    if (!resultado.ok) return resultado
    setExpedientes((lista) => ordenarExpedientes([resultado.expediente, ...lista]))
    setSeleccionadoId(resultado.expediente.id)
    setUltimaEntradaId(resultado.expediente.historial[0].id)
    setZona('panel')
    setAviso({ tipo: 'ok', texto: `Expediente ${resultado.expediente.id} abierto.` })
    return resultado
  }

  function aplicar(resultado, mensaje) {
    if (!resultado.ok) {
      setAviso(
        resultado.errores.general ? { tipo: 'error', texto: resultado.errores.general } : null,
      )
      return resultado
    }
    const ultima = resultado.expediente.historial.at(-1)
    setExpedientes((lista) =>
      lista.map((expediente) =>
        expediente.id === resultado.expediente.id ? resultado.expediente : expediente,
      ),
    )
    setSeleccionadoId(resultado.expediente.id)
    setUltimaEntradaId(ultima?.id ?? null)
    setZona('panel')
    setAviso({ tipo: 'ok', texto: mensaje })
    return resultado
  }

  function elegir(id) {
    setSeleccionadoId(id)
    setUltimaEntradaId(null)
    setZona('panel')
    setAviso(null)
  }

  function abrirDesdeCalendario(id) {
    setSeleccionadoId(id)
    setUltimaEntradaId(null)
    setVista('registro')
    setZona('panel')
    setAviso(null)
  }

  function nuevo() {
    setSeleccionadoId(null)
    setUltimaEntradaId(null)
    setZona('panel')
    setAviso(null)
  }

  return (
    <main className="pagina">
      <header className="encabezado">
        <h1>Bufete</h1>
        <p>{vista === 'calendario' ? 'Calendario' : 'Expedientes'}</p>
      </header>
      {listo && (
        <nav className="vistas" aria-label="Vistas">
          <button
            className={vista === 'registro' ? 'vista vista-activa' : 'vista'}
            type="button"
            aria-current={vista === 'registro' ? 'page' : undefined}
            onClick={() => setVista('registro')}
          >
            <Icono nombre="expediente" />
            Expedientes
          </button>
          <button
            className={vista === 'calendario' ? 'vista vista-activa' : 'vista'}
            type="button"
            aria-current={vista === 'calendario' ? 'page' : undefined}
            onClick={() => setVista('calendario')}
          >
            <Icono nombre="calendario" />
            Calendario
          </button>
        </nav>
      )}

      {!listo ? (
        <p className="cargando">Cargando expedientes…</p>
      ) : (
        <>
          <div className="avisos">
            <Aviso tipo={avisoGuardado?.tipo} texto={avisoGuardado?.texto} />
            <Aviso tipo={aviso?.tipo} texto={aviso?.texto} />
          </div>

          {vista === 'calendario' ? (
            <CalendarioExpedientes expedientes={ordenados} onElegir={abrirDesdeCalendario} />
          ) : (
            <>
          <div className="barra">
            <label className="campo campo-buscar">
              <span className="etiqueta-buscar">
                <Icono nombre="buscar" />
                Buscar
              </span>
              <input
                type="text"
                value={filtroTexto}
                placeholder="Identificador o alias"
                autoComplete="off"
                onChange={(evento) => setFiltroTexto(evento.target.value)}
              />
            </label>
            <label className="campo campo-estado">
              <span>Estado</span>
              <select value={filtroEstado} onChange={(evento) => setFiltroEstado(evento.target.value)}>
                <option value="Todos">Todos</option>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </label>
            <button className="boton" type="button" onClick={nuevo}>
              <Icono nombre="agregar" />
              Nuevo
            </button>
          </div>

          <div className={zona === 'panel' ? 'cuerpo viendo-panel' : 'cuerpo viendo-lista'}>
            <section className="zona zona-lista" aria-label="Listado de expedientes">
              <ListaExpedientes
                expedientes={visibles}
                hayGuardados={expedientes.length > 0}
                seleccionadoId={seleccionadoId}
                mensajeSinResultados={mensajeSinResultados}
                onElegir={elegir}
              />
            </section>
            <section className="zona zona-panel" aria-label="Expediente">
              <div className="panel" key={seleccionado?.id ?? 'alta'}>
                <button className="volver" type="button" onClick={() => setZona('lista')}>
                  <Icono nombre="volver" />
                  Volver
                </button>
                {seleccionado ? (
                  <DetalleExpediente
                    expediente={seleccionado}
                    recienteId={ultimaEntradaId}
                    onActividad={(datos) => aplicar(agregarActividad(seleccionado, datos), 'Actividad registrada.')}
                    onSeguimiento={() =>
                      aplicar(pasarASeguimiento(seleccionado), 'El expediente pasó a seguimiento.')
                    }
                    onCerrar={(motivo) =>
                      aplicar(cerrarExpediente(seleccionado, motivo), 'Expediente cerrado.')
                    }
                    onReabrir={(motivo) =>
                      aplicar(reabrirExpediente(seleccionado, motivo), 'Expediente reabierto.')
                    }
                  />
                ) : (
                  <FormularioApertura onAbrir={abrir} />
                )}
              </div>
            </section>
          </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
