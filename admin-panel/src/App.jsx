import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ManageProducts from './pages/ManageProducts';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  return admin ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans text-gray-900">
        <Toaster position="top-right" />
        {/* Navbar handles its own visibility check (returns null if not logged in) - 
            BUT here we are inside Router so location check is fine too if we want to be explicit,
            or let Navbar decide. Let's make it consistent. 
            The Navbar component I wrote checks `authService.getCurrentAdmin()`. 
         */}
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            <Route path="/add-product" element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            } />

            <Route path="/products" element={
              <PrivateRoute>
                <ManageProducts />
              </PrivateRoute>
            } />

            <Route path="/orders" element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
