import React, { useState, useEffect } from 'react';

const BlogPage = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    // Fetch past events
    fetch('/api/past-events')
      .then(response => response.json())
      .then(data => {
        setPastEvents(data);
        // For each event, fetch its reviews
        data.forEach(event => {
          fetch(`/api/reviews/${event.id}`)
            .then(response => response.json())
            .then(reviewsData => {
              setReviews(prevReviews => ({
                ...prevReviews,
                [event.id]: reviewsData
              }));
            })
            .catch(error => console.error('Error fetching reviews:', error));
        });
      })
      .catch(error => console.error('Error fetching past events:', error));
  }, []);

  return (
    <div>
      <img src="/blog.png" alt="Blog Background" style={{ width: '100%', maxHeight: '600px', position: 'absolute', top: 0, left: 0, zIndex: -1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', maxWidth: '1500px', paddingTop: '650px' }}>
        {pastEvents.map(event => (
          <div key={event.id} style={{ backgroundColor: '#f3f3f3', padding: '20px', margin: '20px 0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', width: '90%', borderRadius: '10px', position: 'relative', zIndex: 1 }}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <img src={event.image} alt={event.title} style={{ width: '55%', height: 'auto', borderRadius: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
            <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ccc'}}>
              <h4>Comments</h4>
              {reviews[event.id] && reviews[event.id].length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                  {reviews[event.id].map(review => (
                    <li key={review.userName} style={{ background: '#e9e9e9', margin: '10px 0', padding: '10px', borderRadius: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                        <strong>{review.userName}</strong>
                      </div>
                      <p style={{ margin: '5px 0' }}>{review.comment}</p>
                      <p style={{ fontStyle: 'italic' }}>{review.description}</p>
                      <p>Rating: {review.rating} / 5</p>
                    </li>
                  ))}
                </ul>
              ) : <p>No reviews yet.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
