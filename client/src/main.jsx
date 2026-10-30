import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import App from './App.jsx'
import Cocina from './Cocina.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Cuando la URL sea "/App", muestra App */}
        <Route path="/" element={<App />} />
        
        {/* Cuando la URL sea "/cocina", muestra Cocina */}
        <Route path="/cocina" element={<Cocina />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
