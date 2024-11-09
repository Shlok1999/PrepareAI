import React from 'react';
import { BrowserRouter as Router, Routes,Route  } from 'react-router-dom';
import './App.css';
import Homepage from './Page/Homepage';
import Test from './Page/Test';
import Dashboard from './Page/Dashboard';
import RegistrationPage from './Page/RegistrationPage';
import TopicPage from './Page/TopicPage';


function App() {
  return (
      <Router>
        <Routes>
          <Route exact path='/' element={<Homepage/>}/>
          <Route exact path='/test' element={<Test/>}/>
          <Route exact path='/dashboard' element={<Dashboard/>}/>
          {/* <Route exact path='/testgpt' element={<TestGPT/>}/> */}
          <Route exact path='/register' element={<RegistrationPage/>}/>
          <Route path='/topics/:topicName' element={<TopicPage/>}/>
        </Routes>
      </Router>
  );
}

export default App;
