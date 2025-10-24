import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const RestaurantSignupPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Business Information
    restaurantName: "",
    businessType: "",
    cuisineType: "",
    description: "",

    // Step 2: Location
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    phone: "",

    // Step 3: Owner Information
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    password: "",
    confirmPassword: "",

    // Step 4: Verification
    businessLicense: "",
    taxId: "",

    // Step 5: Additional (Optional)
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    numberOfTables: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const totalSteps = 5;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
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

      case 2:
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

      case 3:
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

      case 4:
        if (!formData.businessLicense.trim()) {
          setError("Business license number is required");
          return false;
        }
        if (!formData.taxId.trim()) {
          setError("Tax ID is required");
          return false;
        }
        break;

      case 5:
        // Optional step, no validation needed
        break;
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
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
          documents: [],
        },
        website: formData.website,
        socialMedia: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
        },
        numberOfTables: formData.numberOfTables
          ? parseInt(formData.numberOfTables)
          : null,
      };

      await axios.post("/api/restaurant/register", registrationData);

      // Show success message and redirect
      navigate("/restaurant/pending", {
        state: { message: "Registration submitted successfully!" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    