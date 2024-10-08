import React from 'react';
import { BrowserRouter as Router, Routes,Route  } from 'react-router-dom';
import './App.css';
import Homepage from './Page/Homepage';
import Test from './Page/Test';
import Dashboard from './Page/Dashboard';


function App() {
  return (
      <Router>
        <Routes>
          <Route exact path='/' element={<Homepage/>}/>
          <Route exact path='/test' element={<Test/>}/>
          <Route exact path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </Router>
  );
}

export default App;
