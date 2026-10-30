export const calcularTotalReserva = (itemsReservados, menu) => {
    return itemsReservados.reduce((acc, item) => {
    const plato = menu.find(p => p.id === Number(item.id));
    return acc + (plato ? plato.precio * item.cantidad : 0);
  }, 0);
};