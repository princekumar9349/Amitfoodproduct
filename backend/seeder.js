const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin");
const connectDB = require("./config/db");

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Check if admin exists
    const email = "prince960876@gmail.com";
    const password = "Princekum@r123";

    const exists = await Admin.findOne({ email });

    if (exists) {
      console.log("Val: Admin already exists. Updating password...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      exists.password = hashedPassword;
      exists.name = "Amit Mahto"; // Ensure name is correct
      exists.role = "admin";
      await exists.save();
      console.log("Val: Admin Updated Successfully!");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await Admin.create({
        name: "Amit Mahto",
        email: email,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Val: Admin Created Successfully!");
    }

    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
