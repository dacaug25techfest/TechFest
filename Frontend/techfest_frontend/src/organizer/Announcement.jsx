import React from "react";

import { useState } from "react";
import axios from "axios";

export default function Announcement() {
  const [eid, setEid] = useState("");
  const [message, setMessage] = useState("");

  const send = () => {
    axios
      .post("http://localhost:5001/organizer/announcement", {
        eventId: eid,
        message: message,
      })
      .then(() => alert("Announcement Sent"))
      .catch(err => {
        console.error(err);
        alert("Failed to send announcement");
      });
  };

  return (
    <>
      <h3>Send Announcement</h3>

      <input
        placeholder="Event ID"
        onChange={e => setEid(e.target.value)}
      />

      <textarea
        placeholder="Message"
        onChange={e => setMessage(e.target.value)}
      />

      <button onClick={send}>Send</button>
    </>
  );
}
