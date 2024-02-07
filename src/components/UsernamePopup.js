const UsernamePopup = ({ isOpen, onSave, onCancel }) => {
    const [username, setUsername] = useState('');
  
    if (!isOpen) {
      return null;
    }
  
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        zIndex: 1000,
        border: '1px solid #ccc',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <h2>Select a Username</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            fontSize: '16px',
            padding: '10px',
            margin: '10px 0',
            display: 'block',
            width: '100%',
          }}
        />
        <button onClick={() => onSave(username)} style={{ marginRight: '10px' }}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
  