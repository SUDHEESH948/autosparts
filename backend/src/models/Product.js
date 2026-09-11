
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    // Frontend SKU maps to partNumber
    partNumber: {
      type: String,
      default: "",
      trim: true,
      unique: true,
      sparse: true,
    },

    barcode: {
      type: String,
      default: "",
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    type: {
      type: String,
      enum: ["Item", "Service", "File", "Dynamic"],
      default: "Item",
    },

    vehicleMake: {
      type: String,
      default: "Universal",
      trim: true,
    },

    vehicleModel: {
      type: String,
      default: "",
      trim: true,
    },

    vehicleYear: {
      type: String,
      default: "",
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);

