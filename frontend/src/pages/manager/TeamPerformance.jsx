import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function TeamPerformance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/performance/records")
      .then(res => {
        const mapped = res.data.data.map(r => ({
          metric: r.metricId.name,
          score: r.score
        }));
        setData(mapped);
      });
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full text-white">
        <h1 className="text-xl font-bold mb-4">Team Performance</h1>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" />
          </BarChart>
        </ResponsiveContainer>
      </main>
    </div>
  );
}
