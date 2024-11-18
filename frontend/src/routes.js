import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/authentication/auth';
import Dashboard from './components/home/dashboard';
import Assist from './components/home/sidebarComp/assist';
import Vent from './components/home/sidebarComp/vent/vent';
import Progress from './components/home/sidebarComp/progress';
import Consult from './components/home/sidebarComp/consult';
import Mindcare from './components/home/sidebarComp/mindcare';


const AppRoutes = () => {
  return (
    <div>
        <Router>
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Dashboard />} /> 
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/assist" element={<Assist />} />
                <Route path="/vent" element={<Vent />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/consult" element={<Consult />} />
                <Route path="/mindcare" element={<Mindcare />} />
            </Routes>
        </Router>
    </div>
  )
}

export default AppRoutes;
