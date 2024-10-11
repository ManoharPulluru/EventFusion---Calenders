// import React, { useEffect, useState } from 'react';
// import { GoogleOAuthProvider, googleLogout, useGoogleLogin } from '@react-oauth/google';
// import { gapi } from 'gapi-script';
// import axios from 'axios';

// const clientId = 'YOUR_CLIENT_ID';

// const App = () => {
//   const [token, setToken] = useState(null);
//   const [eventDetails, setEventDetails] = useState({
//     summary: '',
//     location: '',
//     description: '',
//     startDateTime: '',
//     endDateTime: '',
//   });

//   useEffect(() => {
//     function start() {
//       gapi.client.init({
//         clientId: clientId,
//         scope: 'https://www.googleapis.com/auth/calendar.events',
//       });
//     }
//     gapi.load('client:auth2', start);
//   }, []);

//   const login = useGoogleLogin({
//     onSuccess: (response) => {
//       console.log('Login Success:', response);
//       // Use response.access_token for Google API requests
//       setToken(response.access_token);
//     },
//     onError: (error) => {
//       console.error('Login failed:', error);
//     },
//     scope: 'https://www.googleapis.com/auth/calendar.events',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEventDetails((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const createEvent = async () => {
//     if (!token) {
//       console.log('User not authenticated');
//       return;
//     }

//     const event = {
//       summary: eventDetails.summary,
//       location: eventDetails.location,
//       description: eventDetails.description,
//       start: {
//         dateTime: new Date(eventDetails.startDateTime).toISOString(),
//         timeZone: 'America/Los_Angeles', // Adjust timezone accordingly
//       },
//       end: {
//         dateTime: new Date(eventDetails.endDateTime).toISOString(),
//         timeZone: 'America/Los_Angeles',
//       },
//     };

//     try {
//       const response = await axios.post(
//         'https://www.googleapis.com/calendar/v3/calendars/primary/events',
//         event,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Use the access token here
//           },
//         }
//       );
//       console.log('Event created successfully:', response.data);
//       alert('Event created!');
//     } catch (error) {
//       console.error('Error creating event:', error);
//     }
//   };

//   return (
//     <GoogleOAuthProvider clientId={clientId}>
//       <div style={{ textAlign: 'center', marginTop: '50px' }}>
//         <h2>Google Calendar Event Creator</h2>
//         <button onClick={() => login()}>Login with Google</button>

//         {token && (
//           <div>
//             <h3>Create an Event</h3>
//             <div>
//               <input
//                 type="text"
//                 name="summary"
//                 placeholder="Event Summary"
//                 value={eventDetails.summary}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <input
//                 type="text"
//                 name="location"
//                 placeholder="Event Location"
//                 value={eventDetails.location}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <input
//                 type="text"
//                 name="description"
//                 placeholder="Event Description"
//                 value={eventDetails.description}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <input
//                 type="datetime-local"
//                 name="startDateTime"
//                 value={eventDetails.startDateTime}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <input
//                 type="datetime-local"
//                 name="endDateTime"
//                 value={eventDetails.endDateTime}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <button onClick={createEvent}>Create Event</button>
//           </div>
//         )}
//       </div>
//     </GoogleOAuthProvider>
//   );
// };

// export default App;


import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { gapi } from 'gapi-script';
import axios from 'axios';

const clientId = '311151984401-7sn1k89h66pse9jk45feppc85bk8k0s9.apps.googleusercontent.com';

const App = () => {
  const [token, setToken] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    summary: '',
    location: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: 'https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.events',
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log('Login Success:', response);
      setToken(response.access_token);

      // Fetch upcoming events for the next week after login
      fetchUpcomingEvents(response.access_token);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
    scope: 'https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.events',
  });

  const fetchUpcomingEvents = async (accessToken) => {
    try {
      const now = new Date();
      const oneWeekLater = new Date();
      oneWeekLater.setDate(now.getDate() + 7);

      const response = await axios.get(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          params: {
            timeMin: now.toISOString(),
            timeMax: oneWeekLater.toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: 'startTime',
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const events = response.data.items;
      setEvents(events);
      console.log('Upcoming events:', events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createEvent = async () => {
    if (!token) {
      console.log('User not authenticated');
      return;
    }

    const event = {
      summary: eventDetails.summary,
      location: eventDetails.location,
      description: eventDetails.description,
      start: {
        dateTime: new Date(eventDetails.startDateTime).toISOString(),
        timeZone: 'America/Los_Angeles', // Adjust timezone accordingly
      },
      end: {
        dateTime: new Date(eventDetails.endDateTime).toISOString(),
        timeZone: 'America/Los_Angeles',
      },
    };

    try {
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        event,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the access token here
          },
        }
      );
      console.log('Event created successfully:', response.data);
      alert('Event created!');

      // After creating event, fetch the updated list of upcoming events
      fetchUpcomingEvents(token);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Google Calendar Event Manager</h2>
        <button onClick={() => login()}>Login with Google</button>

        {token && (
          <div>
            <h3>Create an Event</h3>
            <div>
              <input
                type="text"
                name="summary"
                placeholder="Event Summary"
                value={eventDetails.summary}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="location"
                placeholder="Event Location"
                value={eventDetails.location}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="description"
                placeholder="Event Description"
                value={eventDetails.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                type="datetime-local"
                name="startDateTime"
                value={eventDetails.startDateTime}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                type="datetime-local"
                name="endDateTime"
                value={eventDetails.endDateTime}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={createEvent}>Create Event</button>

            <h3>Upcoming Events (Next 7 Days)</h3>
            {events.length > 0 ? (
              <ul>
                {events.map((event, index) => (
                  <li key={index}>
                    {event.summary} -{' '}
                    {new Date(event.start.dateTime || event.start.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming events found.</p>
            )}
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
