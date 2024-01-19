import React from 'react';
import { BrowserRouter as Router, Route, Routes, Redirect } from 'react-router-dom';
import NavBar from './components/NavBar';
import EventsPage from './components/EventsPage';
import YourOrderPage from './components/YourOrderPage';
import BlogPage from './components/BlogPage';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events" element={<EventsPage />} /> 
        <Route path="/your-order" element={<YourOrderPage />} /> 
        <Route path="/blog" element={<BlogPage />} /> 
        <Route path="*" element={<EventsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
