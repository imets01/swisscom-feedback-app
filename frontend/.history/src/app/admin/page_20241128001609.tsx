"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Feedback {
  id: number;
  full_name: string;
  role: string;
  interview_date: string;
  rating_experience: number;
  interview_mode: string;
}

export default function AdminDashboard() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [filteredFeedbackList, setFilteredFeedbackList] = useState<Feedback[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [ratingRange, setRatingRange] = useState({ min: "", max: "" });
  const [interviewType, setInterviewType] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [feedbackList, dateRange, ratingRange, interviewType]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch("http://localhost:5000/feedback");
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      const data = await response.json();
      setFeedbackList(data);
      setFilteredFeedbackList(data);
      setLoading(false);
    } catch (err) {
      setError("An error occurred while fetching feedback");
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...feedbackList];

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(
        (feedback) =>
          feedback.interview_date >= dateRange.start &&
          feedback.interview_date <= dateRange.end
      );
    }

    if (ratingRange.min && ratingRange.max) {
      filtered = filtered.filter(
        (feedback) =>
          feedback.rating_experience >= parseInt(ratingRange.min) &&
          feedback.rating_experience <= parseInt(ratingRange.max)
      );
    }

    if (interviewType && interviewType !== "all") {
      filtered = filtered.filter(
        (feedback) => feedback.interview_mode === interviewType
      );
    }

    setFilteredFeedbackList(filtered);
  };

  const calculateStatistics = () => {
    const totalFeedback = filteredFeedbackList.length;
    const averageRating =
      filteredFeedbackList.reduce(
        (sum, feedback) => sum + feedback.rating_experience,
        0
      ) / totalFeedback;
    const modeMap = new Map();
    filteredFeedbackList.forEach((feedback) => {
      modeMap.set(feedback.role, (modeMap.get(feedback.role) || 0) + 1);
    });
    const mostCommonRole = Array.from(modeMap.entries()).reduce(
      (a, b) => (a[1] > b[1] ? a : b),
      [null, 0] // Initial value should be a tuple of two elements (key, value)
    )[0];

    const interviewModeDistribution = {
      "In-Person": filteredFeedbackList.filter(
        (f) => f.interview_mode === "In-Person"
      ).length,
      Virtual: filteredFeedbackList.filter(
        (f) => f.interview_mode === "Virtual"
      ).length,
      Phone: filteredFeedbackList.filter((f) => f.interview_mode === "Phone")
        .length,
    };

    return {
      totalFeedback,
      averageRating,
      mostCommonRole,
      interviewModeDistribution,
    };
  };

  const stats = calculateStatistics();

  const pieChartData = {
    labels: ["In-Person", "Virtual", "Phone"],
    datasets: [
      {
        data: [
          stats.interviewModeDistribution["In-Person"],
          stats.interviewModeDistribution.Virtual,
          stats.interviewModeDistribution.Phone,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalFeedback}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.averageRating.toFixed(1)} / 5
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Common Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{stats.mostCommonRole}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interview Mode Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={pieChartData} />
          </CardContent>
        </Card>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="interview-type">Interview Type</Label>
            <Select onValueChange={(value) => setInterviewType(value)}>
              <SelectTrigger id="interview-type">
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                {/* Use a valid value instead of an empty string */}
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="In-Person">In-Person</SelectItem>
                <SelectItem value="Virtual">Virtual</SelectItem>
                <SelectItem value="Phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="min-rating">Min Rating</Label>
            <Input
              id="min-rating"
              type="number"
              min="1"
              max="5"
              value={ratingRange.min}
              onChange={(e) =>
                setRatingRange({ ...ratingRange, min: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="max-rating">Max Rating</Label>
            <Input
              id="max-rating"
              type="number"
              min="1"
              max="5"
              value={ratingRange.max}
              onChange={(e) =>
                setRatingRange({ ...ratingRange, max: e.target.value })
              }
            />
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Feedback List</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role Interviewed For</TableHead>
              <TableHead>Date of Interview</TableHead>
              <TableHead>Overall Experience Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedbackList.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>{feedback.full_name || "Anonymous"}</TableCell>
                <TableCell>{feedback.role}</TableCell>
                <TableCell>
                  {new Date(feedback.interview_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{feedback.rating_experience}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Mark as Reviewed
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
