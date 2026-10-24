# Proyecto-Parcial-2-Web

Entorno inicial para desarrollar con Node.js, Express, React, Vite, CSS y Reactstrap.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Instalación

Desde la carpeta raíz del proyecto:

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Esto inicia el servidor Express en `http://localhost:3000` y Vite en
`http://localhost:5173`. El cliente utiliza el proxy de Vite para enviar las
peticiones `/api` al servidor.

## Estructura

- `client/`: aplicación React con Vite, Reactstrap y Bootstrap.
- `server/`: API REST con Express.

La ruta `GET /api/health` permite comprobar que la API está disponible.
