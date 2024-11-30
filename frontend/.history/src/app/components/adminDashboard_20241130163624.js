"use client";
import { useState } from "react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie, Scatter } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"; // Required chart.js components

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
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

  const difficultyRatingData = stats?.difficulty_rating || [];
  const scatterData = {
    datasets: [
      {
        label: "Difficulty vs Experience Rating",
        data: difficultyRatingData.map((item) => ({
          x: item.rating_experience,
          y: item.difficulty,
        })),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Point color
        borderColor: "rgba(75, 192, 192, 1)",
        pointRadius: 5,
      },
    ],
  };

  // Prepare data for the Bar chart
  const barChartData = {
    labels: sortedInterviewTypes.map(([type]) => type),
    datasets: [
      {
        label: "Interview Type Count",
        data: sortedInterviewTypes.map(([, count]) => count),
        backgroundColor: "rgba(54, 162, 235)",
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
          "rgba(54, 162, 235)",
          "rgba(255, 99, 132)",
          "rgba(255, 206, 86)",
          "rgba(75, 192, 192)",
        ],

        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col h-screen mx-12 py-8">
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
      <div className="flex-grow flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4 overflow-hidden">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">
              Interview Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-4">
            <div className="w-full h-full">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">
              Interview Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-4">
            <div className="w-full h-full">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="flex-6 flex flex-col min-h-0">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">
              Scatter Plot: Difficulty vs Experience Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-4">
            <div className="w-full h-full">
              <Scatter
                data={scatterData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      title: { display: true, text: "Experience Rating" },
                    },
                    y: {
                      title: { display: true, text: "Difficulty Rating" },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex-grow flex flex-col p-4"></div>
      </div>
    </div>
  );
}

//   return (
//     <div className="flex flex-col h-screen overflow-hidden mx-12 py-8">
//       <div className="container mx-auto py-4 flex-shrink-0 overflow-y-auto">
//         <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
//         {/* <Button onClick={handleSignOut}>Log Out</Button> */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <Card>
//             <CardHeader>
//               <CardTitle>Total Feedbacks</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">{stats.total_feedbacks}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Average Rating</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">{stats.average_rating} / 5</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Most Common Role</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-xl font-semibold">{stats.most_common_role}</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       <div className="flex-grow flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4 overflow-hidden">
//         <Card className="flex-1 flex flex-col min-h-0">
//           <CardHeader className="p-4">
//             <CardTitle className="text-lg">
//               Interview Types Distribution
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="flex-grow overflow-hidden p-4">
//             <div className="w-full h-full">
//               <Bar
//                 data={barChartData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                 }}
//               />
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="flex-1 flex flex-col min-h-0">
//           <CardHeader className="p-4">
//             <CardTitle className="text-lg">
//               Interview Modes Distribution
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="flex-grow overflow-hidden p-4">
//             <div className="w-full h-full">
//               <Pie
//                 data={pieChartData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                 }}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
