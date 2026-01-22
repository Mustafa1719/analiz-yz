import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';

// Webhook URL - production'da env'den alınacak
const WEBHOOK_URL = 'https://mustafaaydinlabmind.app.n8n.cloud/webhook/yz-mentor';

export default function MentorChat({
  isOpen,
  onClose,
  context // { level, levelTitle, questionIndex, questionText, options, evidence }
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sohbet açıldığında hoşgeldin mesajı
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Merhaba! 👋 Bu madde hakkında yardımcı olabilirim. Ne öğrenmek istersin?`
      }]);
    }
  }, [isOpen]);

  // Mesaj alanını otomatik kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Input'a focus
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: messageText,
          context: {
            level: context.level,
            levelTitle: context.levelTitle,
            questionIndex: context.questionIndex,
            questionText: context.questionText,
            options: context.options,
            evidence: context.evidence
          }
        })
      });

      const data = await response.json();

      if (data.output) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.output }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Şu an yanıt veremiyorum. Lütfen tekrar dene.'
        }]);
      }
    } catch (error) {
      console.error('Mentor chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Bağlantı hatası oluştu. Lütfen tekrar dene.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  if (!isOpen) return null;

  // Styles
  const containerStyle = {
    marginTop: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  };

  const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const messagesContainerStyle = {
    maxHeight: '240px',
    overflowY: 'auto',
    padding: '16px'
  };

  const messageStyle = (isUser) => ({
    display: 'flex',
    gap: '10px',
    marginBottom: '12px',
    flexDirection: isUser ? 'row-reverse' : 'row'
  });

  const messageBubbleStyle = (isUser) => ({
    maxWidth: '85%',
    padding: '10px 14px',
    borderRadius: '12px',
    backgroundColor: isUser ? '#3b82f6' : '#f1f5f9',
    color: isUser ? '#ffffff' : '#334155',
    fontSize: '14px',
    lineHeight: '1.5'
  });

  const quickQuestionsStyle = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    padding: '0 16px 12px 16px'
  };

  const quickButtonStyle = {
    padding: '6px 12px',
    fontSize: '12px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const inputContainerStyle = {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  };

  const inputStyle = {
    flex: 1,
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: '#ffffff'
  };

  const sendButtonStyle = {
    padding: '10px 16px',
    backgroundColor: isLoading ? '#94a3b8' : '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
  };

  const closeButtonStyle = {
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <div style={avatarStyle}>
            <Bot style={{ width: '18px', height: '18px', color: '#ffffff' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
              YZ Yetkinlik Mentörü
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
              Bu maddeyi açıklamak için buradayım
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <X style={{ width: '18px', height: '18px', color: '#64748b' }} />
        </button>
      </div>

      {/* Messages */}
      <div style={messagesContainerStyle}>
        {messages.map((msg, index) => (
          <div key={index} style={messageStyle(msg.role === 'user')}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: msg.role === 'user' ? '#e0e7ff' : '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {msg.role === 'user' ? (
                <User style={{ width: '14px', height: '14px', color: '#6366f1' }} />
              ) : (
                <Bot style={{ width: '14px', height: '14px', color: '#64748b' }} />
              )}
            </div>
            <div style={messageBubbleStyle(msg.role === 'user')}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={messageStyle(false)}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bot style={{ width: '14px', height: '14px', color: '#64748b' }} />
            </div>
            <div style={{ ...messageBubbleStyle(false), display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
              Yazıyor...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div style={quickQuestionsStyle}>
          <button
            style={quickButtonStyle}
            onClick={() => handleQuickQuestion('Bu madde ne demek?')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
          >
            Bu madde ne demek?
          </button>
          <button
            style={quickButtonStyle}
            onClick={() => handleQuickQuestion('Örnek verir misin?')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
          >
            Örnek verir misin?
          </button>
          <button
            style={quickButtonStyle}
            onClick={() => handleQuickQuestion('Hangi puanı seçmeliyim?')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
          >
            Nasıl değerlendirmeliyim?
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} style={inputContainerStyle}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Sorunuzu yazın..."
          style={inputStyle}
          maxLength={200}
          disabled={isLoading}
        />
        <button
          type="submit"
          style={sendButtonStyle}
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? (
            <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
          ) : (
            <Send style={{ width: '18px', height: '18px' }} />
          )}
        </button>
      </form>

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
