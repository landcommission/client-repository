import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronDown, ChevronUp, Download, Loader, MessageSquare, Mic, MicOff, Send, User, X, Book, Calendar, Building, Tag, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const { REACT_APP_BACKEND_URL } = process.env;

const RelatedDocumentsList = ({ documents, onDownload }) => {
  const [expandedDocs, setExpandedDocs] = useState({});

  const toggleExpand = (index) => {
    setExpandedDocs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
      <h4 className="font-semibold text-sm mb-2 flex items-center">
        <Book className="mr-2" size={16} />
        Related Documents
      </h4>
      <ul className="space-y-2">
        {documents.map((doc, index) => {
          const isExpanded = expandedDocs[index];
          const fileToDownload = doc.filename || doc.title;
          
          return (
            <li key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <button
                    onClick={() => toggleExpand(index)}
                    className="flex items-center text-left w-full"
                  >
                    <span className="font-medium text-sm text-gray-800 flex-grow">{doc.title || fileToDownload}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {fileToDownload && (
                    <button
                      onClick={() => onDownload(fileToDownload)}
                      className="ml-2 p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                    >
                      <Download size={16} />
                    </button>
                  )}
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 text-xs text-gray-600 space-y-1"
                    >
                      <p className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {new Date(doc.publicationDate).toLocaleDateString()}
                      </p>
                      <p className="flex items-center">
                        <User size={12} className="mr-1" />
                        Author: {doc.author}
                      </p>
                      <p className="flex items-center">
                        <Building size={12} className="mr-1" />
                        Publisher: {doc.publisher}
                      </p>
                      <p className="flex items-center">
                        <Tag size={12} className="mr-1" />
                        Categories: {Array.isArray(doc.categories) ? doc.categories.join(', ') : doc.categories}
                      </p>
                      <p className="flex items-center">
                        <FileText size={12} className="mr-1" />
                        {doc.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);
      setRelatedDocuments([]);

      try {
        const response = await axios.post(`${REACT_APP_BACKEND_URL}/auth/chat`, { message: input });
        const botMessage = { text: response.data.message, sender: 'bot' };
        console.log('Chat server response:', response.data);
        setMessages(prev => [...prev, botMessage]);
        setRelatedDocuments(response.data.relatedDocuments || []);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    }
  };

  const handleDownload = async (filename) => {
    try {
      const fileUrl = `${REACT_APP_BACKEND_URL}/documents/public/${filename}`;
      const response = await fetch(fileUrl);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contentType = response.headers.get('content-type');
  
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error('Error downloading file:', errorData);
        alert('Error downloading file. Please try again.');
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const toggleSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prevInput => prevInput + ' ' + transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
        setIsListening(true);
      }
    } else {
      console.error('Speech recognition not supported in this browser.');
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-4 right-4 bg-amber-600 text-white p-3 rounded-full shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        <MessageSquare size={24} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
              onClick={toggleChat}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-4 right-4 w-[500px] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl overflow-hidden z-[70]"
            >
              <div className="bg-gradient-to-r from-amber-700 to-green-700 text-white p-4 flex justify-between items-center">
                <h3 className="font-semibold text-lg">NLC Repository Assistant</h3>
                <button onClick={toggleChat} className="hover:bg-white/20 p-1 rounded-full transition-colors duration-200">
                  <X size={20} />
                </button>
              </div>
              <div className="h-[calc(100vh-250px)] max-h-[500px] overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                  <motion.div 
                    key={index} 
                    className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === 'user' ? 'bg-amber-700 text-white' : 'bg-green-700 text-white'
                    }`}>
                      {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`max-w-[75%] p-3 rounded-lg text-sm shadow-md ${
                      msg.sender === 'user' ? 'bg-amber-100 text-amber-900' : 'bg-green-100 text-green-900'
                    }`}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-gray-200 p-3 rounded-lg shadow-md">
                      <Loader className="animate-spin text-green-700" size={16} />
                    </div>
                  </div>
                )}
                {relatedDocuments.length > 0 && (
                  <RelatedDocumentsList 
                    documents={relatedDocuments} 
                    onDownload={handleDownload}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="p-4 border-t flex items-center bg-white">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about NLC Repository..."
                  className="flex-grow p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 pr-20 resize-none overflow-hidden"
                  style={{ minHeight: '40px', height: 'auto' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                />
                <div className="absolute right-6 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button
                    type="submit"
                    className="text-amber-600 hover:text-green-700 transition-colors duration-300 p-2"
                    disabled={isLoading}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;