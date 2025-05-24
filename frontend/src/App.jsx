// src/App.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MediaGallery from './pages/MediaGallery';
import MediaUpload from './pages/MediaUpload';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { AuthRoute } from './components/AuthRoute';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <AuthRoute>
                  <MediaGallery />
                </AuthRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <AuthRoute roles={['uploader', 'admin']}>
                  <MediaUpload />
                </AuthRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AuthRoute roles={['admin']}>
                  <AdminDashboard />
                </AuthRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;