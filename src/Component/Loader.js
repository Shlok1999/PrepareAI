import React from 'react';
import '../Style/Loader.css'; // Add the styles for the loader

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-card">
        <div className="loader-media"></div>
        <div className="loader-caption"></div>
        <div className="loader-hashtags"></div>
      </div>
    </div>
  );
};

export default Loader;
