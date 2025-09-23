import React from 'react';
import Layout from '../components/Layout';
import ApartmentsView from '../components/ApartmentsView';

const ApartmentsScreen: React.FC = () => {
  return (
    <Layout>
      <ApartmentsView />
    </Layout>
  );
};

export default ApartmentsScreen;