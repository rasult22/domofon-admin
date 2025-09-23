import React from 'react';
import Layout from '../components/Layout';
import ResidentsView from '../components/ResidentsView';

const ResidentsScreen: React.FC = () => {
  return (
    <Layout>
      <ResidentsView />
    </Layout>
  );
};

export default ResidentsScreen;