import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DeployProcess from './pages/DeployProcess';
import TerminateProcess from './pages/TerminateProcess';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="deploy" element={<DeployProcess />} />
        <Route path="terminate" element={<TerminateProcess />} />
      </Route>
    </Routes>
  );
}

export default App;