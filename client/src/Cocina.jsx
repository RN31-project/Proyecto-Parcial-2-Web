import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardImg, Row, Col, Navbar, NavbarBrand, Badge, UncontrolledAlert, ListGroup, ListGroupItem, ButtonGroup, Container} from 'reactstrap'
import { useEffect, useRef, useState } from 'react'



function Cocina() 
  {
    const [menuOpen, setMenuOpen] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const menuExtend = useRef(null)
    const [menu, setMenu] = useState([])
    const [reserva, setReserva] = useState({saldo: 25.00, total: 0.00, itemsReservados: [], confirmada: false})
    const[errorMsg, setErrorMsg] = useState(null)

    // Cargando el menu desde el Backend para iniciar la pagina
      const cargarDatos = async() => { 
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
      await cargarDatos();

    }catch(error){
      setErrorMsg(error.message);
    }
  };
// Boton + y - que actualiza la cantidad de porciones de un plato en el carrito de compras.
  const actualizarPorciones = async(id, cantidad) => {
        setErrorMsg(null);
        try{
        const response = await fetch(`http://localhost:4000/api/reserva/actualizar-porciones/${id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ cantidad })
        });
        const data = await response.json();
        if(!response.ok){
          throw new Error(data.message || "Error al actualizar porciones");
        }

        await cargarDatos();

      }catch(error){
        setErrorMsg(error.message);
      }
      };
// Funcionamiento del boton Quitar, que elimina el plato del carrito de compras.
      const quitarPlato = async(id) => {
        setErrorMsg(null);
        try{
          const response = await fetch(`http://localhost:4000/api/reserva/eliminar/${id}`, {
            method: 'DELETE',
          headers: {'Content-Type': 'application/json'}
          });
          const data = await response.json();
          if(!response.ok){
            throw new Error(data.message || "Error al quitar plato");
          }
          await cargarDatos();
        }catch(error){
          setErrorMsg(error.message);
        }
      };
// Confirmar la reserva y bloquear el stock de los platos reservados
      const confirmarReserva = async() => {
        setErrorMsg(null);
        try{
          const response = await fetch(`http://localhost:4000/api/reserva/confirmar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
          });
          const data = await response.json();
          if(!response.ok){
            throw new Error(data.message || "Error al confirmar reserva");
          }
          await cargarDatos();
        }catch(error){
          setErrorMsg(error.message);
        }
      };
// Reinicia la reserva y el temporizador de 5 minutos
      const reiniciarReserva = async() => {
        setErrorMsg(null);
        try{ 
          const response = await fetch(`http://localhost:4000/api/reserva/reiniciar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
          });
          const data = await response.json();
          if(!response.ok){
            throw new Error(data.message || "Error al reiniciar reserva");
          }
          await cargarDatos();
        }catch(error){
          setErrorMsg(error.message);
        }
      };  
// Temporizador de 5 minutos max para confirmar la reserva
      const [tiempo, setTiempo] = useState(300); // 5 minutos en segundos
// Se reinicia la reserva y se muestra un mensaje cuando el tiempo llega a cero
      useEffect(() => {
  const alAcabarTiempo = async () => {
    await reiniciarReserva()
    setErrorMsg('Se acabó el tiempo. Inicia nuevamente.')
    setTiempo(300)
  }
  if (tiempo === 0) alAcabarTiempo()
}, [tiempo])
     useEffect(() => {
      if (reserva.confirmada) return
        const timer = setInterval(() => {
        setTiempo((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
        }, [reserva.confirmada])

        
// Se agregan los event listeners para cerrar el menú y la ayuda al hacer clic fuera o presionar Escape
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

  // Convertir el tiempo restante en minutos y segundos para mostrarlo en la interfaz
   const minutos = Math.floor(tiempo / 60)
  const segundos = tiempo % 60

  return (
    <> {/*Contenedor principal de React para permitir multiples elementos de Raiz (se uzo IA para esta solucion)*/}

      <Navbar color="dark" dark expand="md" className="w-100 m-0 shadow-sm">
        <NavbarBrand href="#" className="kaushan-script-regular">
          <img src="/img/logoFood.png" alt="Logo Food DEI" className="logo-navbar" />
          Food DEI S.A de R.L</NavbarBrand>
        <div className="ms-auto d-flex gap-3 align-items-center text-white">
          <span>
        <Badge color="danger" pill className = "fs-6"> Tiempo para confirmar reserva: {minutos}:{String(segundos).padStart(2, '0')}</Badge>
      </span>
        <span>Saldo diario:<strong> ${reserva.saldo.toFixed(2)}</strong></span>
        <span>
          Total de tu reserva: <Badge color="dark" pill className = "fs-6">${reserva.total.toFixed(2)}</Badge>
        </span>
      </div>
      </Navbar>

    <main className="app-fondo">
      {/* Mostrar una Alerta si el Backend rechaza una accion*/}
      {errorMsg && (
          <div className="alerta-flotante">
          <UncontrolledAlert color= "warning">
            <strong>Aviso:</strong> {errorMsg}
          </UncontrolledAlert>
          </div>
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
            <Row>
            <Col md= "8">
      <Row className="w-100 justify-content-center">
       {menu.map((plato) => (
        <Col xs = "12" md = "4" className= "mb-4" key={plato.id}>
          <Card className="game-card shadow h-100">
            <CardBody className ="game-card-body">
            <CardImg top src={plato.img} alt={plato.nombre} className="plato-img" />
              <Badge color= "success" className = "mb-2">{plato.categoria}</Badge>
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
    </Col>
       <Col md="4">
        <Card className="game-card shadow h-100">
          <CardBody className="game-card-body">
            <h4 className="carrito-titulo">Bandeja de reservas</h4>
            <ListGroup>
              {reserva.itemsReservados.map((item) => {
                const plato = menu.find(p => p.id === item.id);
                return ( 
                  <ListGroupItem key={item.id} className="carrito-item">
                    {plato ? plato.nombre : 'Plato no encontrado'} - Cantidad: {item.cantidad} 
                    <ButtonGroup className="ms-2">
                      <Button color="success" size="sm" disabled={reserva.itemsReservados.length === 0 || reserva.confirmada} onClick={() => actualizarPorciones(item.id, item.cantidad + 1)}>+</Button>
                      <Button color="danger" size="sm" disabled={reserva.itemsReservados.length === 0 || reserva.confirmada} onClick={() => actualizarPorciones(item.id, item.cantidad - 1)}>-</Button>
                    </ButtonGroup>
                    <Button color="danger" outline size="sm" className="ms-2" disabled={reserva.itemsReservados.length === 0 || reserva.confirmada} onClick={() => quitarPlato(item.id)}>Quitar</Button>
                  </ListGroupItem>
                )
              })}
            </ListGroup>
            <p className="game-description mt-3">Total de la reserva: <strong>${reserva.total.toFixed(2)}</strong></p>
            <Button color="success" className="w-100 mt-3" disabled={reserva.itemsReservados.length === 0 || reserva.confirmada} onClick={confirmarReserva}>
              Confirmar Reserva
            </Button>
            <Button color="success" className="w-100 mt-2" disabled={reserva.itemsReservados.length === 0 || !reserva.confirmada} onClick={reiniciarReserva}>
              Reiniciar Reserva
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
