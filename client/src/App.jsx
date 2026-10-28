import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, Form, FormGroup, Input, Label } from 'reactstrap'
import { efectoMouseReact } from './efectcss.js'

function createSecretNumber() {
  return Math.floor(Math.random() * 100) + 1
}

function App() {
  const [secretNumber, setSecretNumber] = useState(createSecretNumber)
  const [guess, setGuess] = useState('')
  const [diceNumber, setDiceNumber] = useState(null)
  const [animando, setAnimando] = useState(false)
  const [message, setMessage] = useState('Escribe un número y descubre si puedes acertar.')
  const [attempts, setAttempts] = useState(0)
  const [hasWon, setHasWon] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const intervaloExtend = useRef(null)
  const timeoutExtend = useRef(null)
  const menuExtend = useRef(null)

  useEffect(() => {
    return () => {
      clearInterval(intervaloExtend.current)
      clearTimeout(timeoutExtend.current)
    }
  }, [])
  // Se limpia el intervalo y el timeout al desmontar el componente para evitar fugas de memoria

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
  function startNewGame() {
    clearInterval(intervaloExtend.current)
    clearTimeout(timeoutExtend.current)
    intervaloExtend.current = null
    timeoutExtend.current = null
    setSecretNumber(createSecretNumber())
    setGuess('')
    setDiceNumber(null)
    setAnimando(false)
    setAttempts(0)
    setHasWon(false)
    setMessage('Nuevo juego. Escribe un número para comenzar.')
    setMenuOpen(false)
    setShowHelp(false)
  }
  function handleSubmit(event) {
    event.preventDefault()
    if (animando) return

    if (hasWon) {
      setSecretNumber(createSecretNumber())
      setGuess('')
      setDiceNumber(null)
      setMessage('Nuevo juego. Escribe un número para comenzar.')
      setAttempts(0)
      setHasWon(false)
      return
    }

    const number = Number(guess)
    if (!Number.isInteger(number) || number < 1 || number > 100) {
      setMessage('Ingresa un número entero entre 1 y 100.')
      return
    }
    // se genera un número aleatorio entre 1 y 100 para simular el giro del dado

    setAnimando(true)
    // se muestra un mensaje indicando que el dado está girando
    setMessage('El dado está girando...')
    const tiempoAnimacion = Math.floor(Math.random() * 2000) + 1500
    //se le determina un tiempo aleatorio entre 1.5 y 3.5 segundos para que el dado gire antes de mostrar el resultado

    intervaloExtend.current = setInterval(() => {
      setDiceNumber(createSecretNumber())
    }, 50)
      // se cambia el número del dado cada 50ms para simular el giro
    timeoutExtend.current = setTimeout(() => {
      clearInterval(intervaloExtend.current)
      intervaloExtend.current = null
      timeoutExtend.current = null
      setDiceNumber(number)
      setGuess('')
      setAnimando(false)
      //se muestra el número que el usuario ingresó como resultado del dado
      const nextAttempts = attempts + 1
      setAttempts(nextAttempts)
      if (number === secretNumber) {
        setMessage(`¡Correcto! Adivinaste en ${nextAttempts} ${nextAttempts === 1 ? 'intento' : 'intentos'}.`)
        setHasWon(true)
      } else {
        setMessage(number < secretNumber ? 'El número secreto es más alto. ¡Prueba otra vez!' : 'El número secreto es más bajo. ¡Prueba otra vez!')
      }
    // se determina si el número ingresado es correcto, mayor o menor que el número secreto y se muestra un mensaje correspondiente
    }, tiempoAnimacion)
  }return (
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
          <div className="game-icon" aria-hidden="true">?</div>
          <p className="game-acom-icono">UN JUEGO DE INGENIO</p>
          <h1>Adivina el número</h1>
          <p className="game-description">
            Estoy pensando en un número del <strong>1 al 100</strong>. ¿Puedes adivinarlo?
          </p>
          <section className="dice-section" aria-label="Dado de cien caras">
            <p className="dice-label">DADO DE 100 CARAS</p>
            <output className={`dice-result${animando ? ' is-rolling' : ''}${hasWon ? ' is-correct' : ''}`} aria-live="polite">
              {diceNumber ?? '--'}
            </output>
          </section>
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Label for="guess" className="visually-hidden">Tu número</Label>
              <Input
                id="guess"
                type="number"
                min="1"
                max="100"
                step="1"
                placeholder="Escribe tu número"
                value={guess}
                onChange={(event) => setGuess(event.target.value)}
                // se deshabilita el input si el usuario ha ganado o si el dado está girando
                disabled={hasWon || animando}
              />
            </FormGroup>
            <Button className="guess-button w-100" onMouseMove={efectoMouseReact} type="submit" disabled={animando}>
              {animando ? 'Lanzando dado...' : hasWon ? 'Jugar de nuevo' : 'Adivinar'}
            </Button>
          </Form>

          <p className="game-message" aria-live="polite">{message}</p>
          <p className="attempt-count">Intentos: {attempts}</p>
        </CardBody>
      </Card>
    </main>
  )
}
export default App
