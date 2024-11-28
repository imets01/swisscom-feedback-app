"use client";

import { useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  // Set up state for the form inputs
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    contact_permission: false,
    role: "",
    interview_date: "",
    interview_type: "",
    interview_mode: "",
    rating_experience: 1,
    rating_professionalism: 1,
    difficulty: "",
    description_clear: false,
    liked: "",
    improved: "",
    recommendation: "",
    heard_about: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the form data to the Flask backend
      const response = await axios.post(
        "http://localhost:5000/feedback",
        formData
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Submit Your Feedback</h2>

      <div className="mb-4">
        <label htmlFor="full_name" className="form-label">
          Full Name:
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="form-label">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="form-label">
          Phone:
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="contact_permission" className="form-label">
          Permission to contact:
        </label>
        <input
          type="checkbox"
          id="contact_permission"
          name="contact_permission"
          checked={formData.contact_permission}
          onChange={handleChange}
          className="h-5 w-5 text-blue-500 focus:ring-0"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="role" className="form-label">
          Role Interviewed For:
        </label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="interview_date" className="form-label">
          Interview Date:
        </label>
        <input
          type="date"
          id="interview_date"
          name="interview_date"
          value={formData.interview_date}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="interview_type" className="form-label">
          Interview Type:
        </label>
        <input
          type="text"
          id="interview_type"
          name="interview_type"
          value={formData.interview_type}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="interview_mode" className="form-label">
          Interview Mode:
        </label>
        <input
          type="text"
          id="interview_mode"
          name="interview_mode"
          value={formData.interview_mode}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="rating_experience" className="form-label">
          Overall Experience Rating (1-5):
        </label>
        <input
          type="number"
          id="rating_experience"
          name="rating_experience"
          min="1"
          max="5"
          value={formData.rating_experience}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="rating_professionalism" className="form-label">
          Interviewer Professionalism (1-5):
        </label>
        <input
          type="number"
          id="rating_professionalism"
          name="rating_professionalism"
          min="1"
          max="5"
          value={formData.rating_professionalism}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="difficulty" className="form-label">
          Interview Difficulty:
        </label>
        <input
          type="text"
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description_clear" className="form-label">
          Was the role description clear?
        </label>
        <input
          type="checkbox"
          id="description_clear"
          name="description_clear"
          checked={formData.description_clear}
          onChange={handleChange}
          className="h-5 w-5 text-blue-500 focus:ring-0"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
