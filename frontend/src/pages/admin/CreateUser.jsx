import { useEffect, useState } from "react";
import api from "../../api/axios";


export default function Users() {
const [users, setUsers] = useState([]);


useEffect(() => {
api.get("/users/active").then(res => setUsers(res.data.data));
}, []);
return (
<div>
<h1 className="text-xl mb-6">Active Users</h1>
<table className="w-full">
<thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
<tbody>
{users.map(u => (
<tr key={u._id}>
<td>{u.name}</td>
<td>{u.email}</td>
<td>{u.role}</td>
</tr>
))}
</tbody>
</table>
</div>
);
}