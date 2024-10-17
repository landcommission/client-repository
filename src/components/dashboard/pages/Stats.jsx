import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from "../../context/AuthContext";

const Stats = () => {
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    categoryCounts: {},
    familyCounts: {},
    visibilityCounts: {},
    topAuthors: [],
    downloadStats: { topDownloaded: [], averageDownloads: 0 }
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/documents/allfiles`,
        {
          headers: {
            "x-auth-token": authState.token,
          },
        }
      );
      processStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching file stats:", error);
      setError("Failed to fetch file statistics. Please try again.");
      setLoading(false);
    }
  };

  const processStats = (files) => {
    const categoryCounts = {};
    const familyCounts = {};
    const visibilityCounts = {};
    const authorCounts = {};
    let totalSize = 0;
    let totalDownloads = 0;

    files.forEach(file => {
      // Process categories
      let categories = [];
      if (Array.isArray(file.categories) && file.categories.length > 0) {
        try {
          categories = JSON.parse(file.categories[0]);
        } catch (e) {
          console.error("Error parsing categories:", e);
          categories = file.categories; // Use as is if parsing fails
        }
      }

      if (Array.isArray(categories)) {
        categories.forEach(category => {
          if (category) { // Ignore empty categories
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          }
        });
      } else if (categories.length === 0) {
        categoryCounts["Uncategorized"] = (categoryCounts["Uncategorized"] || 0) + 1;
      }

      // Family counts
      if (file.family) {
        familyCounts[file.family] = (familyCounts[file.family] || 0) + 1;
      }

      // Visibility counts
      if (file.visibility) {
        visibilityCounts[file.visibility] = (visibilityCounts[file.visibility] || 0) + 1;
      }

      // Author counts
      if (file.author) {
        authorCounts[file.author] = (authorCounts[file.author] || 0) + 1;
      }

      // Total size
      totalSize += file.fileSize || 0;

      // Download counts
      totalDownloads += file.downloadCount || 0;
    });

    const topAuthors = Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([author, count]) => ({ author, count }));

    const topDownloaded = files
      .filter(file => file.title && file.downloadCount)
      .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      .slice(0, 5)
      .map(file => ({ title: file.title, downloads: file.downloadCount }));

    setStats({
      totalFiles: files.length,
      totalSize: totalSize,
      categoryCounts,
      familyCounts,
      visibilityCounts,
      topAuthors,
      downloadStats: {
        topDownloaded,
        averageDownloads: files.length > 0 ? totalDownloads / files.length : 0
      }
    });
  };

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total Files</h2>
          <p className="text-3xl font-bold">{stats.totalFiles}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total Size</h2>
          <p className="text-3xl font-bold">{(stats.totalSize / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Average Downloads</h2>
          <p className="text-3xl font-bold">{stats.downloadStats.averageDownloads.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Authors</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topAuthors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="author" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Downloaded Files</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.downloadStats.topDownloaded}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="downloads" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul>
            {Object.entries(stats.categoryCounts).map(([category, count]) => (
              <li key={category} className="mb-2">
                <span className="font-semibold">{category}:</span> {count}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Families</h2>
          <ul>
            {Object.entries(stats.familyCounts).map(([family, count]) => (
              <li key={family} className="mb-2">
                <span className="font-semibold">{family}:</span> {count}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Visibility</h2>
          <ul>
            {Object.entries(stats.visibilityCounts).map(([visibility, count]) => (
              <li key={visibility} className="mb-2">
                <span className="font-semibold">{visibility}:</span> {count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Stats;