export function enBlanco(valor) {
  return typeof valor !== 'string' || valor.trim() === ''
}

export function recortar(valor) {
  return typeof valor === 'string' ? valor.trim() : ''
}
