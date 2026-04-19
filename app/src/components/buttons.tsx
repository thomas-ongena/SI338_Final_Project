import { Button, Tooltip } from 'antd';
import React from 'react';
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  tooltipText?: string; // Tooltip text to display on hover
}

const buttonStylingBase = {
  margin: '2px',
  padding: '5px 10px',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const lightenColor = (color: string, factor = 0.8): string => {
  const matches = color.replace(/^#/, '').match(/.{2}/g);
  if (!matches) {
    throw new Error('Invalid color format. Expected a hex color string.');
  }

  const [r, g, b] = matches.map((hex) => Math.min(255, Math.floor(parseInt(hex, 16) + (255 - parseInt(hex, 16)) * (1 - factor))));

  return `rgb(${r}, ${g}, ${b})`;
};

const getButtonStyle = (defaultColor: string, disabled?: boolean) => ({
  ...buttonStylingBase,
  backgroundColor: disabled ? lightenColor(defaultColor) : defaultColor,
  cursor: disabled ? 'not-allowed' : 'pointer',
});

export const SaveButton: React.FC<ButtonProps> = ({ onClick, disabled, tooltipText = 'Save' }) => (
  <Tooltip title={disabled ? 'Disabled' : tooltipText}>
    <Button
      onClick={onClick}
      disabled={disabled}
      style={getButtonStyle('#28a745', disabled)} // Green for Save
      icon={<SaveOutlined />}
    />
  </Tooltip>
);

export const AddButton: React.FC<ButtonProps> = ({ onClick, disabled, tooltipText = 'Add' }) => (
  <Tooltip title={disabled ? 'Disabled' : tooltipText}>
    <Button
      onClick={onClick}
      disabled={disabled}
      style={getButtonStyle('#87CEFA', disabled)} // Light Blue for Add
      icon={<PlusOutlined />}
    />
  </Tooltip>
);

export const EditButton: React.FC<ButtonProps> = ({ onClick, disabled, tooltipText = 'Edit' }) => (
  <Tooltip title={disabled ? 'Disabled' : tooltipText}>
    <Button
      onClick={onClick}
      disabled={disabled}
      style={getButtonStyle('#007bff', disabled)} // Blue for Edit
      icon={<EditOutlined />}
    />
  </Tooltip>
);

export const DiscardButton: React.FC<ButtonProps> = ({ onClick, disabled, tooltipText = 'Discard' }) => (
  <Tooltip title={disabled ? 'Disabled' : tooltipText}>
    <Button
      onClick={onClick}
      disabled={disabled}
      style={getButtonStyle('#FFA500', disabled)} // Orange for Discard
      icon={<CloseOutlined />}
    />
  </Tooltip>
);

export const DeleteButton: React.FC<ButtonProps> = ({ onClick, disabled, tooltipText = 'Delete' }) => (
  <Tooltip title={disabled ? 'Disabled' : tooltipText}>
    <Button
      onClick={onClick}
      disabled={disabled}
      style={getButtonStyle('#FF0000', disabled)} // Red for Delete
      icon={<DeleteOutlined />}
    />
  </Tooltip>
);
