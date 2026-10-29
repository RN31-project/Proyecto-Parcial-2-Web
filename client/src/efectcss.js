export const efectoMouseReact = (e) => {
  // e.nativeEvent nos da las coordenadas exactas dentro de React
  const x = e.nativeEvent.offsetX;
  const y = e.nativeEvent.offsetY;
  
  // currentTarget aplica el estilo solo al botón que disparó el evento
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
};

