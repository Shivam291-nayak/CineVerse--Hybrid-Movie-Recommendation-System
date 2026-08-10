import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home.jsx'
import Login from '../pages/Login/Login.jsx'
import Register from '../pages/Register/Register.jsx'
import Dashboard from '../pages/Dashboard/Dashboard.jsx'
import Movies from '../pages/Movies/Movies.jsx'
import MovieDetails from '../pages/MovieDetails/MovieDetails.jsx'
import Watchlist from '../pages/Watchlist/Watchlist.jsx'
import Profile from '../pages/Profile/Profile.jsx'
import AdminLogin from '../pages/AdminLogin/AdminLogin.jsx'
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard.jsx'
import AddMovie from '../pages/AddMovie/AddMovie.jsx'
import NotFound from '../pages/NotFound/NotFound.jsx'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-movie"
        element={
          <ProtectedRoute adminOnly>
            <AddMovie />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
