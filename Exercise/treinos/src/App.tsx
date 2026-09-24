import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { Categoria } from './pages/Categoria'
import { Treino } from './pages/Treino'
import { Exercicios } from './pages/Exercicios'
import { BottomNav } from './components/BottomNav'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:categoryId" element={<Categoria />} />
        <Route path="/treino/:treinoId" element={<Treino />} />
        <Route path="/treinos" element={<Navigate to="/" replace />} />
        <Route path="/exercicios" element={<Exercicios />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  )
}
