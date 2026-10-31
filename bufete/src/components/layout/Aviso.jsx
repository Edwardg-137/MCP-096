import { Icono } from './Icono.jsx'

export function Aviso({ tipo, texto }) {
  if (!texto) return null
  const esError = tipo === 'error'

  return (
    <p className={esError ? 'aviso aviso-error' : 'aviso aviso-ok'} role={esError ? 'alert' : 'status'}>
      <Icono nombre={esError ? 'alerta' : 'confirmar'} />
      <span>{texto}</span>
    </p>
  )
}
