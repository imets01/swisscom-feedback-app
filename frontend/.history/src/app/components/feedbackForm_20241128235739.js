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
    <div>
      <h2>Submit Your Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="full_name">Full Name:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="contact_permission">Permission to contact:</label>
          <input
            type="checkbox"
            id="contact_permission"
            name="contact_permission"
            checked={formData.contact_permission}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="role">Role Interviewed For:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="interview_date">Interview Date:</label>
          <input
            type="date"
            id="interview_date"
            name="interview_date"
            value={formData.interview_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="interview_type">Interview Type:</label>
          <input
            type="text"
            id="interview_type"
            name="interview_type"
            value={formData.interview_type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="interview_mode">Interview Mode:</label>
          <input
            type="text"
            id="interview_mode"
            name="interview_mode"
            value={formData.interview_mode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="rating_experience">
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
          />
        </div>
        <div>
          <label htmlFor="rating_professionalism">
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
          />
        </div>
        <div>
          <label htmlFor="difficulty">Interview Difficulty:</label>
          <input
            type="text"
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description_clear">
            Was the role description clear?
          </label>
          <input
            type="checkbox"
            id="description_clear"
            name="description_clear"
            checked={formData.description_clear}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="liked">
            What did you like about the interview process?
          </label>
          <textarea
            id="liked"
            name="liked"
            value={formData.liked}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="improved">What could be improved?</label>
          <textarea
            id="improved"
            name="improved"
            value={formData.improved}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="recommendation">Would you recommend Swisscom?</label>
          <input
            type="text"
            id="recommendation"
            name="recommendation"
            value={formData.recommendation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="heard_about">
            How did you hear about this opportunity?
          </label>
          <input
            type="text"
            id="heard_about"
            name="heard_about"
            value={formData.heard_about}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
