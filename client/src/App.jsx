import { useEffect, useState } from 'react'
import { Alert, Button, Card, CardBody, CardText, CardTitle, Container } from 'reactstrap'

function App() {
  const [apiStatus, setApiStatus] = useState('Comprobando conexión con la API...')

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

  return (
    <main className="app-shell">
      <Container className="py-5">
        <Card className="welcome-card shadow-sm">
          <CardBody className="p-4 p-md-5">
            <p className="eyebrow mb-2">ENTORNO DE DESARROLLO</p>
            <CardTitle tag="h1" className="mb-3">
              Proyecto Parcial 2
            </CardTitle>
            <CardText className="text-secondary mb-4">
              La base del proyecto está lista. Puedes comenzar a construir tu aplicación.
            </CardText>
            <Alert color={apiStatus.startsWith('API') ? 'success' : 'info'} className="mb-4">
              {apiStatus}
            </Alert>
            <Button color="primary" href="https://reactstrap.github.io/" target="_blank" rel="noreferrer">
              Explorar Reactstrap
            </Button>
          </CardBody>
        </Card>
      </Container>
    </main>
  )
}

export default App
