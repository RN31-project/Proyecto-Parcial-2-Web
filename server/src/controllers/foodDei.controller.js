import { calcularTotalReserva } from '../utils/helpers.js';
// --- ESTADO EN MEMORIA (Food DEI S.A. de R.L.) ---
let menu = [
    { id: 101, nombre: "Pollo asado", precio: 4.00, stock: 12, categoria: "Fuerte" },
    { id: 102, nombre: "Carne asada", precio: 5.00, stock: 8, categoria: "Fuerte" },
    { id: 103, nombre: "Robalo chicharroneado", precio: 6.00, stock: 5, categoria: "Fuerte" },
    { id: 201, nombre: "Ensalada de lechuga y tomate", precio: 2.00, stock: 15, categoria: "Acompañamiento" },
    { id: 202, nombre: "Arroz blanco", precio: 1.50, stock: 20, categoria: "Acompañamiento" },
    { id: 203, nombre: "Papas fritas", precio: 2.50, stock: 10, categoria: "Acompañamiento" },
];

let reservaUsuario = {
    saldo: 25.00,       // Saldo diario inicial del usuario
    itemsReservados: [], // Estructura: [{ id: 101, cantidad: 2 }]
    confirmada: false // Indica si la reserva ha sido confirmada o no
};

// --- ENDPOINT 1: GET /api/menu ---
const getMenu = (_req, res) => {
    res.json(menu);
};

// --- ENDPOINT 2: GET /api/reserva ---
const getReserva = (_req, res) => {
    const total = calcularTotalReserva(reservaUsuario.itemsReservados, menu);
    res.json({
        saldo: reservaUsuario.saldo,
        itemsReservados: reservaUsuario.itemsReservados,
        total: Number(total.toFixed(2))
    });
};

// --- ENDPOINT 3: POST /api/reserva/agregar (Solo arma el carrito sin bloquear stock aún) ---
const agregarReserva = (req, res) => {
    // Si la reserva ya fue confirmada, no se puede modificar a menos que se reinicie
    if (reservaUsuario.confirmada) {
        return res.status(400).json({ error: "La reserva ya fue confirmada. Debe reiniciarla para hacer cambios." });
    }

    const { alimentoId, cantidad } = req.body;
    const idPlato = Number(alimentoId);
    const cant = Number(cantidad || 1);

    const plato = menu.find(p => p.id === idPlato);
    if (!plato) {
        return res.status(404).json({ error: "Plato no encontrado" });
    }

    // Validación preventiva: verificar que el stock en cocina sea al menos el que intenta agregar al carrito
    const itemExistente = reservaUsuario.itemsReservados.find(i => i.id === idPlato);
    const cantidadActualEnCarrito = itemExistente ? itemExistente.cantidad : 0;

    if (plato.stock < (cantidadActualEnCarrito + cant)) {
        return res.status(400).json({ message: "Stock insuficiente" });
    }

    // Agregar o actualizar en el carrito temporal
    if (itemExistente) {
        itemExistente.cantidad += cant;
    } else {
        reservaUsuario.itemsReservados.push({ id: idPlato, cantidad: cant });
    }

    // Validar saldo del usuario
    const nuevoTotal = calcularTotalReserva(reservaUsuario.itemsReservados, menu);
    if (nuevoTotal > reservaUsuario.saldo) {
        // Revertir en el carrito si excede el saldo
        if (itemExistente) {
            itemExistente.cantidad -= cant;
            if (itemExistente.cantidad === 0) {
                reservaUsuario.itemsReservados = reservaUsuario.itemsReservados.filter(i => i.id !== idPlato);
            }
        }
        return res.status(400).json({ error: "Saldo insuficiente para esta cantidad" });
    }

    res.json({ message: "Plato agregado a la reserva actual", reserva: reservaUsuario });
};


