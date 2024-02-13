import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import EventComments from './EventComments';

const BlogPage = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [reviews, setReviews] = useState({});
  const [newComments, setNewComments] = useState({});
  const [username, setUsername] = useState('');
  const { isUserAuthenticated } = useAuth();
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);

  useEffect(() => {
    console.log("User isAuthenticated:", isUserAuthenticated);

    const savedUsername = localStorage.getItem('username') || `Guest${Math.floor(Math.random() * 10000)}`;
    setUsername(savedUsername);

    if (isUserAuthenticated && !localStorage.getItem('username')) {
      setShowUsernamePopup(true);
    }

    const savedComments = JSON.parse(localStorage.getItem('newComments')) || {};
    setNewComments(savedComments);

    fetch('/api/past-events')
      .then(response => response.json())
      .then(data => {
        setPastEvents(data);
        const initialComments = data.reduce((acc, event) => {
          acc[event.id] = [];
          return acc;
        }, {});
        setNewComments(prevComments => ({ ...initialComments, ...prevComments }));

        data.forEach(event => {
          fetch(`/api/reviews/${event.id}`)
            .then(response => response.json())
            .then(reviewsData => {
              setReviews(prevReviews => ({
                ...prevReviews,
                [event.id]: reviewsData,
              }));
            })
            .catch(error => console.error('Error fetching reviews:', error));
        });
      })
      .catch(error => console.error('Error fetching past events:', error));
  }, [isUserAuthenticated]);

  const handleSaveUsername = (newUsername) => {
    console.log("Username saved:", newUsername);
    localStorage.setItem('username', newUsername);
    setUsername(newUsername);
    setShowUsernamePopup(false);
  };

  const handleCommentSubmit = async (eventId, commentText) => {
    if (!commentText.trim()) return;

    const comment = { userName: username, comment: commentText };
    const eventComments = newComments[eventId] ? [...newComments[eventId], comment] : [comment];
    const updatedComments = { ...newComments, [eventId]: eventComments };

    localStorage.setItem('newComments', JSON.stringify(updatedComments));
    setNewComments(updatedComments);
  };

  const welcomeMessageStyle = {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    top: '600px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#007bff', 
    color: 'white', 
    padding: '10px 20px',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    wordWrap: 'break-word',
  };

  return (
    <div>
      <img src="/blog.png" alt="Blog Background" style={{ width: '100%', maxHeight: '600px', position: 'absolute', top: 0, left: 0, zIndex: -1 }} />
      {!username.startsWith('Guest') && (
        <div style={welcomeMessageStyle}>
          <h2>Welcome, {username}!</h2>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', maxWidth: '1500px', paddingTop: '650px' }}>
        {pastEvents.map(event => (
          <div key={event.id} style={{ backgroundColor: '#f3f3f3', padding: '20px', margin: '20px 0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', width: '90%', borderRadius: '10px', position: 'relative', zIndex: 1 }}>
            <h3>{event.title}</h3>
            <p><strong>Posted by: Spot - Mtl</strong></p>
            <p>{event.description}</p>
            <img src={event.image} alt={event.title} style={{ width: '55%', height: 'auto', borderRadius: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
            <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ccc'}}>
              <h4>Comments</h4>
              <ul style={{ listStyleType: 'none', padding: '0' }}>
                {reviews[event.id] && reviews[event.id].length > 0 && reviews[event.id].map((review, index) => (
                  <li key={index} style={{ background: '#e9e9e9', margin: '10px 0', padding: '10px', borderRadius: '5px' }}>
                    <strong>{review.userName}:</strong> {review.comment}
                  </li>
                ))}
                {newComments[event.id] && newComments[event.id].map((comment, index) => (
                  <li key={`new-${index}`} style={{ background: '#d9d9d9', margin: '10px 0', padding: '10px', borderRadius: '5px' }}>
                    <strong>{comment.userName}:</strong> {comment.comment}
                  </li>
                ))}
              </ul>
              <EventComments event={event} onCommentSubmit={(eventId, commentText) => handleCommentSubmit(eventId, commentText)} />
            </div>
          </div>
        ))}
      </div>
      {showUsernamePopup && (
        <UsernamePopup
          isOpen={showUsernamePopup}
          onSave={handleSaveUsername}
          onClose={() => setShowUsernamePopup(false)}
        />
      )}
    </div>
  );
};

const UsernamePopup = ({ isOpen, onSave, onClose }) => {
  const [username, setUsername] = useState('');

  return isOpen ? (
    <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', zIndex: 1050 }}>
      <h2>Select a Username</h2>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      <button onClick={() => onSave(username)}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;
};

export default BlogPage;
