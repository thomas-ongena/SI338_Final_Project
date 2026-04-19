import React, { useEffect, useState } from 'react';
import { deleteLocDunById, listLocDunContent, LocDunDisplayContentState, putLocDunById } from '../store/locDunDisplayContentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { Col, Row } from 'antd';
import { LocDunContentEntry, LocDunMapping } from '../types/locDun';
import { Link } from 'react-router-dom';
import './styles/locDunMappingsTable.scss';
import LoadingSpinner from './loadingSpinner';
import { AddButton, DeleteButton, DiscardButton, EditButton, SaveButton } from './buttons';

interface LocDunEntryProps {
  data: LocDunMapping;
}

function isEmptyOrBlank(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

const LocDunEntry: React.FC<LocDunEntryProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState(false);
  const [initialLocDunMapping, setInitialLocDunMapping] = useState(data);
  const [locDunMapping, setLocDunMapping] = useState(data);
  const [numRows, setNumRows] = useState(data.entries?.length || 0);

  const updateName = (newValue: string, index: number) => {
    setLocDunMapping((prevLocDunMapping) => {
      const updatedEntries: LocDunContentEntry[] = [...prevLocDunMapping.entries];
      updatedEntries[index] = { ...updatedEntries[index], name: newValue };
      return { ...prevLocDunMapping, entries: updatedEntries };
    });
  };

  const updateContent = (newValue: string, index: number) => {
    setLocDunMapping((prevLocDunMapping) => {
      const updatedEntries: LocDunContentEntry[] = [...prevLocDunMapping.entries];
      updatedEntries[index] = { ...updatedEntries[index], content: newValue };
      return { ...prevLocDunMapping, entries: updatedEntries };
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setLocDunMapping(initialLocDunMapping);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Filter out completely blank entries
    setLocDunMapping((prevLocDunMapping) => {
      const newEntries = [...prevLocDunMapping.entries].filter((entry) => {
        if (isEmptyOrBlank(entry.name) && isEmptyOrBlank(entry.content)) {
          return false;
        }
        return true;
      });
      const result = {
        ...prevLocDunMapping,
        entries: newEntries,
      };
      dispatch(putLocDunById(result));
      setInitialLocDunMapping(result);
      return result;
    });
    setIsEditing(false);
  };

  const handleAddEntry = () => {
    setNumRows((prevNumRows) => {
      return prevNumRows + 1;
    });
    setLocDunMapping((prevLocDunMapping) => {
      const updatedEntries: LocDunContentEntry[] = [...prevLocDunMapping.entries, { name: '', content: '' } as LocDunContentEntry];
      return { ...prevLocDunMapping, entries: updatedEntries };
    });
  };

  const handleDelete = (index: number) => {
    setLocDunMapping((prevLocDunMapping) => {
      const updatedEntries = [...prevLocDunMapping.entries];
      updatedEntries.splice(index, 1);
      const result = { ...prevLocDunMapping, entries: updatedEntries };
      setNumRows(result.entries.length);
      return result;
    });
  };

  const renderMappingRows = () => {
    if (locDunMapping.entries?.length === 0) {
      return (
        <>
          <tr>
            <td />
            <td />
            {isEditing ? (
              <>
                <td />
                <td>
                  <SaveButton onClick={handleSave} />
                  <AddButton onClick={handleAddEntry} />
                  <DiscardButton onClick={handleCancelEdit} />
                </td>
              </>
            ) : (
              <td>
                <EditButton
                  onClick={() => {
                    handleEdit();
                    handleAddEntry();
                  }}
                />
              </td>
            )}
          </tr>
        </>
      );
    }
    return locDunMapping.entries?.map((entry: LocDunContentEntry, index: number) => {
      return (
        <>
          <tr>
            <td>
              {isEditing ? (
                <>
                  <textarea value={entry.name} onChange={(e) => updateName(e.target.value, index)} />
                </>
              ) : (
                <>{entry.name}</>
              )}
            </td>
            <td>
              {isEditing ? (
                <>
                  <textarea value={entry.content} onChange={(e) => updateContent(e.target.value, index)} />
                </>
              ) : (
                <>{entry.content}</>
              )}
            </td>
            <>
              {isEditing && (
                <td id="button-column">
                  <DeleteButton onClick={() => handleDelete(index)} />
                </td>
              )}
            </>
            <>
              {index === 0 ? (
                <td rowSpan={numRows} id="button-column">
                  {isEditing ? (
                    <>
                      <SaveButton onClick={handleSave} />
                      <AddButton onClick={handleAddEntry} />
                      <DiscardButton onClick={handleCancelEdit} />
                    </>
                  ) : (
                    <EditButton onClick={handleEdit} />
                  )}
                </td>
              ) : null}
            </>
          </tr>
        </>
      );
    });
  };

  return (
    <>
      <table border={1} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Content</th>
            {isEditing && <th id="button-column"></th>}
            <th rowSpan={numRows} id="button-column">
              Action
            </th>
          </tr>
        </thead>
        <tbody>{renderMappingRows()}</tbody>
      </table>
    </>
  );
};

const LocDunMappingsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [newLocDunId, setNewLocDunId] = useState('');
  const locDunDisplayContentState: LocDunDisplayContentState = useSelector((state: RootState) => state.locDunDisplayContent);

  useEffect(() => {
    dispatch(listLocDunContent());
  }, []);

  const handleDeleteLocDun = (id: string) => {
    dispatch(deleteLocDunById(id));
  };

  const renderEntries = (data: LocDunMapping[]) => {
    return data.map((locDunEntry: LocDunMapping) => {
      if (!isEmptyOrBlank(locDunEntry.id)) {
        const hyperlinkPath = `/viewTools/${locDunEntry.id}`;
        return (
          <>
            <tr>
              <td
                style={{
                  display: 'table-cell',
                  verticalAlign: 'middle',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Link to={hyperlinkPath} style={{ textAlign: 'left' }}>
                    {locDunEntry.id}
                  </Link>
                  <DeleteButton onClick={() => handleDeleteLocDun(locDunEntry.id)} />
                </div>
              </td>
              <td>
                <LocDunEntry data={locDunEntry} />
              </td>
            </tr>
          </>
        );
      }
    });
  };

  const newLocDunMatchesExistingEntry = () => {
    return locDunDisplayContentState.locDunContent.some((locDunMapping) => locDunMapping.id === newLocDunId);
  };

  const handleAddLocDun = () => {
    dispatch(putLocDunById({ id: newLocDunId, entries: [] } as LocDunMapping));
    setNewLocDunId('');
  };

  if (locDunDisplayContentState.isFailed) {
    return <div> Loc Dun Table failed to load, please try again</div>;
  } else if (locDunDisplayContentState.isLoading) {
    return <LoadingSpinner />;
  } else {
    return (
      <>
        <Row>
          <Col span={24}>
            {locDunDisplayContentState.locDunContent.length > 0 && (
              <>
                <table border={1}>
                  <thead>
                    <tr>
                      <th>LOC DUN ID</th>
                      <th>Entries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderEntries(locDunDisplayContentState.locDunContent)}
                    <tr>
                      <div style={{ paddingTop: '5px' }}>
                        <input type="text" value={newLocDunId} onChange={(e) => setNewLocDunId(e.target.value)} />
                        <AddButton disabled={isEmptyOrBlank(newLocDunId) || newLocDunMatchesExistingEntry()} onClick={handleAddLocDun} />
                        {newLocDunMatchesExistingEntry() && <>An existing entry with this LOC DUN exists in the table!</>}
                      </div>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </Col>
        </Row>
      </>
    );
  }
};

const LocDunMappings: React.FC = () => {
  return (
    <>
      <LocDunMappingsTable />
    </>
  );
};

export default LocDunMappings;
