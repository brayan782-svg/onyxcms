/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Client from './pages/Client';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Landing />} 
        />
        <Route 
          path="/login" 
          element={user ? (user.email === 'brayan782@gmail.com' ? <Navigate to="/admin" /> : <Navigate to="/client" />) : <Login />} 
        />
        <Route 
          path="/admin" 
          element={user && user.email === 'brayan782@gmail.com' ? <Admin /> : <Navigate to="/login" />} 
        />
        <Route
          path="/client"
          element={user ? <Client /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
