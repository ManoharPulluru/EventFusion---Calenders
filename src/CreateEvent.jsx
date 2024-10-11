import React, { useState } from "react";
import axios from "axios";

const CreateEvent = ({ accessToken }) => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");

  const createCalendarEvent = async () => {
    const event = {
      summary: eventTitle,
      start: {
        dateTime: eventDate, // The date and time the event starts
        timeZone: "America/Los_Angeles", // Change as per your time zone
      },
      end: {
        dateTime: new Date(new Date(eventDate).getTime() + 60 * 60 * 1000).toISOString(), // Event end time
        timeZone: "America/Los_Angeles",
      },
    };

    try {
      const response = await axios.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Use the access token to authenticate
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Event created: ", response.data);
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Event Title"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
      />
      <input
        type="datetime-local"
        placeholder="Event Date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />
      <button onClick={createCalendarEvent}>Create Event</button>
    </div>
  );
};

export default CreateEvent;
