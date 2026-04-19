import React from 'react';
import LocDunMappings from '../components/locDunMappingsTable';
import { Col, Row } from 'antd';
import './styles/admin.scss';
import UserPermissions from '../components/userPermissionsTable';

const Admin: React.FC = () => {
  return (
    <div>
      <Row justify="center" align="middle">
        <Col span={24}>
          <h2>Admin Page</h2>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col span={24}>
          <p>Welcome to the Admin Page</p>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col span={24}>
          <LocDunMappings />
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col span={24}>
          <UserPermissions />
        </Col>
      </Row>
    </div>
  );
};

export default Admin;
