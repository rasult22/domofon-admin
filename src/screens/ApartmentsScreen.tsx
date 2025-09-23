import React from 'react';
import Layout from '../components/Layout';
import ApartmentManagement from '../components/ApartmentManagement';

const ApartmentsScreen: React.FC = () => {
  return (
    <Layout>
      <ApartmentManagement />
    </Layout>
  );
};

export default ApartmentsScreen;