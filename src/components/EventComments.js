import React, { useState } from 'react';

const EventComments = ({ event, onCommentSubmit }) => {
    const [commentText, setCommentText] = useState('');
  
    return (
      <div>
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ width: '70%', padding: '10px', margin: '0 10px 0 0', borderRadius: '5px' }}
        />
        <button
          onClick={() => {
            onCommentSubmit(event.id, commentText);
            setCommentText(''); 
          }}
          type="button"
          style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}
        >
          Submit
        </button>
      </div>
    );
  };
  
  export default EventComments;
