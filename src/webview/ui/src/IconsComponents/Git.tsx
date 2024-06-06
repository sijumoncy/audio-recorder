import React from 'react';

interface IGitProps {
  classes: string;
}

const Git: React.FC<IGitProps> = ({ classes }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      id="git"
      className={classes}
      fill="none"
    >
      <path
        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        className="fill-none stroke-current"
        d="M4.21,22.12a2.87,2.87,0,0,0,0,3.77L22.12,43.8a2.87,2.87,0,0,0,3.77,0l17.9-17.91a2.85,2.85,0,0,0,0-3.77L25.89,4.21A2.68,2.68,0,0,0,24,3.51h0a2.66,2.66,0,0,0-1.88.71Z"
      />
      <line
        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        className="fill-none stroke-current"
        x1="26.33"
        y1="17.85"
        x2="30.15"
        y2="21.67"
      />
      <line
        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        className="fill-none stroke-current"
        x1="17.4"
        y1="8.92"
        x2="21.67"
        y2="13.19"
      />
      <circle
        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        className="fill-none stroke-current"
        cx="24"
        cy="32.41"
        r="3.3"
      />
      <circle
        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        className="fill-none stroke-current"
        cx="24"
        cy="15.52"
        r="3.3"
      />
      <circle
        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        className="fill-none stroke-current"
        cx="32.48"
        cy="24"
        r="3.3"
      />
      <line
        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        className="fill-none stroke-current"
        x1="24"
        y1="29.11"
        x2="24"
        y2="18.82"
      />
    </svg>
  );
};

export default Git;
