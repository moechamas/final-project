import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 

const NavBar = () => {
  const [hoverEvents, setHoverEvents] = useState(false);
  const [hoverOrder, setHoverOrder] = useState(false);
  const [hoverBlog, setHoverBlog] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation(); 

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeSticky = window.scrollY > 440;
      setIsSticky(shouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navBarStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#525252',
    padding: '26px 0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
    borderWidth: '7.5px',
    borderColor: 'lightgray',
    borderRadius: '4.1px',
    height: '79px',
    width: '100%',
    marginLeft: '1px',
    zIndex: 1001,
    boxSizing: 'border-box',
    border: 'solid #f2f2f2',
    textAlign: 'center',
    position: isSticky ? 'sticky' : 'relative',
    top: isSticky ? 0 : '508px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    fontSize: '21px',
    padding: '15px 30px', 
    borderRadius: '10px',
    transition: 'background-color 0.3s ease, transform 0.5s ease',
    fontFamily: '"Open Sans", sans-serif',
  };

  const activeLinkStyle = {
    backgroundColor: '#a9a9a9',
  };

  const linkHoverStyle = {
    transform: 'scale(1.05)', 
  };

  const getLinkStyle = (path) => ({
    ...linkStyle,
    ...(location.pathname === path ? activeLinkStyle : null),
    ...(location.pathname === path && isSticky ? linkHoverStyle : null),
  });

  return (
    <div style={navBarStyle}>
      <Link 
        to="/events"
        style={getLinkStyle("/events")}
        onMouseEnter={() => setHoverEvents(true)}
        onMouseLeave={() => setHoverEvents(false)}
      >
        Events
      </Link>
      <Link 
        to="/your-order"
        style={getLinkStyle("/your-order")}
        onMouseEnter={() => setHoverOrder(true)}
        onMouseLeave={() => setHoverOrder(false)}
      >
        Your Order
      </Link>
      <Link 
        to="/blog"
        style={getLinkStyle("/blog")}
        onMouseEnter={() => setHoverBlog(true)}
        onMouseLeave={() => setHoverBlog(false)}
      >
        Blog
      </Link>
    </div>
  );
};

export default NavBar;
