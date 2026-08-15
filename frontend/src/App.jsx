import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ArtworkPage from './pages/ArtworkPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminSetupPage from './pages/AdminSetupPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#080d10] text-[#f5efe6] selection:bg-[#f2b77a] selection:text-[#11181b]">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="min-h-screen"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/artwork/:slug" element={<ArtworkPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/setup" element={<AdminSetupPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </motion.main>
      <Footer />
    </div>
  );
}

export default App;
