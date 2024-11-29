"use client";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, CalendarIcon } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
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
      full_name: "",
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
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_permission"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes, you can contact me about my feedback
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No, please don&apos;t contact me
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Interviewed For</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Software Engineer Intern">
                      Software Engineer Intern
                    </SelectItem>
                    <SelectItem value="Data Scientist">
                      Data Scientist
                    </SelectItem>
                    <SelectItem value="Product Manager">
                      Product Manager
                    </SelectItem>
                    <SelectItem value="UX Designer">UX Designer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interview_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Interview</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interview_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Interview</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Technical Interview">
                      Technical Interview
                    </SelectItem>
                    <SelectItem value="HR Interview">HR Interview</SelectItem>
                    <SelectItem value="Behavioral Interview">
                      Behavioral Interview
                    </SelectItem>
                    <SelectItem value="Group Interview">
                      Group Interview
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interview_mode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Mode of Interview</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="In-Person" />
                      </FormControl>
                      <FormLabel className="font-normal">In-Person</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Virtual" />
                      </FormControl>
                      <FormLabel className="font-normal">Virtual</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Phone" />
                      </FormControl>
                      <FormLabel className="font-normal">Phone</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Experience</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                    className="flex space-x-1"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating}>
                        <FormControl>
                          <RadioGroupItem
                            value={rating.toString()}
                            className="sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "cursor-pointer rounded-md p-2 hover:bg-accent",
                            field.value === rating &&
                              "bg-primary text-primary-foreground hover:bg-primary"
                          )}
                        >
                          {rating}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Rate your overall experience (1-5)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating_professionalism"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interviewer Professionalism</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                    className="flex space-x-1"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating}>
                        <FormControl>
                          <RadioGroupItem
                            value={rating.toString()}
                            className="sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "cursor-pointer rounded-md p-2 hover:bg-accent",
                            field.value === rating &&
                              "bg-primary text-primary-foreground hover:bg-primary"
                          )}
                        >
                          {rating}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Rate the interviewer&apos;s professionalism (1-5)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Difficult">Difficult</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description_clear"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes, the job description was clear
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No, the job description was not clear
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="liked"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  What did you like about the interview process?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us what you liked..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="improved"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What could be improved?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us what could be improved..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recommendation"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Would you recommend Swisscom?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Definitely" />
                      </FormControl>
                      <FormLabel className="font-normal">Definitely</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Maybe" />
                      </FormControl>
                      <FormLabel className="font-normal">Maybe</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {/* 
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
      </form> */}
    </div>
  );
}
