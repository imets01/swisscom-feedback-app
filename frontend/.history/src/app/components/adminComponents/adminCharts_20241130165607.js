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

export function AdminCharts() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Interview Types Distribution</h2>
      <div className="flex-grow flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4 overflow-hidden">
        <Card className="flex-1 flex flex-col ">
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
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">
              Scatter Plot: Difficulty vs Experience Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="grow overflow-hidden p-4">
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
        <Card className="flex-1 flex flex-col">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">
              Horizontal Bar Chart: Heard About Us
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-4">
            <div className="w-full h-full">
              <Bar
                data={horizontalBarChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: "y", // Render horizontal bars
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
