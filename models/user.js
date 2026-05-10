const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const roles = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false //won’t return password by default
    },

    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.DEVELOPER
    }
  },
  { timestamps: true }
);

//hash password before save
userSchema.pre('save',async function() {
    if(!this.isModified('password')) return

    this.password = await bcrypt.hash(this.password, 10);
})

//compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('User', userSchema);