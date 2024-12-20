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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Toaster, toast } from "sonner";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useCallback } from "react";
import { z } from "zod";

const formSchema = z.object({
  full_name: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  contact_permission: z.boolean().default(false),
  role: z.string(),
  interview_date: z.date(),
  interview_type: z.string(),
  interview_mode: z.enum(["In-Person", "Virtual", "Phone"]),
  rating_experience: z.number().min(1).max(5),
  rating_professionalism: z.number().min(1).max(5),
  difficulty: z.number().min(1).max(5),
  description_clear: z.boolean(),
  liked: z.string().or(z.literal("")),
  improved: z.string().or(z.literal("")),
  recommendation: z.enum(["Definitely", "Maybe", "No"]),
  heard_about: z.string(),
});

export default function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
    },
  });

  const calculateProgress = useCallback(() => {
    const totalFields = 16;
    let filledFields = 0;
    const formValues = form.getValues();

    Object.keys(formValues).forEach((key) => {
      if (formValues[key] !== "" && formValues[key] !== undefined) {
        filledFields++;
      }
    });

    const progressPercentage = (filledFields / totalFields) * 100;
    setProgress(progressPercentage);
  }, [form]); // form is a dependency, since we use it inside the callback

  useEffect(() => {
    form.watch(calculateProgress);
  }, [form, calculateProgress]);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await axios.post(`${API_BASE_URL}/feedback`, values);
      console.log(response);
      form.reset();
      toast.success(response.data.message);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("There was an error submitting your feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formSubmitted) {
    return (
      <div className="container mx-auto pt-5 pb-10 my-10 max-w-5xl px-14 shadow-md rounded-3xl">
        <h2 className="text-primary text-3xl font-bold mb-6">
          Thank You for Your Feedback!
        </h2>
        <p>Your feedback has been successfully submitted.</p>
        <p>
          <Link className="text-blue-500 hover:underline" href="/">
            Back to main page
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container bg-card mx-auto pt-5 pb-10 my-10 max-w-5xl px-14 shadow-md rounded-3xl">
      <Toaster richColors position="top-center" />
      <div className="sticky top-0 z-10 pt-5 pb-5">
        <Progress value={progress} />
      </div>

      <h2 className="text-primary text-3xl font-bold mb-6">
        Submit Your Feedback
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name (Optional)</FormLabel>
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
              <FormItem>
                <FormLabel>
                  Can we contact you about your feedback?
                  <span className="text-red-500"> *</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value}
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
                <FormLabel>
                  Role Interviewed For<span className="text-red-500"> *</span>
                </FormLabel>
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
                <FormLabel>
                  Date of Interview<span className="text-red-500"> *</span>
                </FormLabel>
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
                <FormLabel>
                  Type of Interview<span className="text-red-500"> *</span>
                </FormLabel>
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
                <FormLabel>
                  Mode of Interview<span className="text-red-500"> *</span>
                </FormLabel>
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
                <FormLabel>
                  Overall Experience<span className="text-red-500"> *</span>
                </FormLabel>
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
                <FormDescription>1: Very Poor - 5: Excellent</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating_professionalism"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Interviewer Professionalism
                  <span className="text-red-500"> *</span>
                </FormLabel>
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
                  1: Very Unprofessional - 5: Very Professional
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
                <FormLabel>
                  Interview Difficulty<span className="text-red-500"> *</span>
                </FormLabel>
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
                  1: Very Easy - 5: Very Difficult
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description_clear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Was the Job Description Clear?
                  <span className="text-red-500"> *</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes, I understood everything
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No, I still have questions
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
          <FormField
            control={form.control}
            name="heard_about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  How did you hear about this opportunity?
                  <span className="text-red-500"> *</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Social media">Social media</SelectItem>
                    <SelectItem value="Job fair">Job fair</SelectItem>
                    <SelectItem value="Advertisement">Advertisement</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="secondary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
