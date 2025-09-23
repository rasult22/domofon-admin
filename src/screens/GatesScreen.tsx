import React from 'react';
import Layout from '../components/Layout';
import GateManagement from '../components/GateManagement';

const GatesScreen: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <GateManagement />
      </div>
    </Layout>
  );
};

export default GatesScreen;