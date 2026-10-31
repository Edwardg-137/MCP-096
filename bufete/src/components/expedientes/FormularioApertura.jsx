import { useState } from 'react'
import { CATEGORIAS } from '../../domain/expediente.js'

const VACIO = { alias: '', descripcion: '', responsable: '', categoria: '' }

export function FormularioApertura({ onAbrir }) {
  const [valores, setValores] = useState(VACIO)
  const [errores, setErrores] = useState({})

  function cambiar(campo, valor) {
    setValores((actual) => ({ ...actual, [campo]: valor }))
    setErrores((actual) => {
      if (!actual[campo]) return actual
      const siguiente = { ...actual }
      delete siguiente[campo]
      return siguiente
    })
  }

  function enviar(evento) {
    evento.preventDefault()
    const resultado = onAbrir(valores)
    if (!resultado.ok) {
      setErrores(resultado.errores)
      const primero = ['alias', 'descripcion', 'responsable', 'categoria'].find(
        (campo) => resultado.errores[campo],
      )
      if (primero) document.getElementById(primero)?.focus()
      return
    }
    setValores(VACIO)
    setErrores({})
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <h2>Abrir expediente</h2>
      <Campo id="alias" etiqueta="Alias de la persona" error={errores.alias}>
        <input
          id="alias"
          value={valores.alias}
          autoComplete="off"
          aria-invalid={errores.alias ? 'true' : undefined}
          aria-describedby={errores.alias ? 'error-alias' : undefined}
          onChange={(evento) => cambiar('alias', evento.target.value)}
        />
      </Campo>
      <Campo id="descripcion" etiqueta="Descripción del asunto" error={errores.descripcion}>
        <textarea
          id="descripcion"
          rows="4"
          value={valores.descripcion}
          aria-invalid={errores.descripcion ? 'true' : undefined}
          aria-describedby={errores.descripcion ? 'error-descripcion' : undefined}
          onChange={(evento) => cambiar('descripcion', evento.target.value)}
        />
      </Campo>
      <Campo id="responsable" etiqueta="Responsable" error={errores.responsable}>
        <input
          id="responsable"
          value={valores.responsable}
          autoComplete="off"
          aria-invalid={errores.responsable ? 'true' : undefined}
          aria-describedby={errores.responsable ? 'error-responsable' : undefined}
          onChange={(evento) => cambiar('responsable', evento.target.value)}
        />
      </Campo>
      <Campo id="categoria" etiqueta="Categoría" error={errores.categoria}>
        <select
          id="categoria"
          value={valores.categoria}
          aria-invalid={errores.categoria ? 'true' : undefined}
          aria-describedby={errores.categoria ? 'error-categoria' : undefined}
          onChange={(evento) => cambiar('categoria', evento.target.value)}
        >
          <option value="">Sin categoría</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </Campo>
      <button className="boton" type="submit">
        Abrir expediente
      </button>
    </form>
  )
}

function Campo({ id, etiqueta, error, children }) {
  return (
    <label className="campo" htmlFor={id}>
      <span>{etiqueta}</span>
      {children}
      {error && (
        <span className="error-campo" id={`error-${id}`}>
          {error}
        </span>
      )}
    </label>
  )
}
