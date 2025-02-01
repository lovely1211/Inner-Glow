import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/authentication/auth';
import Dashboard from './components/dashboardDoctor/dashboard';
import Assist from './components/commonComp/assist';
import NewChat from './components/dashboardDoctor/sidebarComp/newChat';
import InProcess from './components/dashboardDoctor/sidebarComp/inProcess';
import Completed from './components/dashboardDoctor/sidebarComp/completed';
import Consult from './components/dashboardDoctor/sidebarComp/consult';


const AppRoutes = () => {
  return (
    <div>
        <Router>
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Dashboard />} /> 
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/assist" element={<Assist />} />
                <Route path="/newchat" element={<NewChat />} />
                <Route path="/inprocess" element={<InProcess />} />
                <Route path="/completed" element={<Completed />} />
                <Route path="/consult" element={<Consult />} />
            </Routes>
        </Router>
    </div>
  )
}

export default AppRoutes;
