import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import AvailableProxies from './pages/AvailableProxies';
import IPQualityScore from './pages/IPQualityScore';
import UserAgent from './pages/UserAgent';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<AvailableProxies />} />
        <Route path="/ip-quality-score" element={<IPQualityScore />} />
        <Route path="/user-agents" element={<UserAgent />} />
      </Routes>
    </Router>
  );
}

export default App;
