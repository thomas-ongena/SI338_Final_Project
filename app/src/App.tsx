import React from 'react';
import Home from './pages/home';
import Admin from './pages/admin';
import LocDun from './pages/locdunMain';
import LocDunView from './pages/locdunView';
import NotFound from './pages/notFound';
import './styles/App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';

const App: React.FC = () => {
  return (
    <div className="app">
      <Router>
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/viewTools" element={<LocDun />} />
            <Route path="/viewTools/:locDun" element={<LocDunView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
