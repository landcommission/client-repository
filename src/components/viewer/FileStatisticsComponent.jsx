import React, { useState, useEffect } from 'react';
import axios from 'axios';

const { REACT_APP_BACKEND_URL } = process.env;

const FileStatisticsComponent = ({ currentUser }) => {
    const [fileStatistics, setFileStatistics] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${REACT_APP_BACKEND_URL}/documents/allfiles`,
                    {
                        headers: {
                            // Include currentUser information in the request headers
                            _id: currentUser._id,
                            email: currentUser.email
                        }
                    }
                );
                const files = response.data || []; // Assuming response.data is an array of files
                console.log(response.data)

                // Check if files array is empty
                if (files.length === 0) {
                    setFileStatistics(null); // Set fileStatistics to null if no data is found
                    return;
                }

                // Calculate statistics
                const numberOfFiles = files.length;
                const totalFileSize = files.reduce((total, file) => total + file.fileSize, 0);
                const averageFileSize = numberOfFiles > 0 ? totalFileSize / numberOfFiles : 0;


                // Calculate other statistics
                const filesSharedWithOthers = files.filter(file => file.sharedWith.length > 0).length;
                const filesByVisibility = files.reduce((acc, file) => {
                    acc[file.visibility] = (acc[file.visibility] || 0) + 1;
                    return acc;
                }, {});
                const filesByCategory = files.reduce((acc, file) => {
                    file.categories.forEach(category => {
                        const categoryName = category.replace(/[\[\]"]+/g, ''); // Remove array brackets
                        acc[categoryName] = (acc[categoryName] || 0) + 1;
                    });
                    return acc;
                }, {});

                // Most common file types
                const fileTypes = files.reduce((acc, file) => {
                    const fileType = file.filename.split('.').pop().toUpperCase(); // Get file extension
                    acc[fileType] = (acc[fileType] || 0) + 1;
                    return acc;
                }, {});
                const mostCommonFileTypes = Object.entries(fileTypes)
                    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                    .slice(0, 5) // Display top 5 most common file types
                    .reduce((obj, [key, value]) => {
                        obj[key] = value;
                        return obj;
                    }, {});

                // Oldest and newest files
                const sortedFilesByDate = files
                    .filter(file => file.publicationDate && file.publicationDate.$date) // Filter out files with missing or invalid publication dates
                    .sort((a, b) => new Date(a.publicationDate.$date) - new Date(b.publicationDate.$date));

                const oldestFile = sortedFilesByDate[0] || null; // Use null if no oldest file is found
                const newestFile = sortedFilesByDate[sortedFilesByDate.length - 1] || null; // Use null if no newest file is found

                // Total download count
                const totalDownloadCount = files.reduce((total, file) => total + file.downloadCount, 0);

                // Files by author
                const filesByAuthor = files.reduce((acc, file) => {
                    acc[file.author] = (acc[file.author] || 0) + 1;
                    return acc;
                }, {});

                // Files by publisher
                const filesByPublisher = files.reduce((acc, file) => {
                    acc[file.publisher] = (acc[file.publisher] || 0) + 1;
                    return acc;
                }, {});

                // Files by family
                const filesByFamily = files.reduce((acc, file) => {
                    acc[file.family] = (acc[file.family] || 0) + 1;
                    return acc;
                }, {});

                // Set the calculated statistics in the state
                setFileStatistics({
                    numberOfFiles,
                    totalFileSize,
                    averageFileSize,
                    filesSharedWithOthers,
                    filesByVisibility,
                    filesByCategory,
                    mostCommonFileTypes,
                    oldestFile,
                    newestFile,
                    totalDownloadCount,
                    filesByAuthor,
                    filesByPublisher,
                    filesByFamily
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures useEffect runs only once on component mount

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">File Statistics</h2>
            {fileStatistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Total number of files, Total file size, Average file size */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Overview</h3>
                            <p className="text-base mb-2 text-gray-700">Total number of files: {fileStatistics.numberOfFiles}</p>
                            <p className="text-base mb-2 text-gray-700">Total file size: {(fileStatistics.totalFileSize / (1024 * 1024)).toFixed(2)} MB</p>
                            <p className="text-base mb-2 text-gray-700">Average file size: {(fileStatistics.averageFileSize / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    </div>

                    {/* Card 2: Number of files shared with others, Files by visibility, Files by category */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Sharing & Categorization</h3>
                            <p className="text-base mb-2 text-gray-700">Number of files shared with others: {fileStatistics.filesSharedWithOthers}</p>
                            <div className="mb-2">
                                <p className="text-base font-semibold mb-1 text-gray-800">Files by visibility:</p>
                                <ul className="list-disc pl-6">
                                    {Object.entries(fileStatistics.filesByVisibility).map(([visibility, count]) => (
                                        <li key={visibility} className="text-base text-gray-700">{visibility}: {count}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mb-2">
                                <p className="text-base font-semibold mb-1 text-gray-800">Files by category:</p>
                                <ul className="list-disc pl-6">
                                    {Object.entries(fileStatistics.filesByCategory).map(([category, count]) => (
                                        <li key={category} className="text-base text-gray-700">{category}: {count}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Most common file types, Oldest file, Newest file */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">File Details</h3>
                            <div className="mb-2">
                                <p className="text-base font-semibold mb-1 text-gray-800">Most common file types:</p>
                                <ul className="list-disc pl-6">
                                    {Object.entries(fileStatistics.mostCommonFileTypes).map(([fileType, count]) => (
                                        <li key={fileType} className="text-base text-gray-700">{fileType}: {count}</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-base mb-2 text-gray-700">Oldest file: {fileStatistics.oldestFile ? `${fileStatistics.oldestFile.title} (${fileStatistics.oldestFile.publicationDate ? new Date(fileStatistics.oldestFile.publicationDate.$date).toLocaleDateString() : 'Unknown Date'})` : 'No files found'}</p>
                            <p className="text-base mb-2 text-gray-700">Newest file: {fileStatistics.newestFile ? `${fileStatistics.newestFile.title} (${fileStatistics.newestFile.publicationDate ? new Date(fileStatistics.newestFile.publicationDate.$date).toLocaleDateString() : 'Unknown Date'})` : 'No files found'}</p>

                        </div>
                    </div>

                    {/* Card 4: Total download count */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Download Count</h3>
                            <p className="text-base mb-2 text-gray-700">Total download count: {fileStatistics.totalDownloadCount}</p>
                        </div>
                    </div>

                    {/* Card 5: Files by author */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Files by Author</h3>
                            <ul className="list-disc pl-6">
                                {Object.entries(fileStatistics.filesByAuthor).map(([author, count]) => (
                                    <li key={author} className="text-base text-gray-700">{author}: {count}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Card 6: Files by publisher */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Files by Publisher</h3>
                            <ul className="list-disc pl-6">
                                {Object.entries(fileStatistics.filesByPublisher).map(([publisher, count]) => (
                                    <li key={publisher} className="text-base text-gray-700">{publisher}: {count}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Card 7: Files by family */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Files by Family</h3>
                            <ul className="list-disc pl-6">
                                {Object.entries(fileStatistics.filesByFamily).map(([family, count]) => (
                                    <li key={family} className="text-base text-gray-700">{family}: {count}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default FileStatisticsComponent;
