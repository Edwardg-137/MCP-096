import { useState } from 'react'

export function FormularioActividad({ onRegistrar }) {
  const [descripcion, setDescripcion] = useState('')
  const [tipoActividad, setTipoActividad] = useState('')
  const [error, setError] = useState('')

  function cambiarDescripcion(valor) {
    setDescripcion(valor)
    if (error) setError('')
  }

  function enviar(evento) {
    evento.preventDefault()
    const resultado = onRegistrar({ descripcion, tipoActividad })
    if (!resultado.ok) {
      setError(resultado.errores.descripcion || resultado.errores.general || '')
      return
    }
    setDescripcion('')
    setTipoActividad('')
    setError('')
  }

  return (
    <form className="formulario formulario-corto" onSubmit={enviar} noValidate>
      <h3>Nueva actividad</h3>
      <label className="campo" htmlFor="actividad-descripcion">
        <span>Descripción de la actividad</span>
        <textarea
          id="actividad-descripcion"
          rows="3"
          value={descripcion}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'error-actividad' : undefined}
          onChange={(evento) => cambiarDescripcion(evento.target.value)}
        />
        {error && (
          <span className="error-campo" id="error-actividad">
            {error}
          </span>
        )}
      </label>
      <label className="campo" htmlFor="actividad-tipo">
        <span>Tipo de actividad</span>
        <input
          id="actividad-tipo"
          value={tipoActividad}
          autoComplete="off"
          onChange={(evento) => setTipoActividad(evento.target.value)}
        />
      </label>
      <button className="boton" type="submit">
        Registrar actividad
      </button>
    </form>
  )
}
