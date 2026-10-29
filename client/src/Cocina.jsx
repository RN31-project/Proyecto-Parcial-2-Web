import { Link } from 'react-router-dom'
import { Button, Card, CardBody, Row, Col, Navbar, NavbarBrand, Badge } from 'reactstrap'
import { useEffect, useRef, useState } from 'react'
import {CardImg} from 'reactstrap'

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
    <>
      <Navbar color="dark" dark expand="md" className="w-100 m-0 shadow-sm">
        <NavbarBrand href="#">Food DEI S.A de R.L</NavbarBrand>
      <div className="ms-auto d-flex gap-3 align-items-center text-white">
        <span>Saldo disponible:<strong> $25.00</strong></span>
        <span>
          Total de tu reserva: <Badge color="dark" pill className = "fs-6">$0.00</Badge>
        </span>
      </div>
      </Navbar>

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

      <Row className="w-100 justify-content-center">
        <Col xs="12" md="4" className="mb-4">
      <Card className="game-card shadow h-100">
        <CardBody className="game-card-body">
          <CardImg top src="/img/pizza-margarita.jpg" alt="Pizza Margarita" />
          <p className="game-acom-icono">Menu</p>
          <h1>Pizza Margarita</h1>
          <p className="game-description">
            Pizza con salsa de tomate, mozzarella y albahaca fresca.
          </p>
          <Button color="primary" className="guess-button w-100">
            Pedir plato
          </Button>
        </CardBody>
      </Card>
      </Col>

      <Col xs="12" md="4" className="mb-4">
      <Card className="game-card shadow h-100">
        <CardBody className="game-card-body">
          <CardImg top src="/img/pasta-bolonesa.jpg" alt="Pasta Boloñesa" />
          <p className="game-acom-icono">Menu</p>
          <h1>Pasta boloñesa</h1>
          <p className="game-description">
            Pasta con salsa boloñesa, carne molida, tomate, cebolla, ajo y especias.
          </p>
          <Button color="primary" className="guess-button w-100">
            Pedir plato
          </Button>
        </CardBody>
      </Card>
      </Col>

      <Col xs="12" md="4">
      <Card className="game-card shadow h-100">
        <CardBody className="game-card-body">
          <CardImg top src="/img/pasta-alfredo.jpg" alt="Pasta Alfredo" />
          <p className="game-acom-icono">Menu</p>
          <h1>Pasta Alfredo</h1>
          <p className="game-description">
            Pasta con champiñones crema, queso parmesano, ajo, mantequilla y especias.
          </p>
          <Button color="primary" className="guess-button w-100">
            Pedir plato
          </Button>
        </CardBody>
      </Card>
      </Col>
      </Row>
    </main>
  </>
  )
}

export default Cocina
