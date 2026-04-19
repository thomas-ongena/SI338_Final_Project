import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getLocDunById } from '../store/locDunViewSlice';
import { AppDispatch, RootState } from '../store/store';
import { LocDunMapping } from '../types/locDun';
import LoadingSpinner from '../components/loadingSpinner';
import './styles/locDunView.scss';

const LocDunView: React.FC = () => {
  const { locDun } = useParams<{ locDun: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const locDunView = useSelector((state: RootState) => state.locDunView);

  useEffect(() => {
    if (locDun) {
      dispatch(getLocDunById(locDun));
    }
  }, [locDun, dispatch]);

  const toolView = (data: LocDunMapping) => (
    <div className="tool-view-container">
      {data.entries && data.entries.length > 0 ? (
        data.entries.map((entry, index) => (
          <div key={index} className="tool-entry">
            <h3>{entry.name}</h3>
            <iframe src={entry.content} title={entry.name} />
          </div>
        ))
      ) : (
        <p>No tools configured</p>
      )}
    </div>
  );

  return (
    <div>
      <h2>Viewing tools for Loc Dun: {locDun}</h2>
      {locDunView.availableLocDuns && locDunView.availableLocDuns.length > 1 && <Link to="/viewTools"> Back to all tools</Link>}
      {locDunView.isLoading ? (
        <LoadingSpinner />
      ) : locDunView.isFailed ? (
        <p>Failed to load tools. Please try again later.</p>
      ) : (
        !!locDunView.locDunContent && toolView(locDunView.locDunContent)
      )}
    </div>
  );
};

export default LocDunView;
