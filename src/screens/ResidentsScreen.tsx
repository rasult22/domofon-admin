import React from 'react';
import Layout from '../components/Layout';
import ResidentsManagement from '../components/ResidentsManagement';

const ResidentsScreen: React.FC = () => {
  return (
    <Layout>
      <ResidentsManagement />
    </Layout>
  );
};

export default ResidentsScreen;