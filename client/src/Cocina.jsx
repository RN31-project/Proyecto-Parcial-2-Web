import { Link } from 'react-router-dom'
import { Button, Card, CardBody } from 'reactstrap'
import { useEffect, useRef, useState } from 'react'

function Cocina() 
  {
    const [menuOpen, setMenuOpen] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const menuExtend = useRef(null)

   useEffect(() => {
    if (!menuOpen && !showHelp) return undefined
    //
    function handlePointerDown(event) {
      if (!menuExtend.current?.contains(event.target)) {
        setMenuOpen(false)
        setShowHelp(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setShowHelp(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    // Se agregan los event listeners para cerrar el menú y la ayuda al hacer clic fuera o presionar Escape
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
    // Se eliminan los event listeners al desmontar el componente o cuando el menú y la ayuda están cerrados
  }, [menuOpen, showHelp])

  return (
    <main className="app-fondo">
      <nav className={`menu${menuOpen ? ' menu-is-open' : ''}`} aria-label="Menú del juego" ref={menuExtend}>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="game-menu-items"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}>
            {/* onclick garantiza que React utilice el valor más reciente del estado justo en el momento del clic*/}
          <span className="hamburger hamburger-1" />
          <span className="hamburger hamburger-2" />
          <span className="hamburger hamburger-3" />
          {/* Se utilizan tres spans para crear el icono de hamburguesa */}
        </button>
        <div className="menu-items" id="game-menu-items" hidden={!menuOpen}>
          <Link
            className="menu-item"
            to="/"
            onClick={() => {
              setMenuOpen(false)
            }}>
            <span className="menu-item-icon" aria-hidden="true">?</span>
            <span>Adivina el número</span>
          </Link>
          <Link className="menu-item"to="/cocina" onClick={() => setMenuOpen(false)}>
            <span className="menu-item-icon" aria-hidden="true">+</span>
            <span>Cocina</span>
          </Link>
        </div>
      </nav>
      <Card className="game-card shadow">
        <CardBody className="game-card-body">
          <div className="game-icon" aria-hidden="true">+</div>
          <p className="game-acom-icono">Menu</p>
          <h1>Pizza Margarita</h1>
          <p className="game-description">
            pizza con salsa de tomate, mozzarella y albahaca fresca.
          </p>
          <Button color="primary" className="guess-button w-100">
            pedir plato
          </Button>
        </CardBody>
      </Card>
      <Card className="game-card shadow">
        <CardBody className="game-card-body">
          <div className="game-icon" aria-hidden="true">+</div>
          <p className="game-acom-icono">Menu</p>
          <h1>Pasta boloñesa</h1>
          <p className="game-description">
            pasta salsa boloñesa, carne molida, tomate, cebolla, ajo y especias.
          </p>
          <Button color="primary" className="guess-button w-100">
            pedir plato
          </Button>
        </CardBody>
      </Card>
      <Card className="game-card shadow">
        <CardBody className="game-card-body">
          <div className="game-icon" aria-hidden="true">+</div>
          <p className="game-acom-icono">Menu</p>
          <h1>Pasta Alfredo</h1>
          <p className="game-description">
            pasta con champiñones crema, queso parmesano, ajo, mantequilla y especias.
          </p>
          <Button color="primary" className="guess-button w-100">
            pedir plato
          </Button>
        </CardBody>
      </Card>
    </main>
  )
}

export default Cocina