// --- ENDPOINT 4: PUT /api/reserva/actualizar-porciones/:id ---
const actualizarPorciones = (req, res) => {
    // Si la reserva ya fue confirmada, no se puede alterar el carrito
    if (reservaUsuario.confirmada) {
        return res.status(400).json({ error: "La reserva ya fue confirmada. Debe reiniciarla para hacer cambios." });
    }

    const idPlato = Number(req.params.id);
    const { cantidad } = req.body;
    const nuevaCantidad = Number(cantidad);

    // Validación: la cantidad no puede ser negativa
    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número válido mayor o igual a 0" });
    }

    const itemIndex = reservaUsuario.itemsReservados.findIndex(i => i.id === idPlato);
    if (itemIndex === -1) {
        return res.status(404).json({ error: "El plato no está en la reserva" });
    }

    const plato = menu.find(p => p.id === idPlato);
    const itemActual = reservaUsuario.itemsReservados[itemIndex];

    // Validar que el stock en la cocina sea suficiente para la nueva cantidad solicitada
    if (plato && nuevaCantidad > plato.stock) {
        return res.status(400).json({ error: "Stock insuficiente en el menú para esta cantidad" });
    }

    // Guardar la cantidad anterior por si hay que revertir por saldo
    const cantidadAnterior = itemActual.cantidad;
    itemActual.cantidad = nuevaCantidad;

    // Validar si el nuevo total supera el saldo del usuario
    const nuevoTotal = calcularTotalReserva(reservaUsuario.itemsReservados, menu);
    if (nuevoTotal > reservaUsuario.saldo) {
        // Revertir el cambio en el carrito
        itemActual.cantidad = cantidadAnterior;
        return res.status(400).json({ error: "Saldo insuficiente para esta cantidad" });
    }

    // Si la nueva cantidad es 0, eliminamos el ítem por completo de la reserva
    if (nuevaCantidad === 0) {
        reservaUsuario.itemsReservados.splice(itemIndex, 1);
    }

    res.json({ message: "Porciones actualizadas en la reserva actual", reserva: reservaUsuario });
};

// --- ENDPOINT 5: DELETE /api/reserva/eliminar/:id ---
const eliminarReserva = (req, res) => {
    const idPlato = Number(req.params.id);

    const itemIndex = reservaUsuario.itemsReservados.findIndex(i => i.id === idPlato);
    if (itemIndex === -1) {
        return res.status(404).json({ error: "El plato no se encuentra en la reserva" });
    }

    const item = reservaUsuario.itemsReservados[itemIndex];
    const plato = menu.find(p => p.id === idPlato);

    // Solo devolvemos unidades al stock si la reserva YA había sido confirmada (y por ende, se habían descontado)
    if (plato && reservaUsuario.confirmada) {
        plato.stock += item.cantidad;
    }

    // Quitar de la reserva
    reservaUsuario.itemsReservados.splice(itemIndex, 1);

    res.json({ message: "Plato eliminado de la reserva", reserva: reservaUsuario });
};


// --- ENDPOINT EXTRA: POST /api/reserva/reiniciar (Por expiración de tiempo o reinicio manual) ---
const reiniciarReserva = (_req, res) => {
    // Si ya estaba confirmada, devolvemos las unidades al stock general del menú
    if (reservaUsuario.confirmada) {
        reservaUsuario.itemsReservados.forEach(item => {
            const plato = menu.find(p => p.id === Number(item.id));
            if (plato) {
                plato.stock += item.cantidad;
            }
        });
    }

    // Vaciar la reserva activa y restablecer el estado de confirmación
    reservaUsuario.itemsReservados = [];
    reservaUsuario.confirmada = false; // <--- Importante para permitir nuevas reservas

    res.json({
        message: "La reserva ha expirado o se ha reiniciado.",
        reserva: reservaUsuario
    });
};


// --- ENDPOINT NUEVO: POST /api/reserva/confirmar (Aquí es donde se BLOQUEA el stock) ---
const confirmarReserva = (_req, res) => {
    if (reservaUsuario.itemsReservados.length === 0) {
        return res.status(400).json({ error: "No hay platillos en la reserva para confirmar" });
    }

    if (reservaUsuario.confirmada) {
        return res.status(400).json({ error: "Esta reserva ya había sido confirmada anteriormente" });
    }

    // 1. Validar por última vez el stock global antes de bloquear
    for (const item of reservaUsuario.itemsReservados) {
        const plato = menu.find(p => p.id === item.id);
        if (!plato || plato.stock < item.cantidad) {
            return res.status(400).json({ error: `Stock insuficiente para el plato ID ${item.id}` });
        }
    }

    // 2. Bloquear el stock (descontar oficialmente del menú)
    reservaUsuario.itemsReservados.forEach(item => {
        const plato = menu.find(p => p.id === item.id);
        if (plato) {
            plato.stock -= item.cantidad;
        }
    });

    // 3. Marcar como confirmada
    reservaUsuario.confirmada = true;

    res.json({
        message: "¡Reserva confirmada con éxito! Stock bloqueado.",
        reserva: reservaUsuario
    });
};

export default {
    getMenu,
    getReserva,
    agregarReserva,
    actualizarPorciones,
    eliminarReserva,
    reiniciarReserva,
    confirmarReserva
};