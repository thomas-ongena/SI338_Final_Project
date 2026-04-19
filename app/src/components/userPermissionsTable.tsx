import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { UserPermission } from '../types/permission';
import { AdminState, deleteUser, listAllUserPermissions, putUserPermission } from '../store/permissionSlice';
import { Col, Row } from 'antd';
import LoadingSpinner from './loadingSpinner';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { AddButton, DeleteButton, DiscardButton, EditButton, SaveButton } from './buttons';
import { InfoToolTip } from './tooltip';

function isEmptyOrBlank(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

interface LocDunsForUserEntryProps {
  data: UserPermission;
  onUpdate: (updatedLocDuns: string[]) => Promise<boolean>;
  onEditStart: () => void;
  onEditEnd: () => void;
  onDeleteUser: () => void;
  isEditingDisabled: boolean;
  isLoading: boolean;
}

const LocDunsForUserEntry: React.FC<LocDunsForUserEntryProps> = ({
  data,
  onUpdate,
  onEditStart,
  onEditEnd,
  onDeleteUser,
  isEditingDisabled,
  isLoading,
}) => {
  const [editableLocDuns, setEditableLocDuns] = useState(data.locDuns?.join(', ') || '');
  const [isEditing, setIsEditing] = useState(false);
  const [originalLocDuns, setOriginalLocDuns] = useState(editableLocDuns);

  const handleEdit = () => {
    setOriginalLocDuns(editableLocDuns);
    onEditStart();
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedLocDunsArray = editableLocDuns.split(',').map((item) => item.trim());
    onUpdate(updatedLocDunsArray).then((success) => success && setIsEditing(false));
  };

  const handleDiscard = () => {
    setEditableLocDuns(originalLocDuns);
    onEditEnd();
    setIsEditing(false);
  };

  const handleDeleteUser = () => {
    onEditEnd();
    setIsEditing(false);
    onDeleteUser();
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
      }}
    >
      {!isEditing ? (
        <>
          <div
            style={{
              flex: 1,
              padding: '5px',
              border: '1px solid #ccc',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
            }}
          >
            {editableLocDuns}
          </div>
          {!isEditingDisabled && <EditButton onClick={handleEdit} />}
          {isLoading && <LoadingSpinner />}
        </>
      ) : (
        <>
          <input
            type="text"
            value={editableLocDuns}
            onChange={(e) => setEditableLocDuns(e.target.value)}
            style={{
              flex: 1,
              padding: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <SaveButton onClick={handleSave} />
          <DiscardButton onClick={handleDiscard} />
          <DeleteButton onClick={handleDeleteUser} />
        </>
      )}
    </div>
  );
};

const UserPermissionsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const permissionState: AdminState = useSelector((state: RootState) => state.permission);
  const availableLocDuns: Set<string> = new Set(
    useSelector((state: RootState) => state.locDunDisplayContent.locDunContent).map((locDun) => locDun.id),
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [editingId, setEditingId] = useState<string>();

  useEffect(() => {
    dispatch(listAllUserPermissions());
  }, []);

  const onEditStart = (id: string) => setEditingId(id);
  const onEditEnd = (id: string) => {
    if (id === editingId) {
      setEditingId(undefined);
    }
  };
  const onDeleteUser = (id: string) => dispatch(deleteUser(id));

  const renderEntries = (data: UserPermission[]) => {
    return data.map((userPermissionEntry: UserPermission) => {
      const updateUserPermissions = async (updatedLocDuns: string[]): Promise<boolean> => {
        const filteredLocDuns = [...new Set(updatedLocDuns.filter((l) => !isEmptyOrBlank(l)))];
        const allValidLocDuns = filteredLocDuns.every((locDun) => {
          if (availableLocDuns.has(locDun)) {
            return true;
          } else {
            setErrorMessage(`${locDun} is not created. Please create it first`);
            return false;
          }
        });
        if (allValidLocDuns) {
          await dispatch(putUserPermission({ id: userPermissionEntry.id, locDuns: filteredLocDuns }));
          setErrorMessage('');
          onEditEnd(userPermissionEntry.id);
          return true;
        } else {
          return false;
        }
      };
      if (!isEmptyOrBlank(userPermissionEntry.id)) {
        return (
          <>
            <tr>
              <td
                style={{
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    wordBreak: 'break-word',
                  }}
                >
                  {userPermissionEntry.id}
                </div>
              </td>
              <td>
                <LocDunsForUserEntry
                  data={userPermissionEntry}
                  onUpdate={updateUserPermissions}
                  onEditStart={onEditStart.bind(this, userPermissionEntry.id)}
                  onEditEnd={onEditEnd.bind(this, userPermissionEntry.id)}
                  onDeleteUser={onDeleteUser.bind(this, userPermissionEntry.id)}
                  isEditingDisabled={!!editingId || editingId === userPermissionEntry.id}
                  isLoading={editingId === userPermissionEntry.id && permissionState.writing}
                />
              </td>
            </tr>
          </>
        );
      }
    });
  };

  const [newUser, setNewUser] = useState('');

  const handleNewUserAdd = () => {
    dispatch(putUserPermission({ id: newUser, locDuns: [] }));
    setNewUser('');
  };

  const userIsAlreadyInTable = () => {
    return permissionState.userPermissions.some((userPerm) => userPerm.id === newUser);
  };

  if (permissionState.isFailed) {
    return <div>Permission Table failed to load, please try again</div>;
  } else if (permissionState.isLoading) {
    return <LoadingSpinner />;
  } else if (permissionState.writingFailed) {
    return <div>Your last write failed to save. Please refresh the page.</div>;
  } else {
    return (
      <>
        <Row justify="center">
          {!!errorMessage && (
            <div
              style={{
                display: 'flex',
                alignSelf: 'center',
                backgroundColor: '#f8d7da',
                gap: '5px',
                color: '#721c24',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                border: '1px solid #f5c6cb',
              }}
            >
              <ExclamationCircleOutlined />
              {errorMessage}
            </div>
          )}
          <Col span={24}>
            {permissionState.userPermissions.length > 0 && (
              <>
                <table border={1}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>LOC DUN Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderEntries(permissionState.userPermissions)}
                    <tr>
                      <div style={{ paddingTop: '5px' }}>
                        <input type="text" value={newUser} onChange={(e) => setNewUser(e.target.value)} />{' '}
                        <InfoToolTip tooltipText="You can add a user here. If you add a user, make sure the value entered matches their email address. OR ask them to login first and they will be automatically added." />
                        <AddButton disabled={isEmptyOrBlank(newUser) || userIsAlreadyInTable()} onClick={handleNewUserAdd} />
                        {userIsAlreadyInTable() && <>This user already exists in the table</>}
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

// TODO We also should look to see if we should add a display name to the loc dun and keep the locdun as a "uniqueId"

const UserPermissions: React.FC = () => {
  return (
    <>
      <UserPermissionsTable />
    </>
  );
};

export default UserPermissions;
