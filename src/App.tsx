import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import './index.css';
import AdminPage from './pages/Admin';
import { ThemeProvider } from './Context/ThemeContext';
import NotFound from './components/NotFound';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/post/:id" element={<BlogPost />} />
            <Route path='/*' element={<NotFound />}/>
          </Routes>
          </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;