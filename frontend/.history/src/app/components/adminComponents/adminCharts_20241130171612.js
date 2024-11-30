import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";

export function AdminCharts({ stats }) {
  const interviewTypeDistribution = stats?.interview_type_distribution || {};
  const sortedInterviewTypes = Object.entries(interviewTypeDistribution).sort(
    (a, b) => b[1] - a[1]
  );

  const barChartData = sortedInterviewTypes.map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const interviewModeDistribution = stats?.interview_mode_distribution || {};
  const sortedInterviewModes = Object.entries(interviewModeDistribution).sort(
    (a, b) => b[1] - a[1]
  );

  const pieChartData = sortedInterviewModes.map(([mode, count]) => ({
    name: mode,
    value: count,
  }));

  const difficultyRatingData = stats?.difficulty_rating || [];
  const scatterChartData = difficultyRatingData.map((item) => ({
    x: item.rating_experience,
    y: item.difficulty,
  }));

  const heardAboutDistribution = stats?.heard_about_distribution || {};
  const sortedHeardAbout = Object.entries(heardAboutDistribution).sort(
    (a, b) => b[1] - a[1]
  );

  const horizontalBarChartData = sortedHeardAbout.map(([source, count]) => ({
    name: source,
    value: count,
  }));

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.overview.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Interview Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart width={400} height={250} data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Mode Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PieChart width={400} height={250}>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${index * 45}, 70%, 60%)`}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Difficulty vs Experience</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ScatterChart width={400} height={250}>
              <XAxis type="number" dataKey="x" name="Experience" />
              <YAxis type="number" dataKey="y" name="Difficulty" />
              <Tooltip />
              <Scatter name="Ratings" data={scatterChartData} fill="#8884d8" />
            </ScatterChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How People Heard About Us</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart
              width={400}
              height={250}
              data={horizontalBarChartData}
              layout="vertical"
            >
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
