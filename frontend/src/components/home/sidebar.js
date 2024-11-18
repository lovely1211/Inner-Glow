import React, {useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaBrain, FaComments, FaUserFriends, FaPalette, FaShareAlt, FaHandsHelping } from "react-icons/fa"; 
import Share from "./sidebarComp/share";
import { ThemeContext } from "./sidebarComp/theme";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const goToAssist = () => navigate('/assist');
  const goToVent = () => navigate('/vent');
  const goToProgress = () => navigate('/progress');
  const goToConsult = () => navigate('/consult');
  const goToMindcare = () => navigate('/mindcare');



  return (
    <div
      className={`z-10 fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      
      <button
        onClick={toggleSidebar}
        className="text-white p-2 absolute top-4 right-4 font-semibold"
      >
        &#10005; 
      </button>

      
      <div className="p-4">
        <h2 className="text-3xl font-bold">Inner Glow</h2>
        <ul className="mt-12">

          <li className="flex items-center px-2 py-4 hover:text-2xl transition-all duration-400 shadow-white text-xl font-medium cursor-pointer" onClick={goToProgress}>
            <FaChartLine className="mr-4" />
            Progress</li>

          <li className="flex items-center px-2 py-4 hover:text-2xl transition-all duration-400 shadow-white text-xl font-medium cursor-pointer" onClick={goToMindcare}>
            <FaBrain className="mr-4" />
            MindCare</li>

          <li className="flex items-center px-2 py-4 hover:text-2xl transition-all duration-400 shadow-white text-xl font-medium cursor-pointer" onClick={goToVent} >
            <FaComments className="mr-4" />
            Vent</li>

          <li className="flex items-center px-2 py-4 hover:text-2xl transition-all duration-400 shadow-white text-xl font-medium cursor-pointer" onClick={goToConsult}>
            <FaUserFriends className="mr-4" />
            Consult</li>

          <li className="flex items-center px-2 py-4 hover:text-2xl transition-all duration-400 shadow-white text-xl font-medium cursor-pointer">
            <FaPalette className="mr-4" />
            <button onClick={toggleTheme}>
              {theme === 'light' ? 'Dark' : 'Light'} Mode
           </button></li>

          <li className="flex items-center px-2 py-4 hover:text-2xl transition-all duration-400 shadow-white text-xl font-medium cursor-pointer">
            <FaShareAlt className="mr-4" />
            <Share /></li>

          <li className="flex items-center px-2 py-4 hover:text-2xl transition-all duration-400 shadow-white text-xl font-medium cursor-pointer" 
          onClick={goToAssist}>
            <FaHandsHelping className="mr-4" />
            Assist</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
