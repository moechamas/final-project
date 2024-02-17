import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import EventComments from './EventComments';
import './blogStyles.css'; 
import BlogImage from '../images/blog.png';

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

    fetch('https://backend-final-9ylj.onrender.com/api/past-events')
      .then(response => response.json())
      .then(data => {
        setPastEvents(data);
        const initialComments = data.reduce((acc, event) => {
          acc[event.id] = [];
          return acc;
        }, {});
        setNewComments(prevComments => ({ ...initialComments, ...prevComments }));

        data.forEach(event => {
          fetch(`https://backend-final-9ylj.onrender.com/api/reviews/${event.id}`)
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

  return (
    <div>
      <img src={BlogImage} alt="Blog Background" className="blog-background" />
      <div className="welcome-box">
        {!username.startsWith('Guest') && (
          <div className="welcome-message">
            <h2>Welcome, {username}!</h2>
          </div>
        )}
      </div>
      <div className="blog-content-container">
        {pastEvents.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p><strong>Posted by: Spot - Mtl</strong></p>
            <p>{event.description}</p>
            <img src={event.image} alt={event.title} className="event-image" />
            <div className="comments-section">
              <h4>Comments</h4>
              <ul className="comments-list">
                {reviews[event.id] && reviews[event.id].length > 0 && reviews[event.id].map((review, index) => (
                  <li key={index} className="comment-item">
                    <strong>{review.userName}:</strong> {review.comment}
                  </li>
                ))}
                {newComments[event.id] && newComments[event.id].map((comment, index) => (
                  <li key={`new-${index}`} className="new-comment-item">
                    <strong>{comment.userName}:</strong> {comment.comment}
                  </li>
                ))}
              </ul>
              <EventComments event={event} onCommentSubmit={handleCommentSubmit} />
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
