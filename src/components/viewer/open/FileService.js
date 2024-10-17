// services/fileService.js
import axios from 'axios';
import { toast } from 'react-hot-toast';

const { REACT_APP_BACKEND_URL } = process.env;

export const fetchFiles = async () => {
  try {
    const response = await axios.get(`${REACT_APP_BACKEND_URL}/documents/public`);
    console.log('Fetched files;', response.data)
    const fetchedFiles = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const uniqueCategories = Array.from(new Set(fetchedFiles.flatMap((file) => file.categories)));
    console.log('categories;', uniqueCategories)
    return { fetchedFiles, uniqueCategories };
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

export const handleDownload = async (fileUrl, filename) => {
  let retries = 3;
  let delay = 1000; // Start with 1 second delay

  const recordDownload = async () => {
    await axios.post(`${REACT_APP_BACKEND_URL}/documents/${filename}/download`);
  };

  const downloadFile = async () => {
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
    });

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  while (retries > 0) {
    try {
      await recordDownload();
      await downloadFile();
      return; // Success, exit the function
    } catch (error) {
      console.error('Error downloading file:', error);
      if (error.response && error.response.status === 429) {
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          toast.error('Too many requests. Please try again later.');
        }
      } else {
        toast.error('An error occurred while downloading the file.');
        return; // Exit on non-429 errors
      }
    }
  }
};