import React from "react";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ApproveEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/admin/pending-events")
      .then(res => setEvents(res.data));
  }, []);

  const approve = (id) => {
    axios.put(`http://localhost:8080/admin/approve/${id}`);
  };

  return (
    <>
      <h3>Approve Events</h3>
      {events.map(e => (
        <div key={e.eid}>
          {e.ename}
          <button onClick={() => approve(e.eid)}>Approve</button>
        </div>
      ))}
    </>
  );
}
