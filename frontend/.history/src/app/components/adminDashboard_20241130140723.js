"use client";
import { useState } from "react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Required chart.js components

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [sortedInterviewTypes, setSortedInterviewTypes] = useState([]); // State to store sorted interview types

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (stats) {
      console.log(stats);
      const interviewTypeCount = stats?.interview_type_distribution || {};
      console.log(interviewTypeCount);
      if (interviewTypeCount && Object.keys(interviewTypeCount).length > 0) {
        const sortedTypes = Object.entries(interviewTypeCount).sort(
          (a, b) => b[1] - a[1] // Sort by count descending
        );
        setSortedInterviewTypes(sortedTypes); // Update sorted interview types state
      }
    }
  }, [stats]); // This effect runs when `stats` is updated

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

  if (sortedInterviewTypes.length === 0) {
    return <div>No interview type data available.</div>;
  }

  const barChartData = {
    labels: sortedInterviewTypes.map(([type]) => type),
    datasets: [
      {
        label: "Interview Type Count",
        data: sortedInterviewTypes.map(([, count]) => count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Interview Types Distribution
        </h2>
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            plugins: { title: { display: true, text: "Interview Types" } },
          }}
        />
      </div>
    </div>
  );
}
