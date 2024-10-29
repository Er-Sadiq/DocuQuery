import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing';
import ChatBoard from './Pages/ChatBoard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<ChatBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
