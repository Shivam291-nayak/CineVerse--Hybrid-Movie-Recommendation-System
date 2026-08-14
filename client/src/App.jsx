import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

export default App