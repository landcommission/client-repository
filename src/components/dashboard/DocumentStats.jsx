import React from 'react';

const DocumentStats = ({ stats }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Document Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-sm text-blue-600">Total Documents</p>
          <p className="text-2xl font-bold text-blue-800">{stats.totalDocuments || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-green-600">Total Size</p>
          <p className="text-2xl font-bold text-green-800">{((stats.totalSize || 0) / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">Categories</p>
          <p className="text-2xl font-bold text-yellow-800">{stats.categoryCounts.length}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <p className="text-sm text-purple-600">Families</p>
          <p className="text-2xl font-bold text-purple-800">{stats.familyCounts.length}</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentStats;