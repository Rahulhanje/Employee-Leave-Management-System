import React from 'react';

const ManagerDashboard = () => {
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manager Dashboard
        </h1>
        <p className="text-gray-600">
          Manage leave requests and view team statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Employees</h3>
          <p className="text-4xl font-bold">45</p>
          <p className="text-sm mt-2 text-indigo-100">In your team</p>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
          <p className="text-4xl font-bold">7</p>
          <p className="text-sm mt-2 text-yellow-100">Needs approval</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Approved</h3>
          <p className="text-4xl font-bold">32</p>
          <p className="text-sm mt-2 text-green-100">This month</p>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Rejected</h3>
          <p className="text-4xl font-bold">3</p>
          <p className="text-sm mt-2 text-red-100">This month</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pending Leave Requests
        </h2>
        <p className="text-gray-500 text-center py-8">
          No pending leave requests at the moment.
        </p>
      </div>
    </div>
  );
};

export default ManagerDashboard;
