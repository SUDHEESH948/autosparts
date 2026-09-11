const bcrypt = require("bcryptjs");
const User = require("../models/User");

const DEFAULT_EMAIL = "EzinZahanSpareParts@gmail.com";
const DEFAULT_PASSWORD = "Ezin Zahan_Spare_Parts@1236";

const createDefaultUser = async () => {
  try {
    const existingUser = await User.findOne({
      email: DEFAULT_EMAIL.toLowerCase(),
    });

    if (existingUser) {
      console.log("Default user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    await User.create({
      name: "Ezin Zahan Spare Parts",
      email: DEFAULT_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "seller",
    });

    console.log("Default seller user created successfully");
  } catch (error) {
    console.error("Default user creation failed:", error.message);
  }
};

module.exports = createDefaultUser;