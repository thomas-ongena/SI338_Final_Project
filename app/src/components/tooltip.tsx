import React from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

interface ToolTipProps {
  tooltipText: string;
  icon?: React.ReactNode;
}

export const InfoToolTip: React.FC<ToolTipProps> = ({ tooltipText, icon = <InfoCircleOutlined /> }) => {
  return (
    <Tooltip title={tooltipText}>
      <span style={{ cursor: 'pointer' }}>{icon}</span>
    </Tooltip>
  );
};
