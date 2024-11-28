"use client";

import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  // Define the TypeScript type for feedback
  type Feedback = {
    rating: string;
    comments: string;
    recommendation: string;
  };

  // State for the feedback form
  const [feedback, setFeedback] = useState<Feedback>({
    rating: "",
    comments: "",
    recommendation: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/feedback",
        feedback
      );
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div>
      <h1>Submit Your Feedback</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <input
            type="number"
            name="rating"
            value={feedback.rating}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Comments:
          <textarea
            name="comments"
            value={feedback.comments}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Recommendation (Yes/No):
          <input
            type="text"
            name="recommendation"
            value={feedback.recommendation}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
