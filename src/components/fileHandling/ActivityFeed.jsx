import React, { useState, useEffect } from 'react';
import axios from 'axios';

const { REACT_APP_BACKEND_URL } = process.env;


const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/documents/activities`);
        setActivities(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div>
      <h2>Activity Feed</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {activities.map(activity => (
            <div key={activity._id}>
              {/* Render activity based on its type (document or comment) */}
              {activity.filename ? (
                <div>
                  <p>Document: {activity.title}</p>
                  {/* Render other document-related information */}
                </div>
              ) : (
                <div>
                  <p>Comment: {activity.text}</p>
                  {/* Render other comment-related information */}
                </div>
              )}
              <p>Created At: {new Date(activity.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
