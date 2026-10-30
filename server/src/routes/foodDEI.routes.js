import express from 'express';
import controller from '../controllers/foodDei.controller.js';
const router = express.Router();

// --- RUTAS DE LA API ---
router.get('/menu', controller.getMenu);
router.get('/reserva', controller.getReserva);
router.post('/reserva/agregar', controller.agregarReserva);
router.put('/reserva/actualizar-porciones/:id', controller.actualizarPorciones);
router.delete('/reserva/eliminar/:id', controller.eliminarReserva);
router.post('/reserva/reiniciar', controller.reiniciarReserva);
router.post('/reserva/confirmar', controller.confirmarReserva);

export default router;