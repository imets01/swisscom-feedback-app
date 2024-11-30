"use client";
import { useState } from "react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"; // Required chart.js components

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // Needed for Pie chart
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();

      setStats(data);
      console.log(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || stats === null) {
    return <div>Loading...</div>;
  }

  const interviewTypeDistribution = stats?.interview_type_distribution || {};
  const sortedInterviewTypes = Object.entries(interviewTypeDistribution).sort(
    (a, b) => b[1] - a[1]
  );
  const interviewModeDistribution = stats?.interview_mode_distribution || {};
  const sortedInterviewModes = Object.entries(interviewModeDistribution).sort(
    (a, b) => b[1] - a[1]
  );

  // Prepare data for the Bar chart
  const barChartData = {
    labels: sortedInterviewTypes.map(([type]) => type),
    datasets: [
      {
        label: "Interview Type Count",
        data: sortedInterviewTypes.map(([, count]) => count),
        backgroundColor: "rgba(75, 192, 192)", // Bar color
        borderWidth: 1, // Border width
      },
    ],
  };

  const pieChartData = {
    labels: sortedInterviewModes.map(([mode]) => mode),
    datasets: [
      {
        label: "Interview Mode Count",
        data: sortedInterviewModes.map(([, count]) => count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-12 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {/* <Button onClick={handleSignOut}>Log Out</Button> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedbacks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_feedbacks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.average_rating} / 5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Common Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{stats.most_common_role}</p>
          </CardContent>
        </Card>
      </div>
      <h2 className="text-2xl font-bold mb-4">Interview Types Distribution</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Most Common Role</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Common Role</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={pieChartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
