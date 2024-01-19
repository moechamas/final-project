import React, { useEffect, useState } from 'react';
import eventsData from '../data.js';

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log('Imported eventsData:', eventsData); 
    if (eventsData && eventsData.events) {
      setEvents(eventsData.events);
    }
  }, []);

  useEffect(() => {
    console.log('Current state of events:', events); 
  }, [events]);

  return (
    <div style={pageStyle}>
      <img src="/home.png" alt="Home" style={imageStyle} />
      <div style={eventsBoxStyle}>
        {events.map(event => (
          <div key={event.id} style={eventStyle}>
            <h3 style={titleStyle}>{event.title}</h3>
            <p style={dateStyle}>{event.startDate} - {event.endDate}</p>
            <button style={buttonStyle}>{event.buttonLabel}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const pageStyle = {
  position: 'relative',
  paddingTop: '38.8%',
};

const imageStyle = {
  position: 'absolute',
  top: -140,
  left: 0,
  width: '100%',
  height: '33.4%',
};

const eventsBoxStyle = {
  padding: '20px',
  borderRadius: '15px',
  backgroundColor: '#f3f3f3',
  boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
  width: '97%',
  maxWidth: '1500px',
  marginTop: '-110px',
  overflowY: 'auto',
  zIndex: 2,
};

const eventStyle = {
  margin: '48px 0',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
};

const titleStyle = {
  fontSize: '1.5rem',
  margin: '0 0 10px 0',
  color: '#333',
};

const dateStyle = {
  fontSize: '1.2rem',
  margin: '0 0 10px 0',
  color: '#555',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
};

export default EventsPage;
