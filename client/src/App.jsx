import { useEffect, useState } from 'react'
import { Alert, Button, Card, CardBody, CardText, CardTitle, Container } from 'reactstrap'

function App() {
  const [apiStatus, setApiStatus] = useState('Comprobando conexión con la API...')
  const [inputValue, setInputValue] = useState('')
  const [intentosFallidos, setIntentosFallidos] = useState(0)
  const[serverMessage, setServerMessage] = useState('')
  const[yaGanado, setYaGanado] = useState(false)
  const [historialNumeros, setHistorialNumeros] = useState([])

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('El servidor respondió con un error.')
        }

        return response.json()
      })
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus('No se pudo conectar con la API. Verifica que el servidor esté iniciado.'))
  }, [])

  const enviarIntento = async (e) => {
    e.preventDefault() //evitar que se recargue
    
    try {
    const respuesta = await fetch('/guess', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ numero : Number(inputValue) }),
    })
  const data = await respuesta.json()
  setServerMessage(data.message)

  if(!respuesta.ok){
    setServerMessage(data.message)
    return
  } else {
    setServerMessage(data.message)
  }

setHistorialNumeros([...historialNumeros, Number(inputValue)])

  switch (data.resultado) {
    case 'correcto':
      setYaGanado(true)
      break
    case 'mayor':
      setIntentosFallidos(intentosFallidos + 1)
      break
    case 'menor':
      setIntentosFallidos(intentosFallidos + 1)
      break
    default:
      break
  }

  setInputValue('') //limpiar
    }catch (error) {
  setServerMessage('Error al enviar el intento. Intenta nuevamente.')
  }
}

    const reiniciarJuego = async () => {
      try {
        const respuesta = await fetch('/reset', {
          method: 'POST',
        })
        const data = await respuesta.json()
        setServerMessage(data.message)
        setInputValue('')
        setIntentosFallidos(0)
        setYaGanado(false)
        setHistorialNumeros([])
      } catch (error) {
        setServerMessage('Error al reiniciar el juego. Intenta nuevamente.')
      }
    }

  return (
    <main className="app-shell">
      <Container className="py-5">
        <Card className="welcome-card shadow-sm">
          <CardBody className="p-4 p-md-5">
            <form onSubmit={enviarIntento}>
                <input type= "number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <Button color= "primary" type="submit" disabled={yaGanado}>
                  Intentar
                </Button>
            </form>
            <p>{serverMessage}</p>
            <p>intentos fallidos: {intentosFallidos}</p>
            <p>historial de numeros: {historialNumeros.map((num, index) => (
                <span key={index}>
                  {num}{index < historialNumeros.length - 1 ? ', ' : ''}
                  </span>
              ))}
            </p>
            {yaGanado && (<div><p>¡Felicidades! Adivinaste el número.</p></div>)}
            <Button color= "danger" onClick={reiniciarJuego}>
              Reiniciar Juego
            </Button>
          </CardBody>
        </Card>
      </Container>
    </main>
  )
}

export default App
