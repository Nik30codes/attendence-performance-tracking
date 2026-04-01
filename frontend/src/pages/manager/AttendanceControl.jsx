import api from "../../api/axios";


export default function AttendanceControl() {
const createSession = async (deptId) => {
await api.post("/attendance/session", { date: new Date(), departmentId: deptId });
};


return <h1>Attendance Control</h1>;
}