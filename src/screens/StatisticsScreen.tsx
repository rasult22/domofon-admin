import React from 'react';
import Layout from '../components/Layout';

const StatisticsScreen: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-600">
            View detailed analytics and reports
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Statistics & Analytics
          </h3>
          <p className="text-gray-500">
            This feature will be implemented next. You'll be able to view detailed statistics, usage reports, and analytics.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default StatisticsScreen;