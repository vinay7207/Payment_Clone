import { Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Transection from './Pages/Transection';
import Admin from './Pages/Admin';
import Navbar from './HeaderFooter/Navbar';
import Footer from './HeaderFooter/Footer';

function App() {
  return (
    <WalletProvider>
      <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/transection" element={<Transection />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      </div>
    </WalletProvider>
  );
}

export default App;
