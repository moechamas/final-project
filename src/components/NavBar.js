import React from 'react';
import { Link } from 'react-router-dom';

const linkStyle = {
  textDecoration: 'none',
  color: 'Black', 
  fontSize: '22px',
  padding: '10px',
  borderRadius: '5px',
};

const separatorStyle = {
  borderLeft: '2px solid #000', 
  height: '60px', 
  alignSelf: 'stretch'
};

const NavBar = () => {
  const [hoverEvents, setHoverEvents] = React.useState(false);
  const [hoverOrder, setHoverOrder] = React.useState(false);
  const [hoverBlog, setHoverBlog] = React.useState(false);

  const navBarStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '26px 0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderWidth: '3px',
    borderColor: 'lightgray',
    borderRadius: '15px',
    position: 'relative',
    top: '470px',
    left: '10vw',
    width: '80%',
    zIndex: 1001,
    boxSizing: 'border-box',
    border: '1px solid #f2f2f2',
    textAlign: 'center',
  };

  return (
    <div style={navBarStyle}>
      <Link to="/events"
            style={{ ...linkStyle, backgroundColor: hoverEvents ? '#a9a9a9' : 'transparent' }}
            onMouseEnter={() => setHoverEvents(true)}
            onMouseLeave={() => setHoverEvents(false)}>
        Events
      </Link>
      <span style={separatorStyle}></span> {/* Vertical Separator */}
      <Link to="/your-order"
            style={{ ...linkStyle, backgroundColor: hoverOrder ? '#a9a9a9' : 'transparent' }}
            onMouseEnter={() => setHoverOrder(true)}
            onMouseLeave={() => setHoverOrder(false)}>
        Your Order
      </Link>
      <span style={separatorStyle}></span> {/* Vertical Separator */}
      <Link to="/blog"
            style={{ ...linkStyle, backgroundColor: hoverBlog ? '#a9a9a9' : 'transparent' }}
            onMouseEnter={() => setHoverBlog(true)}
            onMouseLeave={() => setHoverBlog(false)}>
        Blog
      </Link>
    </div>
  );
};

export default NavBar;
