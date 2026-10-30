import { Link } from 'react-router-dom'
import { Button, Card, CardBody, Row, Col, Navbar, NavbarBrand, Badge, UncontrolledAlert } from 'reactstrap'
import { useEffect, useRef, useState } from 'react'
import {CardImg} from 'reactstrap'

function Cocina() 
  {
    const [menuOpen, setMenuOpen] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const menuExtend = useRef(null)
    const [menu, setMenu] = useState([])
    const [reserva, setReserva] = useState({saldo: 25.00, total: 0.00, itemsReservados: []})
    const[errorMsg, setErrorMsg] = useState(null)

    // Cargando el menu desde el Backend para iniciar la pagina
      const cargarDatos = async () => {
        try{
          const responseMenu = await fetch('http://localhost:4000/api/menu');
          if(!responseMenu.ok) throw new Error("No se pudo cargar el menu");
          const dataMenu = await responseMenu.json();
          setMenu(dataMenu);

          const responseReserva = await fetch('http://localhost:4000/api/reserva');
          if(!responseReserva.ok) throw new Error("No se pudo cargar la reserva");
          const dataReserva = await responseReserva.json();
          setReserva(dataReserva);

          setErrorMsg(null); 
        }catch(error){
        setErrorMsg("Error al conectarse con el backend");
        }
      }

    useEffect(() => {
      cargarDatos();
    }, [])

    //Funcionamiento del boton Añadir a la reserva, que añade el plato al carrito de compras.
    const agregarPlato = async(alimentoId) => {
      setErrorMsg(null);
      try{
        const response = await fetch(`http://localhost:4000/api/reserva/agregar`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ alimentoId, cantidad: 1 })
      });

      const data = await response.json();

      if(!response.ok){
        throw new Error(data.message || data.message || "Stock Insuficiente");
      }
      cargarDatos();
      alert("Plato añadido a la reserva");

    }catch(error){
      setErrorMsg(error.message);
    }
  };

   useEffect(() => {
    if (!menuOpen && !showHelp) return undefined

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
    <> {/*Contenedor principal de React para permitir multiples elementos de Raiz (se uzo IA para esta solucion)*/}
      <Navbar color="dark" dark expand="md" className="w-100 m-0 shadow-sm">
        <NavbarBrand href="#">Food DEI S.A de R.L</NavbarBrand>
        <div className="ms-auto d-flex gap-3 align-items-center text-white">
        <span>Saldo disponible:<strong> ${reserva.saldo.toFixed(2)}</strong></span>
        <span>
          Total de tu reserva: <Badge color="dark" pill className = "fs-6">${reserva.total.toFixed(2)}</Badge>
        </span>
      </div>
      </Navbar>

    <main className="app-fondo">
      {/* Mostrar una Alerta si el Backend rechaza una accion*/}
      {errorMsg && (
        <container className="mb-3">
          <UncontrolledAlert color= "warning">
            <strong>Aviso:</strong> {errorMsg}
          </UncontrolledAlert>
        </container>
      )}

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
       {menu.map((plato) => (
        <Col xs = "12" md = "4" className= "mb-4" key={plato.id}>
          <Card className="game-card shadow h-100">
            <CardBody className ="game-card-body">

              <Badge color= "succes" className = "mb-2">{plato.categoria}</Badge>
              <h1>{plato.nombre}</h1>
              <p className = "game-description">
                Precio: <strong>${plato.precio.toFixed(2)}</strong><br />
                Stock disponible: <strong>{plato.stock}</strong>
              </p>

              {plato.stock === 0 ? (
                <Button color="secondary" disabled className="guess-button w-100">
                  Agotado
                </Button>
              ): (
                <Button color="primary" className="guess-button w-100" onClick={() => agregarPlato(plato.id)}>
                  Añadir al carrito
                </Button>
              )}
            </CardBody>
          </Card>
        </Col>
       ))}
    </Row>
    </main>
  </>
  )
}

export default Cocina
