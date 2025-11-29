import React from 'react';

const EmployeeDashboard = () => {
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Employee Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to your leave management dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Leaves</h3>
          <p className="text-4xl font-bold">24</p>
          <p className="text-sm mt-2 text-blue-100">Annual allocation</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Used Leaves</h3>
          <p className="text-4xl font-bold">8</p>
          <p className="text-sm mt-2 text-green-100">This year</p>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Pending</h3>
          <p className="text-4xl font-bold">2</p>
          <p className="text-sm mt-2 text-yellow-100">Awaiting approval</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Available</h3>
          <p className="text-4xl font-bold">16</p>
          <p className="text-sm mt-2 text-purple-100">Remaining balance</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Leave Requests
        </h2>
        <p className="text-gray-500 text-center py-8">
          No leave requests yet. Click "Apply for Leave" to get started.
        </p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
