import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaUsers, FaUserMd, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import { GiReceiveMoney } from 'react-icons/gi';
import { NavLink } from 'react-router-dom';
import { getDashboardData } from '../../services/doctorServices';

function DoctorDashboard() {
  const DoctorData = useSelector((state: RootState) => state.doctor);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    monthlyRevenue: [],
    totalAppointments: 0,
    todaysAppointments: 0,
    numberOfPatients: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData(DoctorData?.doctorInfo?.doctorId as string)
        console.log(response?.data.response.monthlyRevenue)
        setDashboardData(response?.data.response);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [DoctorData?.doctorInfo?.doctorId]);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4 border-l-4 ${color}`}>
      <div className={`text-${color.split('-')[1]} bg-${color.split('-')[1]}-100 p-3 rounded-full`}>
        <Icon size={24} />
      </div>
      <div>
        <h2 className="text-sm font-medium text-gray-500">{title}</h2>
        <p className="text-2xl font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={GiReceiveMoney}
            title="Total Revenue"
            value={`Rs ${dashboardData.totalRevenue.toLocaleString()}`}
            color="border-blue-500"
          />
          <StatCard
            icon={FaCalendarCheck}
            title="Total Appointments"
            value={dashboardData.totalAppointments}
            color="border-green-500"
          />
          <StatCard
            icon={FaUserMd}
            title="Today's Appointments"
            value={dashboardData.todaysAppointments}
            color="border-yellow-500"
          />
          <StatCard
            icon={FaUsers}
            title="Total Patients"
            value={dashboardData.numberOfPatients}
            color="border-purple-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalRevenue" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <ul className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <li key={index} className="flex items-center space-x-3 text-gray-700">
                  <FaChartLine className="text-blue-500" />
                  <span>New appointment scheduled for {new Date().toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { text: 'Schedule Appointment', path: '/doctor/slots' },

                { text: 'Check Revenue', path: '/doctor/wallet' },
                { text: 'Update Profile', path: '/doctor/profile' },
              ].map((action, index) => (
                <NavLink
                  key={index}
                  to={action.path}
                  className="bg-indigo-100 text-indigo-700 rounded-lg py-2 px-4 hover:bg-indigo-200 transition duration-300"
                >
                  {action.text}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;