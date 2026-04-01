import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function PerformanceControl() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    api.get("/performance/records")
      .then(res => {
        const map = {};
        res.data.data.forEach(r => {
          if (!map[r.userId]) map[r.userId] = 0;
          map[r.userId] += r.score;
        });

        setChartData(
          Object.entries(map).map(([user, score]) => ({
            user,
            score
          }))
        );
      });
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full text-white">
        <h1 className="text-xl font-bold mb-4">User Performance Comparison</h1>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="user" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" />
          </BarChart>
        </ResponsiveContainer>
      </main>
    </div>
  );
}
