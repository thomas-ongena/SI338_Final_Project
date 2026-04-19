import React from 'react';
import './styles/loadingSpinner.scss';

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

export default LoadingSpinner;
