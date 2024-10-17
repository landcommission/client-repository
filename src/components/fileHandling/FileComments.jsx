import React, { useState, useEffect } from "react";
import axios from "axios";

const { REACT_APP_BACKEND_URL } = process.env;

const FileComments = ({ currentUser, filename }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyIndex, setReplyIndex] = useState({
    commentIndex: -1,
    replyIndex: -1,
  });
  const [replyText, setReplyText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false); // Flag to show all comments
  const [showAllReplies, setShowAllReplies] = useState(false); // Flag to show all replies

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (filename) {
          const response = await axios.get(
            `${REACT_APP_BACKEND_URL}/documents/${filename}/comments`,
            {
              // Include current user's email and ID in the headers
              headers: {
                _id: currentUser._id,
                email: currentUser.email,
              }
            }
          );
          setComments(response.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [filename]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      if (
        !currentUser ||
        !currentUser.email ||
        !currentUser.lastname ||
        !filename
      ) {
        console.error("Current user information or filename is missing.");
        return;
      }

      const { email, lastname } = currentUser;

      // Send a POST request to create a new comment
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/documents/${filename}/comments`,
        { text: newComment, authorEmail: email, authorLastName: lastname },
        {
          // Include current user's email and ID in the headers
          headers: {
            _id: currentUser._id,
            email: currentUser.email,
          }
        }
      );

      // Update the comments state to include the newly created comment
      setComments((prevComments) => [...prevComments, response.data]);

      // Clear the newComment state
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleReplySubmit = async (commentId, parentIndex) => {
    try {
      // Check if reply text is empty
      if (!replyText.trim()) {
        console.error("Reply text is empty.");
        return;
      }

      if (
        !currentUser ||
        !currentUser.email ||
        !currentUser.lastname ||
        !filename
      ) {
        console.error("Current user information or filename is missing.");
        return;
      }

      const { email, lastname } = currentUser;

      // Send a POST request to create a new reply
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/documents/${filename}/comments/${commentId}/replies`,
        {
          text: replyText,
          authorEmail: email, // Include author email
          authorLastName: lastname, // Include author lastname
        },
        {
          // Include current user's email and ID in the headers
          headers: {
            _id: currentUser._id,
            email: currentUser.email,
          }
        }
      );

      // Update the comments state to include the newly created reply
      setComments((prevComments) => {
        return prevComments.map((comment, index) => {
          if (index === parentIndex.commentIndex) {
            return {
              ...comment,
              replies: comment.replies
                ? [...comment.replies, response.data]
                : [response.data],
            };
          } else if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map((reply, replyIndex) => {
                if (replyIndex === parentIndex.replyIndex) {
                  return {
                    ...reply,
                    replies: reply.replies
                      ? [...reply.replies, response.data]
                      : [response.data],
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        });
      });

      // Clear the replyText state and reset the replyIndex state
      setReplyText("");
      setReplyIndex({ commentIndex: -1, replyIndex: -1 });
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  // Toggle show all comments flag
  const toggleShowAllComments = () => {
    setShowAllComments((prevShowAllComments) => !prevShowAllComments);
  };

  // Toggle show all replies flag
  const toggleShowAllReplies = () => {
    setShowAllReplies((prevShowAllReplies) => !prevShowAllReplies);
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased max-w-2xl mx-auto px-4">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
            Discussion ({comments.length})
          </h2>
        </div>
        <form className="mb-6" onSubmit={handleCommentSubmit}>
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <textarea
              id="comment"
              rows="6"
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Post comment
          </button>
        </form>
        {/* Display limited number of comments */}
        {comments
          .slice(0, showAllComments ? comments.length : 2)
          .map((comment, commentIndex) => (
            <article
              key={commentIndex}
              className="p-6 text-base bg-white rounded-lg dark:bg-gray-900"
            >
              {/* Comment content */}
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                    <img
                      className="mr-2 w-6 h-6 rounded-full"
                      src="/images/user.svg"
                      alt={comment.author.lastname}
                    />
                    {comment.author.lastname}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(comment.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </span>
                  </p>
                </div>
              </footer>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {comment.text}
              </p>
              {/* Render the reply button */}
              <button
                type="button"
                className="mt-2 inline-flex items-center py-1 px-3 text-xs font-medium text-gray-500 hover:underline dark:text-gray-400"
                onClick={() => setReplyIndex({ commentIndex, replyIndex: -1 })} // Set the replyIndex when Reply button is clicked
              >
                <svg
                  className="mr-1.5 w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                  />
                </svg>
                Reply
              </button>
              {/* Render the reply input field if the current comment is the one being replied to */}
              {replyIndex.commentIndex === commentIndex && (
                <div className="mt-2">
                  <textarea
                    rows="4"
                    className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Reply to this comment..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  ></textarea>
                  <button
                    className="mt-2 inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    onClick={() =>
                      handleReplySubmit(comment._id, {
                        commentIndex,
                        replyIndex: -1,
                      })
                    }
                  >
                    Post reply
                  </button>
                </div>
              )}
              {/* Render replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8">
                  {/* Display limited number of replies */}
                  {comment.replies
                    .slice(0, showAllReplies ? comment.replies.length : 2)
                    .map((reply, replyIndex) => (
                        <div key={replyIndex} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mb-2">
                        <div className="flex items-center mb-1">
                          <img
                            className="mr-2 w-6 h-6 rounded-full"
                            src="/images/user.svg"
                          />
                          <p className="text-xs text-gray-800 font-semibold dark:text-gray-400">
                            {reply.authorLastName} on{" "}
                            <span className="text-red-500 font-normal italic">
                              {new Date(reply.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              at{" "}
                              {new Date(reply.createdAt).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </span>
                          </p>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {reply.text}
                        </p>
                      </div>
                      
                    ))}
                  {/* Render 'Load More' button for replies */}
                  {comment.replies.length > 2 && (
                    <div className="mt-2">
                      {showAllReplies ? (
                        <button
                          className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                          onClick={toggleShowAllReplies}
                        >
                          Collapse Replies
                        </button>
                      ) : (
                        <button
                          className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                          onClick={toggleShowAllReplies}
                        >
                          Load More Replies
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        {/* Render 'Load More' button for comments */}
        {comments.length > 2 && (
          <div className="mt-4">
            {showAllComments ? (
              <button
                className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                onClick={toggleShowAllComments}
              >
                Collapse Comments
              </button>
            ) : (
              <button
                className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                onClick={toggleShowAllComments}
              >
                Load More Comments
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FileComments;
