"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const fetchFeedback = async () => {
    try {
      const response = await fetch("http://localhost:5000/feedback");
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      const data = await response.json();
      setFeedbackList(data);
      setLoading(false);
    } catch (err) {
      setError("An error occurred while fetching feedback");
      setLoading(false);
    }
  };

  const calculateStatistics = () => {
    const totalFeedback = feedbackList.length;
    const averageRating =
      feedbackList.reduce(
        (sum, feedback) => sum + feedback.rating_experience,
        0
      ) / totalFeedback;

    const modeMap = new Map();
    feedbackList.forEach((feedback) => {
      modeMap.set(feedback.role, (modeMap.get(feedback.role) || 0) + 1);
    });
    const mostCommonRole = Array.from(modeMap.entries()).reduce(
      (a, b) => (a[1] > b[1] ? a : b),
      [null, 0]
    )[0];

    // const interviewModeDistribution = {
    //   "In-Person": feedbackList.filter(
    //     (f) => f.interview_mode === "In-Person"
    //   ).length,
    //   Virtual: feedbackList.filter(
    //     (f) => f.interview_mode === "Virtual"
    //   ).length,
    //   Phone: feedbackList.filter((f) => f.interview_mode === "Phone")
    //     .length,
    // }

    return {
      totalFeedback,
      averageRating,
      // mostCommonRole,
      // interviewModeDistribution,
    };
  };

  const stats = calculateStatistics();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Button onClick={handleSignOut}>Log Out</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedbacks</CardTitle>
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
      </div>
    </div>
  );
}
