import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/navbar'
import HomePage from './components/HomePage'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar></Navbar>
    <HomePage></HomePage>
  </StrictMode>,
)
