export function Icono({ nombre }) {
  return (
    <svg
      className="icono"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {nombre === 'buscar' && (
        <>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </>
      )}
      {nombre === 'agregar' && <path d="M12 5v14M5 12h14" />}
      {nombre === 'persona' && (
        <>
          <circle cx="12" cy="8" r="3.25" />
          <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
        </>
      )}
      {nombre === 'expediente' && (
        <path d="M3.5 8.5h5l2 2h10v8.5h-17zM3.5 8.5v-2h6l1.5 2" />
      )}
      {nombre === 'reloj' && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.5l3 2" />
        </>
      )}
      {nombre === 'volver' && <path d="M15 5 8 12l7 7" />}
      {nombre === 'alerta' && (
        <>
          <path d="M12 4 3.5 19h17z" />
          <path d="M12 10v4" />
          <path d="M12 16.5h.01" />
        </>
      )}
      {nombre === 'confirmar' && <path d="m5 12 5 5L20 7" />}
    </svg>
  )
}
