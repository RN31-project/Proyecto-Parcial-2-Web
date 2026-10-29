import express from 'express';
import cors from 'cors';
import foodDeiRoutes from './routes/foodDEI.routes.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

// Configuración inicial 
app.use(cors());
app.use(express.json());

// Montar las rutas del Caso de Negocio 2 (Food DEI)
app.use('/api', foodDeiRoutes);

// Ruta de diagnóstico / health check
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', message: 'API conectada correctamente.' });
});

//dice si es mas o menos
app.post('/guess', (request, response) => {
  const numero  = Number(request.body.numero)
  //validar el num
  if(!Number.isInteger(numero) || numero < 1 || numero > 100){
    return response.status(400).json({ status: 'error', message: 'El número debe ser un entero entre 1 y 100.' })
  }
  if(numero===numeroOculto){
    return response.json({ resultado:'correcto', message: '¡Felicidades! Numero adivinado.' })
  }
  if(numero>numeroOculto){
    return response.json({ resultado:'mayor', message: 'El número secreto es menor.' })
  }
  return response.json({ resultado:'menor', message: 'El número secreto es mayor.' })
})

//generrar otro numero
app.post('/reset', (_request, response) => {
  numeroOculto = generarNum()
  response.json({ status: 'ok', message: 'Juego reiniciando...' })
})

app.listen(port, () => {
  console.log(`API disponible en http://localhost:${port}`);
});