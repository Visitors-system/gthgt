// src/frontend/src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import UsersPage from './pages/UsersPage';
import { Toaster } from 'react-hot-toast'; // Import Toaster

function Home() {
  // ... (Home component remains the same)
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center mt-10">Welcome to TETRA Asset Management</h1>
      <nav className="p-4">
        <ul className="flex space-x-4 justify-center">
          <li><Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link></li>
          <li><Link to="/users" className="text-blue-500 hover:text-blue-700">Users</Link></li>
        </ul>
      </nav>
    </div>
  );
}

function App() {
  return (
    <>
      <div><Toaster position="top-right" reverseOrder={false}/></div> {/* Add Toaster here */}
      <header className="bg-gray-800 text-white p-4 text-center">
        TETRA Asset Management System
      </header>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </main>

      <footer className="bg-gray-200 p-4 text-center text-sm">
        © 2024 TETRA Asset Management
      </footer>
    </>
  );
}

export default App;
