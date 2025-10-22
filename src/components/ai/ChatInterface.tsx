import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, X, FileText, Trash2, Square } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';
import { ChatMessage } from './ChatMessage';
import { QuickActions } from './QuickActions';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useI18n } from '../../contexts/I18nContext';
import toast from 'react-hot-toast';

export const ChatInterface = () => {
  const { messages, isGenerating, sendMessage, stopGeneration, contextDiagram, setContextDiagram, clearMessages } = useAIStore();
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const message = input.trim();
    setInput('');
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
    // Allow Shift+Enter for line breaks (default behavior)
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClearChat = () => {
    clearMessages();
    setContextDiagram(null);
    toast.success('Chat cleared');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Context Indicator */}
      {contextDiagram && (
        <div className="border-b border-primary-300 bg-primary-100 px-4 py-2.5 dark:border-primary-700 dark:bg-primary-900/50">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary-700 dark:text-primary-300" />
            <div>
              <p className="text-xs font-semibold text-primary-900 dark:text-primary-100">
                Editing: {contextDiagram.title}
              </p>
              <p className="text-xs text-primary-700 dark:text-primary-300">
                Type: {contextDiagram.type}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {t('ai.welcome')}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('ai.welcomeSubtitle')}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isGenerating && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('ai.thinking')}
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && <QuickActions onAction={handleQuickAction} />}

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="flex gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              className="flex items-center justify-center self-end rounded-lg border border-gray-300 px-3 py-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('ai.placeholder')}
            disabled={isGenerating}
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white overflow-y-auto"
            style={{
              minHeight: '40px',
              maxHeight: '200px',
              height: 'auto',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          />
          {isGenerating ? (
            <button
              type="button"
              onClick={() => stopGeneration()}
              className="flex h-10 w-10 items-center justify-center self-end rounded-lg bg-red-500 text-white transition-all hover:bg-red-600"
              title="Stop generation"
            >
              <Square className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 items-center justify-center self-end rounded-lg bg-gradient-to-r from-primary-500 to-purple-600 text-white transition-all hover:from-primary-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Confirm Clear Chat Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearChat}
        title="Clear Chat History"
        message="Are you sure you want to clear all messages and context? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
};
