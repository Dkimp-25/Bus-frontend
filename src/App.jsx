import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import AdminLayout from './components/Layout/AdminLayout';
import Home from './pages/Home';
import ClientLogin from './pages/ClientLogin';
import ClientSignup from './pages/ClientSignup';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import SearchResults from './pages/SearchResults';
import BookingConfirmation from './pages/BookingConfirmation';
import Dashboard from './components/admin/Dashboard';
import Bookings from './pages/Bookings';
import AdminBookingHistory from './pages/AdminBookingHistory';

function App() {
  return (
    <Router>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="booking-confirmation" element={<BookingConfirmation />} />
          
          <Route path="client">
            <Route path="login" element={<ClientLogin />} />
            <Route path="signup" element={<ClientSignup />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<AdminLogin />} />
          <Route path="signup" element={<AdminSignup />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="booking-history" element={<AdminBookingHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
