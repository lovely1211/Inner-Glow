import React, { useEffect, useState } from 'react';
import { FaAddressBook, FaMoneyBill, FaChevronRight, FaProcedures, FaPersonBooth, FaStar } from "react-icons/fa"; 

const DashboardStats = ({ sellerId }) => {
  const [stats, setStats] = useState({
    totalFollowers: 0,
    totalRevenue: 0,
    totalCompleted: 0,
    totalProcessing: 0,
    totalNewRequests: 0,
    totalRating: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/seller/orderStats?sellerId=${sellerId}`);
        const data = await response.json();
        setStats({
          totalOrders: data.totalOrders,
          totalCanceled: data.totalCanceled,
          totalDelivered: data.totalDelivered,
          totalRevenue: data.totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [sellerId]);

  const statItems = [
    { title: 'Followers', count: stats.totalOrders, icon: FaAddressBook },
    { title: 'Total Revenue', count: stats.totalCanceled, icon: FaMoneyBill },
    { title: 'Completed', count: stats.totalDelivered, icon: FaChevronRight },
    { title: 'In Process', count: stats.totalRevenue, icon: FaProcedures },
    { title: 'New Requests', count: stats.totalRevenue, icon: FaPersonBooth },
    { title: 'Total Rating', count: stats.totalRevenue, icon: FaStar },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-6 w-full bg-gray-300 p-4 rounded-lg">
      {statItems.map((stat, index) => (
        <div key={index} className="p-4 bg-white text-gray-800 shadow-md rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-2xl">{stat.count}</p>
            </div>
            <img src={stat.icon} alt="icon" className="w-12 h-12" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
