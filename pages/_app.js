import '../styles/globals.css';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ThemeProvider } from '../context/ThemeContext';
import ThemeToggler from '../components/ThemeToggler';

function MyApp({ Component, pageProps, router }) {
  return (
    <ThemeProvider>
      <div className="site-container">
        <header className="main-header">
            <Link href="/" className="shiny-text">LIPP - API</Link>
            <ThemeToggler />
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={router.route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Component {...pageProps} />
          </motion.main>
        </AnimatePresence>
        <footer className="main-footer">
          © 2025 - LippWangsaff
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default MyApp;
