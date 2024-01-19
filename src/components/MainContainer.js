// MainContainer.js
import React from 'react';
import NavBar from './NavBar';
import EventsPage from './EventsPage';

    const MainContainer = () => {
        const containerStyle = {
          overflowY: 'auto', 
          position: 'relative', 
        };
    
        return (
          <div style={containerStyle}>
            <NavBar />
            <EventsPage />
          </div>
        );
      };
      
      export default MainContainer;
      
