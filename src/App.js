import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import InscriptionSuccess from './pages/InscriptionSuccess';
import Admin from './pages/Admin';
import './App.css';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/clients" element={token ? <Clients /> : <Navigate to="/login" />} />
        <Route path="/admin" element={token && role === 'admin' ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/inscription-success" element={<InscriptionSuccess />} />
        <Route path="/inscription-annulee" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;