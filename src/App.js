import React from 'react';
import { BrowserRouter as Router, Routes,Route  } from 'react-router-dom';
import './App.css';
import Homepage from './Page/Homepage';
import Test from './Page/Test';
// import Dashboard from './Page/Dashboard';
import RegistrationPage from './Page/RegistrationPage';
import TopicPage from './Page/TopicPage';
import BiweeklyTest from './Component/TestPages/BiweeklyTest/BiweeklyTest';
import DailyTest from './Component/TestPages/DailyTest/DailyTest';
import TestHistoryMain from './Component/TestPages/TestHistory/TestHistoryMain';
// import TestButtonsPage from './Component/DashboardComponent/TestHomePage/TestButtonsPage';
// import Navbar from './Component/NavigationComponents/Navbar';
// import { Footer } from './Component/NavigationComponents/Footer';
import { TestsPage } from './Page/TestPage';
import { DashboardContent } from './Component/DashboardComponent/DashboardContent';
import { DashboardHome } from './Component/DashboardComponent/DashboardHome';
import ProfileHeader from './Component/DashboardComponent/ProfileHeader';
import ProfileSettings from './Component/DashboardComponent/ProfileSettings';
import PerformancePage from './Page/PerformancePage';
import { QuizPage } from './Page/QuizPage';
function App() {
  return (
      <Router>
        {/* <Navbar/> */}
        <Routes>
          <Route exact path='/' element={<Homepage/>}/>
          <Route exact path='/test' element={<Test/>}/>
          <Route exact path='/dashboard' element={<DashboardContent/>}>
            <Route index element={<DashboardHome/>} />
            <Route path = "tests" element={<TestsPage/>}/>
            <Route path = "profile" element={<ProfileSettings/>}/>
            <Route path ="performance" element = {<PerformancePage/>}/>
          </Route>
          {/* <Route exact path='/testgpt' element={<TestGPT/>}/> */}
          <Route exact path='/register' element={<RegistrationPage/>}/>
          <Route path="/quiz/:subject" element={<QuizPage />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          {/* <Route exact path='/test-content' element={<TestContent/>}/>
          <Route exact path='/select-topic' element={<SelectTopics/>}/> */}
          {/* <Route path='/topics/:topicName' element={<TopicPage/>}/>
          <Route path='/biweekly-test' element={<BiweeklyTest/>}/>
          <Route path='/test/dpp/:subject/:topic' element={<DailyTest/>}/>
          <Route path='/test-history' element={<TestHistoryMain/>}/> */}
          {/* <Route path="tests" element={<TestsPage />} /> */}

        </Routes>
        {/* <Footer/> */}
      </Router>
  );
}

export default App;
