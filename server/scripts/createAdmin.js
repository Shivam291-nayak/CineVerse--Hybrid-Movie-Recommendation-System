
const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("Admin credentials missing in .env");
    }

    let admin = await User.findOne({ email });

    if (admin) {
      admin.password = password;
      admin.role = "admin";
      await admin.save();

      console.log("Admin password reset successfully.");
    } else {
      await User.create({
        name: "Administrator",
        email,
        password,
        role: "admin",
      });

      console.log("Admin account created successfully.");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exit(1);
  }
};

createAdmin();
