import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    // Business Information
    restaurantName: { type: String, required: true },
    businessType: {
      type: String,
      enum: [
        "Restaurant",
        "Cafe",
        "Fast Food",
        "Fine Dining",
        "Bar",
        "Food Truck",
        "Bakery",
        "Other",
      ],
      required: true,
    },
    cuisineType: { type: String, required: true },
    description: { type: String },

    // Location Information
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: "USA" },
    },
    phone: { type: String, required: true },

    // Owner Information
    owner: {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true },
      passwordHash: { type: String, required: true },
    },

    // Verification Documents
    verification: {
      businessLicense: { type: String, required: true },
      taxId: { type: String, required: true },
      gstRegistration: { type: String }, // GST document URL
      fssaiLicense: { type: String }, // FSSAI document URL
      ownerAadhar: { type: String }, // Aadhar document URL
      documents: [{ type: String }], // Additional document URLs
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reviewedAt: { type: Date },
      rejectionReason: { type: String },
      notes: { type: String },
    },

    // Additional Information
    website: { type: String },
    socialMedia: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
    },
    operatingHours: {
      monday: { open: String, close: String, closed: Boolean },
      tuesday: { open: String, close: String, closed: Boolean },
      wednesday: { open: String, close: String, closed: Boolean },
      thursday: { open: String, close: String, closed: Boolean },
      friday: { open: String, close: String, closed: Boolean },
      saturday: { open: String, close: String, closed: Boolean },
      sunday: { open: String, close: String, closed: Boolean },
    },
    numberOfTables: { type: Number },

    // System Fields
    isActive: { type: Boolean, default: false },
    role: { type: String, default: "restaurant" },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
