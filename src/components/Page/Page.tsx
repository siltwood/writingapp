import React from 'react';
import './Page.css';

interface PageProps {
  children: React.ReactNode;
  className?: string;
  padding?: string; // Allow custom padding from parent
}

const Page: React.FC<PageProps> = ({ children, className = '', padding }) => {
  const containerStyle = padding ? { padding } : {};
  
  return (
    <div className={`page-wrapper ${className}`} style={containerStyle}>
      <div className="page-container">
        <img src="/assets/borders/topleft.png" className="page-corner tl" alt="" />
        <img src="/assets/borders/topright.png" className="page-corner tr" alt="" />
        <img src="/assets/borders/bottomleft.png" className="page-corner bl" alt="" />
        <img src="/assets/borders/bottomright.png" className="page-corner br" alt="" />
        
        <div className="page-edge top" style={{backgroundImage: 'url(/assets/borders/top.png)'}} />
        <div className="page-edge bottom" style={{backgroundImage: 'url(/assets/borders/bottom.png)'}} />
        <div className="page-edge left" style={{backgroundImage: 'url(/assets/borders/left.png)'}} />
        <div className="page-edge right" style={{backgroundImage: 'url(/assets/borders/right.png)'}} />
        
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Page;