import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../src/config/database.js';
import { User, LeaveRequest } from '../src/models/index.js';

// Load environment variables
dotenv.config();

/**
 * Seed script to populate database with sample data
 * - 1 Manager user
 * - 5 Employee users
 * - 10 Sample leave requests (mixed statuses)
 */

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await LeaveRequest.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Manager
    console.log('👔 Creating manager...');
    const manager = await User.create({
      name: 'Manager One',
      email: 'manager@example.com',
      password: '123456',
      role: 'manager',
      leaveBalance: {
        sick: 0,
        casual: 0,
        vacation: 0,
      },
    });
    console.log(`✅ Manager created: ${manager.email}\n`);

    // Create Employees
    console.log('👥 Creating employees...');
    const employees = [];
    const employeeData = [
      { name: 'Employee One', email: 'employee1@example.com' },
      { name: 'Employee Two', email: 'employee2@example.com' },
      { name: 'Employee Three', email: 'employee3@example.com' },
      { name: 'Employee Four', email: 'employee4@example.com' },
      { name: 'Employee Five', email: 'employee5@example.com' },
    ];

    for (const empData of employeeData) {
      const employee = await User.create({
        name: empData.name,
        email: empData.email,
        password: '123456',
        role: 'employee',
        leaveBalance: {
          sick: 10,
          casual: 12,
          vacation: 15,
        },
      });
      employees.push(employee);
      console.log(`✅ Employee created: ${employee.email}`);
    }
    console.log(`\n✅ ${employees.length} employees created\n`);

    // Create Sample Leave Requests
    console.log('📝 Creating sample leave requests...');

    const leaveRequests = [
      // Pending leaves
      {
        userId: employees[0]._id,
        leaveType: 'sick',
        startDate: new Date('2025-12-05'),
        endDate: new Date('2025-12-06'),
        reason: 'Medical checkup appointment',
        status: 'pending',
      },
      {
        userId: employees[1]._id,
        leaveType: 'casual',
        startDate: new Date('2025-12-10'),
        endDate: new Date('2025-12-11'),
        reason: 'Personal work to be completed',
        status: 'pending',
      },
      {
        userId: employees[2]._id,
        leaveType: 'vacation',
        startDate: new Date('2025-12-20'),
        endDate: new Date('2025-12-25'),
        reason: 'Year-end vacation with family',
        status: 'pending',
      },
      // Approved leaves (upcoming)
      {
        userId: employees[0]._id,
        leaveType: 'vacation',
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-01-20'),
        reason: 'Family vacation planned',
        status: 'approved',
        approvedBy: manager._id,
      },
      {
        userId: employees[3]._id,
        leaveType: 'casual',
        startDate: new Date('2025-12-03'),
        endDate: new Date('2025-12-03'),
        reason: 'Personal emergency to handle',
        status: 'approved',
        approvedBy: manager._id,
      },
      {
        userId: employees[4]._id,
        leaveType: 'sick',
        startDate: new Date('2025-12-08'),
        endDate: new Date('2025-12-09'),
        reason: 'Fever and cold symptoms',
        status: 'approved',
        approvedBy: manager._id,
      },
      // Approved leaves (past - within 30 days)
      {
        userId: employees[1]._id,
        leaveType: 'sick',
        startDate: new Date('2025-11-15'),
        endDate: new Date('2025-11-16'),
        reason: 'High fever and body ache',
        status: 'approved',
        approvedBy: manager._id,
      },
      {
        userId: employees[2]._id,
        leaveType: 'casual',
        startDate: new Date('2025-11-20'),
        endDate: new Date('2025-11-21'),
        reason: 'Family function to attend',
        status: 'approved',
        approvedBy: manager._id,
      },
      // Rejected leaves
      {
        userId: employees[3]._id,
        leaveType: 'vacation',
        startDate: new Date('2025-11-10'),
        endDate: new Date('2025-11-15'),
        reason: 'Short notice vacation request',
        status: 'rejected',
        approvedBy: manager._id,
      },
      {
        userId: employees[4]._id,
        leaveType: 'casual',
        startDate: new Date('2025-11-05'),
        endDate: new Date('2025-11-06'),
        reason: 'Insufficient leave balance available',
        status: 'rejected',
        approvedBy: manager._id,
      },
    ];

    const createdLeaves = await LeaveRequest.insertMany(leaveRequests);
    console.log(`✅ ${createdLeaves.length} leave requests created\n`);

    // Summary
    console.log('═══════════════════════════════════════════════');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════');
    console.log(`📊 Summary:`);
    console.log(`   • Manager users: 1`);
    console.log(`   • Employee users: ${employees.length}`);
    console.log(`   • Total users: ${employees.length + 1}`);
    console.log(`   • Leave requests: ${createdLeaves.length}`);
    console.log(`   • Pending: ${createdLeaves.filter((l) => l.status === 'pending').length}`);
    console.log(`   • Approved: ${createdLeaves.filter((l) => l.status === 'approved').length}`);
    console.log(`   • Rejected: ${createdLeaves.filter((l) => l.status === 'rejected').length}`);
    console.log('═══════════════════════════════════════════════\n');
    console.log('📌 Login Credentials:');
    console.log('   Manager: manager@example.com / 123456');
    console.log('   Employee: employee1@example.com / 123456');
    console.log('   Employee: employee2@example.com / 123456');
    console.log('   (and so on...)\n');

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run seed
seedData();
