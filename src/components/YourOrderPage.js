import React from 'react';

const YourOrderPage = () => {
  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '72.5%',
  };

  return (
    <div>
      <img src="/Home12.png" alt="Home" style={imageStyle} />
      <div>This is the Order Confirmation Page</div>
    </div>
  );
};

export default YourOrderPage;
