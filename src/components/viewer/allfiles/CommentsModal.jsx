import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Trash2, Edit2, AlertCircle, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext'; // Adjust the import path as needed

const { REACT_APP_BACKEND_URL } = process.env;

const Comment = ({ comment, level = 0, onReply, onEdit, onDelete, currentUserId }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const userName = `${comment.user?.firstname || ''} ${comment.user?.lastname || ''}`.trim() || 'Anonymous';
  const userEmail = comment.user?.email || 'No email';
  const userRole = comment.user?.role || 'Unknown role';

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(comment._id, replyContent);
      setIsReplying(false);
      setReplyContent('');
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editedContent.trim()) {
      onEdit(comment._id, editedContent);
      setIsEditing(false);
    }
  };

  const renderReplies = (replies) => {
    if (!replies || replies.length === 0) return null;
    return replies.map((reply) => {
      if (typeof reply === 'string') {
        // This is just an ID, we can't render it directly
        return null;
      }
      return (
        <Comment
          key={reply._id}
          comment={reply}
          level={level + 1}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      );
    });
  };

  return (
    <div className={`bg-gray-100 rounded-lg p-3 mb-2 ${level > 0 ? 'ml-4' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{userName}</p>
          <p className="text-xs text-gray-500">{userEmail} - {userRole}</p>
        </div>
        <p className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </p>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="mt-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border rounded px-2 py-1 resize-y"
            rows="3"
          />
          <div className="flex justify-end mt-1">
            <button type="submit" className="text-blue-500 text-sm mr-2">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 text-sm">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <p className="text-sm text-gray-700 mt-2">{comment.content}</p>
          <div className="flex mt-2">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-blue-500 mr-2"
            >
              <MessageCircle size={16} />
            </button>
            {comment.user && comment.user._id === currentUserId && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500 mr-2"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(comment._id)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </>
      )}
      
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="mt-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full border rounded px-2 py-1 resize-y"
            rows="2"
          />
          <div className="flex justify-end mt-1">
            <button type="submit" className="text-blue-500 text-sm mr-2">Reply</button>
            <button type="button" onClick={() => setIsReplying(false)} className="text-gray-500 text-sm">Cancel</button>
          </div>
        </form>
      )}
      
      {renderReplies(comment.replies)}
    </div>
  );
};

const CommentsModal = ({ isOpen, onClose, documentId }) => {
  const { authState } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!documentId) {
      console.error('documentId is undefined');
      setError('Invalid document ID');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/documents/${documentId}/comments`, {
        headers: { 'x-auth-token': authState.token }
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      if (error.response && error.response.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to load comments. Please try again.');
      }
      toast.error(error.response?.status === 401 ? 'Authentication failed. Please log in again.' : 'Failed to load comments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [documentId, authState.token]);

  useEffect(() => {
    if (isOpen && documentId && authState.isAuthenticated) {
      fetchComments();
    }
  }, [isOpen, documentId, fetchComments, authState.isAuthenticated]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !documentId) return;

    try {
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/documents/${documentId}/comments`,
        { content: newComment },
        { headers: { 'x-auth-token': authState.token } }
      );
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error posting comment:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error('Failed to post comment. Please try again.');
      }
    }
  };

  const handleReply = async (parentId, content) => {
    try {
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/documents/${parentId}/replies`,
        { content },
        { headers: { 'x-auth-token': authState.token } }
      );
      setComments(prevComments => {
        const updateReplies = (comments) => {
          return comments.map(comment => {
            if (comment._id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), response.data]
              };
            } else if (comment.replies) {
              return {
                ...comment,
                replies: updateReplies(comment.replies)
              };
            }
            return comment;
          });
        };
        return updateReplies(prevComments);
      });
      toast.success('Reply added successfully');
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply. Please try again.');
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const response = await axios.put(
        `${REACT_APP_BACKEND_URL}/documents/comments/${commentId}`,
        { content },
        { headers: { 'x-auth-token': authState.token } }
      );
      setComments(prevComments => {
        const updateComment = (comments) => {
          return comments.map(comment => {
            if (comment._id === commentId) {
              return response.data;
            } else if (comment.replies) {
              return {
                ...comment,
                replies: updateComment(comment.replies)
              };
            }
            return comment;
          });
        };
        return updateComment(prevComments);
      });
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${REACT_APP_BACKEND_URL}/documents/comments/${commentId}`,
        { headers: { 'x-auth-token': authState.token } }
      );
      setComments(prevComments => {
        const deleteComment = (comments) => {
          return comments.filter(comment => {
            if (comment._id === commentId) {
              return false;
            } else if (comment.replies) {
              comment.replies = deleteComment(comment.replies);
            }
            return true;
          });
        };
        return deleteComment(prevComments);
      });
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    }
  };

  if (!isOpen || !authState.isAuthenticated) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Comments for Document: {documentId}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto mb-4">
            {isLoading ? (
              <p className="text-center text-gray-500">Loading comments...</p>
            ) : error ? (
              <div className="text-center text-red-500">
                <AlertCircle size={24} className="mx-auto mb-2" />
                <p>{error}</p>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onReply={handleReply}
                  onEdit={handleUpdateComment}
                  onDelete={handleDeleteComment}
                  currentUserId={authState.user._id}
                />
              ))
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border rounded-lg px-3 py-2 pr-10 resize-y focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows="3"
            />
            <button
              type="submit"
              className="absolute right-2 bottom-2 text-amber-600 hover:text-amber-700 transition-colors"
              disabled={!newComment.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentsModal;