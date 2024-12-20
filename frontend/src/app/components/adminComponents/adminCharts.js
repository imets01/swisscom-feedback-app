﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Bar, Pie, Scatter } from "react-chartjs-2";
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
} from "chart.js";

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

export function AdminCharts({ stats }) {
  const interviewTypeDistribution = stats?.interview_type_distribution || {};
  const sortedInterviewTypes = Object.entries(interviewTypeDistribution).sort(
    (a, b) => b[1] - a[1]
  );
  const barChartData = {
    labels: sortedInterviewTypes.map(([type]) => type),
    datasets: [
      {
        label: "Interview Type Count",
        data: sortedInterviewTypes.map(([, count]) => count),
        backgroundColor: "#086adb",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const interviewModeDistribution = stats?.interview_mode_distribution || {};
  const sortedInterviewModes = Object.entries(interviewModeDistribution).sort(
    (a, b) => b[1] - a[1]
  );
  const pieChartData = {
    labels: sortedInterviewModes.map(([mode]) => mode),
    datasets: [
      {
        label: "Interview Mode Count",
        data: sortedInterviewModes.map(([, count]) => count),
        backgroundColor: ["#086adb", "#e1195f", "#a63297"],

        borderWidth: 1,
      },
    ],
  };

  const difficultyRatingData = stats?.difficulty_rating || [];
  const scatterData = {
    datasets: [
      {
        label: "Difficulty vs Experience Rating",
        data: difficultyRatingData.map((item) => ({
          x: item.rating_experience,
          y: item.difficulty,
        })),
        backgroundColor: "rgba(8, 106, 219, 0.1)",
        borderColor: "#086adb",
        pointRadius: 8,
      },
    ],
  };

  const heardAboutDistribution = stats?.heard_about_distribution || {};
  const sortedHeardAbout = Object.entries(heardAboutDistribution).sort(
    (a, b) => b[1] - a[1]
  );

  const horizontalBarChartData = {
    labels: sortedHeardAbout.map(([source]) => source),
    datasets: [
      {
        label: "How People Heard About Us",
        data: sortedHeardAbout.map(([, count]) => count),
        backgroundColor: "#086adb",
        borderColor: "#086adb",
        borderRadius: 5,
        borderWidth: 1,
      },
    ],
  };

  function ChartCard({ title, children }) {
    return (
      <Card className="shadow-md">
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px] md:h-[400px]">{children}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <ChartCard title="Interview Types Distribution">
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
          />
        </ChartCard>
        <ChartCard title="Interview Mode Distribution">
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "right",
                },
              },
            }}
          />
        </ChartCard>
      </div>
      <div className="grid gap-8">
        <ChartCard title="Difficulty vs Experience Rating">
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
        </ChartCard>
      </div>
      <div className="grid gap-8">
        <ChartCard title="How People Heard About Us">
          <Bar
            data={horizontalBarChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: "y",
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                x: {
                  title: { display: true, text: "Number of Responses" },
                },
                y: {
                  title: { display: true, text: "Sources" },
                },
              },
            }}
          />
        </ChartCard>
      </div>
    </div>
  );
}
