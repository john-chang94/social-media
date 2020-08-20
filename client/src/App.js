import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './MainRouter';

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
