﻿"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  contact_permission: z.boolean().default(false),
  role: z.string(),
  interview_date: z.date(),
  interview_type: z.string(),
  interview_mode: z.enum(["In-Person", "Virtual", "Phone"]),
  rating_experience: z.number().min(1).max(5),
  rating_professionalism: z.number().min(1).max(5),
  difficulty: z.enum(["Easy", "Moderate", "Difficult"]),
  description_clear: z.boolean(),
  liked: z.string().optional(),
  improved: z.string().optional(),
  recommendation: z.enum(["Definitely", "Maybe", "No"]),
  heard_about: z.string().optional(),
});

export default function FeedbackForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  //   // Handle form input changes
  //   const handleChange = (e) => {
  //     const { name, value, type, checked } = e.target;
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: type === "checkbox" ? checked : value,
  //     }));
  //   };

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/feedback",
        values
      );
      alert(response.data.message); // Show success message
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback.");
    }
  };

  //   // Handle form submission
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       // Send the form data to the Flask backend
  //       const response = await axios.post(
  //         "http://localhost:5000/feedback",
  //         formData
  //       );
  //       alert(response.data.message);
  //     } catch (error) {
  //       console.error("Error submitting feedback:", error);
  //       alert("There was an error submitting your feedback.");
  //     }
  //   };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6">Submit Your Feedback</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="full-name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <form onSubmit={form.handleSubmit(onSubmit)}>
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
        <Button type="submit">Click me</Button>
      </form>
    </div>
  );
}
