import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";

export default function MyCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/calendar")
      .then(res => setEvents(res.data.data));
  }, []);

  const addEvent = async (info) => {
    const title = prompt("Meeting / Reminder");
    if (!title) return;

    const res = await api.post("/calendar", {
      title,
      date: info.dateStr
    });

    setEvents([...events, res.data.data]);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={addEvent}
        />
      </main>
    </div>
  );
}
