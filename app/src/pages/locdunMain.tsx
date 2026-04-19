import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { listLocDuns } from '../store/locDunViewSlice';
import LoadingSpinner from '../components/loadingSpinner';
import { Link, useNavigate } from 'react-router-dom';

const LocDun: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const locDunView = useSelector((state: RootState) => state.locDunView);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listLocDuns());
  }, [dispatch]);

  useEffect(() => {
    if (locDunView.availableLocDuns?.length === 1) {
      // Redirect to the single available tool
      navigate(`/viewTools/${locDunView.availableLocDuns[0]}`);
    }
  }, [locDunView.availableLocDuns, navigate]);

  const displayLocDunList = () => (
    <>
      {locDunView.availableLocDuns?.map((id) => (
        <div key={`locDun:id`}>
          <span>
            Views for Location Duns: <Link to={`/viewTools/${id}`}>{id}</Link>
          </span>
        </div>
      ))}
    </>
  );

  const displayView = () => {
    if (locDunView.isLoading) {
      return <LoadingSpinner />;
    } else if (locDunView.availableLocDuns?.length === 0) {
      return <p>You currently do not have access to any views. Please reach out to TMG for access</p>;
    } else if (locDunView.availableLocDuns) {
      return displayLocDunList();
    } else {
      return <p>Failed to load tools. Please try again later.</p>;
    }
  };

  return (
    <div>
      <h2>All the Loc Duns</h2>
      {displayView()}
    </div>
  );
};

export default LocDun;
