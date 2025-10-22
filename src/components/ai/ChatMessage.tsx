import { Sparkles, User, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ChatMessage as ChatMessageType } from '../../services/ai/ai.types';
import { useAIStore } from '../../store/aiStore';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const reopenSuggestion = useAIStore((state) => state.reopenSuggestion);
  const deleteMessage = useAIStore((state) => state.deleteMessage);
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.role === 'user';
  const hasDiagram = !isUser && message.metadata?.code;
  
  const handleDelete = () => {
    deleteMessage(message.id);
  };

  const handleViewSuggestion = () => {
    if (message.metadata?.code) {
      reopenSuggestion({
        id: message.id,
        type: 'generate',
        suggestedCode: message.metadata.code,
        explanation: message.content,
        confidence: 0.9,
        metadata: {
          type: message.metadata.type || message.metadata.diagramType || 'other',
          title: message.metadata.title,
          description: message.metadata.description,
          // Include type-specific fields
          httpMethod: message.metadata.httpMethod,
          endpointPath: message.metadata.endpointPath,
          requestPayloads: message.metadata.requestPayloads,
          responsePayloads: message.metadata.responsePayloads,
          workflowActors: message.metadata.workflowActors,
          workflowTrigger: message.metadata.workflowTrigger,
        },
      });
    }
  };

  return (
    <div 
      className={`group relative flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
            : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      <div className="flex max-w-[80%] flex-col gap-2">
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
          }`}
        >
          {isUser ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-hr:border-gray-300 dark:prose-hr:border-gray-600 prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    return !isInline ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-700" {...props}>
                        {children}
                      </code>
                    );
                  },
                  hr: () => <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />,
                  h1: ({ children }) => <h1 className="mb-2 mt-4 text-lg font-bold">{children}</h1>,
                  h2: ({ children }) => <h2 className="mb-2 mt-3 text-base font-semibold">{children}</h2>,
                  h3: ({ children }) => <h3 className="mb-1 mt-2 text-sm font-semibold">{children}</h3>,
                  p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          <p className="mt-1 text-xs opacity-60">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>

        {/* View Suggestion Button */}
        {hasDiagram && (
          <button
            onClick={handleViewSuggestion}
            className="flex items-center gap-2 self-start rounded-lg border border-primary-300 bg-white px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:border-primary-700 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700"
          >
            <Eye className="h-3.5 w-3.5" />
            View Diagram
          </button>
        )}
      </div>

      {/* Delete Button - Shows on hover */}
      {isHovered && (
        <button
          onClick={handleDelete}
          className={`absolute top-0 ${isUser ? 'left-0' : 'right-0'} rounded-lg p-1.5 text-gray-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400`}
          title="Delete message"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
