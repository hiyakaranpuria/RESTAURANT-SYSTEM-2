import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const RestaurantSignupPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Information
    restaurantName: "",
    businessType: "",
    cuisineType: "",
    description: "",

    // Location
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    phone: "",

    // Owner Information
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    password: "",
    confirmPassword: "",

    // Verification
    businessLicense: "",
    taxId: "",

    // Additional
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    numberOfTables: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Document upload states
  const [documents, setDocuments] = useState({
    gstRegistration: null,
    fssaiLicense: null,
    ownerAadhar: null,
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    gstRegistration: "",
    fssaiLicense: "",
    ownerAadhar: "",
  });

  const [uploading, setUploading] = useState({
    gstRegistration: false,
    fssaiLicense: false,
    ownerAadhar: false,
  });

  const businessTypes = [
    "Restaurant",
    "Cafe",
    "Fast Food",
    "Fine Dining",
    "Bar",
    "Food Truck",
    "Bakery",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments({ ...documents, [documentType]: file });
    }
  };

  const handleFileUpload = async (documentType) => {
    const file = documents[documentType];
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading({ ...uploading, [documentType]: true });
    setError("");

    try {
      const formData = new FormData();
      formData.append("document", file);

      const { data } = await axios.post("/api/upload/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadedFiles({ ...uploadedFiles, [documentType]: data.fileUrl });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "File upload failed");
    } finally {
      setUploading({ ...uploading, [documentType]: false });
    }
  };

  const validateStep = (step) => {
    setError("");

    switch (step) {
      case 1: // Business Information
        if (!formData.restaurantName.trim()) {
          setError("Restaurant name is required");
          return false;
        }
        if (!formData.businessType) {
          setError("Business type is required");
          return false;
        }
        if (!formData.cuisineType.trim()) {
          setError("Cuisine type is required");
          return false;
        }
        break;

      case 2: // Location
        if (!formData.street.trim()) {
          setError("Street address is required");
          return false;
        }
        if (!formData.city.trim()) {
          setError("City is required");
          return false;
        }
        if (!formData.state.trim()) {
          setError("State is required");
          return false;
        }
        if (!formData.postalCode.trim()) {
          setError("Postal code is required");
          return false;
        }
        if (!formData.phone.trim()) {
          setError("Phone number is required");
          return false;
        }
        break;

      case 3: // Owner Information
        if (!formData.ownerName.trim()) {
          setError("Owner name is required");
          return false;
        }
        if (!formData.ownerEmail.trim()) {
          setError("Owner email is required");
          return false;
        }
        if (!formData.ownerPhone.trim()) {
          setError("Owner phone is required");
          return false;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        break;

      case 4: // Verification
        if (!formData.businessLicense.trim()) {
          setError("Business license number is required");
          return false;
        }
        if (!formData.taxId.trim()) {
          setError("Tax ID is required");
          return false;
        }
        if (!uploadedFiles.gstRegistration) {
          setError("Please upload GST Registration Certificate");
          return false;
        }
        if (!uploadedFiles.fssaiLicense) {
          setError("Please upload FSSAI License");
          return false;
        }
        if (!uploadedFiles.ownerAadhar) {
          setError("Please upload Owner Aadhar Card");
          return false;
        }
        break;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        restaurantName: formData.restaurantName,
        businessType: formData.businessType,
        cuisineType: formData.cuisineType,
        description: formData.description,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        phone: formData.phone,
        owner: {
          name: formData.ownerName,
          email: formData.ownerEmail,
          phone: formData.ownerPhone,
          password: formData.password,
        },
        verification: {
          businessLicense: formData.businessLicense,
          taxId: formData.taxId,
          gstRegistration: uploadedFiles.gstRegistration,
          fssaiLicense: uploadedFiles.fssaiLicense,
          ownerAadhar: uploadedFiles.ownerAadhar,
        },
        website: formData.website,
        socialMedia: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
        },
        numberOfTables: formData.numberOfTables
          ? parseInt(formData.numberOfTables)
          : undefined,
      };

      await axios.post("/api/restaurant/register", payload);

      // Show success and redirect to login
      navigate("/restaurant/success");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Business Information</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., The Golden Spoon"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Business Type *
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              >
                <option value="">Select type...</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cuisine Type *
              </label>
              <input
                type="text"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., Italian, Chinese, Mexican"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows="3"
                placeholder="Tell us about your restaurant..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Location Details</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Restaurant Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+1 234 567 8900"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Owner Information</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Owner Full Name *
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Owner Email *
              </label>
              <input
                type="email"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="owner@restaurant.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Owner Phone *
              </label>
              <input
                type="tel"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+1 234 567 8900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 h-12 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Min 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <span className="material-symbols-outlined text-gray-600 !text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 h-12 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <span className="material-symbols-outlined text-gray-600 !text-xl">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">
              Verification & Additional Info
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Business License Number *
              </label>
              <input
                type="text"
                name="businessLicense"
                value={formData.businessLicense}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tax ID / VAT Number *
              </label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3 text-lg">Upload Documents *</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please upload the following documents (PDF, JPG, or PNG, max 5MB
                each)
              </p>

              <div className="space-y-4">
                {/* GST Registration */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium mb-2">
                    GST Registration Certificate *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "gstRegistration")}
                      className="flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleFileUpload("gstRegistration")}
                      disabled={
                        !documents.gstRegistration || uploading.gstRegistration
                      }
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading.gstRegistration ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  {uploadedFiles.gstRegistration && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      File uploaded successfully
                    </p>
                  )}
                </div>

                {/* FSSAI License */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium mb-2">
                    FSSAI License *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "fssaiLicense")}
                      className="flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleFileUpload("fssaiLicense")}
                      disabled={
                        !documents.fssaiLicense || uploading.fssaiLicense
                      }
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading.fssaiLicense ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  {uploadedFiles.fssaiLicense && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      File uploaded successfully
                    </p>
                  )}
                </div>

                {/* Owner Aadhar */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium mb-2">
                    Owner Aadhar Card *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "ownerAadhar")}
                      className="flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleFileUpload("ownerAadhar")}
                      disabled={!documents.ownerAadhar || uploading.ownerAadhar}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading.ownerAadhar ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  {uploadedFiles.ownerAadhar && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      File uploaded successfully
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">
                Additional Information (Optional)
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://yourrestaurant.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="facebook.com/yourrestaurant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="@yourrestaurant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number of Tables
                  </label>
                  <input
                    type="number"
                    name="numberOfTables"
                    value={formData.numberOfTables}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-light py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined !text-4xl">
                  store
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-black">Register Your Restaurant</h1>
            <p className="text-gray-600 mt-2">Step {currentStep} of 4</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 mx-1 rounded-full ${
                    step <= currentStep ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Previous
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Already registered?{" "}
              <Link
                to="/restaurant/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
            <p className="mt-2">
              Are you a customer?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                Create customer account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSignupPage;
