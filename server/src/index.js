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

app.listen(port, () => {
  console.log(`API disponible en http://localhost:${port}`);
});