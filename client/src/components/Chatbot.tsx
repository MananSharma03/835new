import React, { useState, useEffect, useRef } from 'react';
import { ButtonUnstyled } from '@/components/ui/button-unstyled';

interface ChatMessage {
  sender: 'user' | 'bot';
  message: string;
}

const Chatbot: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userInputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          sender: 'bot', 
          message: "Hi there! How can I help you learn about Manan's professional background and projects?" 
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chatbot is opened
  useEffect(() => {
    if (isActive && userInputRef.current) {
      userInputRef.current.focus();
    }
  }, [isActive]);

  const handleToggleChatbot = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(prev => !prev);
  };

  const handleCloseChatbot = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(false);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotIcon = document.getElementById('chatbot-icon');
    
    if (
      isActive && 
      chatbotWindow && 
      chatbotIcon && 
      !chatbotWindow.contains(e.target as Node) && 
      !chatbotIcon.contains(e.target as Node)
    ) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isActive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { sender: 'user', message: inputValue.trim() } as ChatMessage;
    setMessages(prev => [...prev, userMessage]);
    
    // Generate response
    const response = generateResponse(inputValue);
    
    // Clear input
    setInputValue('');
    
    // Add bot response with a small delay to simulate thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', message: response }]);
    }, 500);
  };

  const generateResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();

    // Predefined response map
    const responseMap: Record<string, string> = {
      'skills': 'I have expertise in data analysis, DevOps, and programming. My key skills include Python, C++, JavaScript, SQL, statistical modeling, and cloud infrastructure.',
      'projects': 'I\'ve developed two key projects: Stock Price Prediction using machine learning and historical data, and YouTube Data Scraping for analyzing trends and user engagement.',
      'experience': 'As a Data Analysis & Machine Learning Enthusiast, I specialize in transforming complex data into actionable insights and optimizing technological processes.',
      'contact': 'You can reach me via email at manan.sharma.ece22@itbhu.ac.in or connect with me on LinkedIn and GitHub. You can also use the contact form on my portfolio.',
      'stock': 'My Stock Price Prediction project uses historical data, machine learning models, and statistical techniques to forecast future stock prices. It helps investors make informed decisions by analyzing trends, patterns, and market conditions.',
      'youtube': 'My YouTube Data Scraping project involves extracting video details like views, likes, and comments using web scraping or APIs. It helps in analyzing trends, user engagement, and content performance.',
      'resume': 'You can view my resume by clicking the "View Resume" button in the resume section. It will open my resume hosted on Google Drive.',
      'default': 'I can help you learn about my professional background. Feel free to ask about my skills, projects, or experience.'
    };

    // Keywords for matching user intent
    const keywords: Record<string, string[]> = {
      'skills': ['skill', 'technical', 'programming', 'technology', 'know'],
      'projects': ['project', 'work', 'develop', 'create', 'built', 'portfolio'],
      'experience': ['experience', 'background', 'career', 'history', 'job'],
      'contact': ['contact', 'reach', 'connect', 'email', 'message', 'hire'],
      'stock': ['stock', 'price', 'prediction', 'forecast', 'market', 'trading', 'investment'],
      'youtube': ['youtube', 'video', 'scraping', 'data', 'comments', 'views', 'engagement'],
      'resume': ['resume', 'cv', 'curriculum', 'vitae', 'qualification', 'document']
    };

    // Match user message with predefined keywords
    for (const [key, keywordList] of Object.entries(keywords)) {
      if (keywordList.some(keyword => lowercaseMessage.includes(keyword))) {
        return responseMap[key];
      }
    }

    // Return default response if no match found
    return responseMap['default'];
  };

  return (
    <div className="fixed bottom-5 right-5 z-10">
      {/* Chatbot Icon */}
      <div 
        id="chatbot-icon"
        className="w-[60px] h-[60px] bg-primary rounded-full flex justify-center items-center cursor-pointer shadow-md transition-transform hover:scale-110 hover:shadow-lg"
        onClick={handleToggleChatbot}
      >
        <i className="fas fa-comment-dots text-white text-2xl"></i>
      </div>

      {/* Chatbot Window */}
      <div className={`chatbot-window absolute bottom-[80px] right-0 w-[350px] bg-white rounded-lg shadow-xl overflow-hidden ${isActive ? 'active' : ''}`}>
        {/* Chatbot Header */}
        <div className="bg-primary text-white p-3 flex justify-between items-center">
          <span className="font-medium">Ask about my Profile</span>
          <ButtonUnstyled 
            className="chatbot-close bg-transparent border-none text-white text-2xl cursor-pointer hover:text-accent transition-colors"
            onClick={handleCloseChatbot}
          >
            &times;
          </ButtonUnstyled>
        </div>

        {/* Chatbot Messages */}
        <div 
          id="chatbot-messages" 
          ref={messagesContainerRef}
          className="h-[300px] overflow-y-auto p-4 bg-white"
        >
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 rounded-lg max-w-[80%] shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white ml-auto' 
                  : 'bg-white text-foreground border border-neutral-300'
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>

        {/* Chatbot Input */}
        <div className="flex p-3 bg-white border-t border-neutral-200">
          <input 
            type="text" 
            id="user-input"
            ref={userInputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your query..." 
            className="flex-grow p-2 border border-neutral-300 rounded-lg mr-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <button 
            id="send-btn"
            onClick={handleSendMessage}
            className="bg-primary text-white border-none rounded-lg px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
