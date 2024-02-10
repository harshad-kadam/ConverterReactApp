import React from 'react';
import './App.css';
import ConverterApp from './Layouts/Home/ConverterAppMain';
import ErrorBoundary from './Utils/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <ConverterApp />
      </ErrorBoundary>
    </div>
  );
}

export default App;
