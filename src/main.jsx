import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import About from './Components/About';
import ProjectsAndBlog from './Components/ProjectsAndBlog';
import House from './Components/House';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/projects" element={<ProjectsAndBlog />} />
        <Route path="/blog" element={<ProjectsAndBlog />} />
        <Route path="/house" element={<House />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
