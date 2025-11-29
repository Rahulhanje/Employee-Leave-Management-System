import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * User Schema
 * Handles employee and manager user data with authentication
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['employee', 'manager'],
        message: 'Role must be either employee or manager'
      },
      default: 'employee'
    },
    leaveBalance: {
      sickLeave: {
        type: Number,
        default: 10,
        min: [0, 'Sick leave balance cannot be negative']
      },
      casualLeave: {
        type: Number,
        default: 5,
        min: [0, 'Casual leave balance cannot be negative']
      },
      vacationLeave: {
        type: Number,
        default: 5,
        min: [0, 'Vacation leave balance cannot be negative']
      }
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    versionKey: false // Removes __v field
  }
);

/**
 * Indexes
 * Improve query performance for frequently searched fields
 */
userSchema.index({ email: 1 }); // Unique index for email

/**
 * Pre-save middleware
 * Hash password before saving if it's modified
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: Compare password
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} - Returns true if password matches
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Instance method: Generate JWT token
 * @returns {string} - JWT token containing user information
 */
userSchema.methods.generateJWT = function () {
  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * Instance method: Get public profile
 * Returns user data without sensitive information
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Create and export User model
const User = mongoose.model('User', userSchema);

export default User;
