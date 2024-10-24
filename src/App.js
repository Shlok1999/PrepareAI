import React from 'react';
import { BrowserRouter as Router, Routes,Route  } from 'react-router-dom';
import './App.css';
import Homepage from './Page/Homepage';
import Test from './Page/Test';
import Dashboard from './Page/Dashboard';
import TestGPT from './TestGPT';
import RegistrationPage from './Page/RegistrationPage';


function App() {
  return (
      <Router>
        <Routes>
          <Route exact path='/' element={<Homepage/>}/>
          <Route exact path='/test' element={<Test/>}/>
          <Route exact path='/dashboard' element={<Dashboard/>}/>
          {/* <Route exact path='/testgpt' element={<TestGPT/>}/> */}
          <Route exact path='/register' element={<RegistrationPage/>}/>
        </Routes>
      </Router>
  );
}

export default App;
