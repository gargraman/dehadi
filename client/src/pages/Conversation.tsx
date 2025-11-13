import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowBack, Send, MoreVert } from '@mui/icons-material';
import { Loader2 } from 'lucide-react';
import { useMessagesForConversation, useSendMessage, useMarkMessageAsRead } from '@/hooks/useMessages';
import { useAuth } from '@/lib/auth';
import { format } from 'date-fns';

export default function Conversation() {
  const { userId } = useParams() as { userId: string };
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get conversation participant details from URL params or state
  // In a real app, this would come from an API call
  const participantName = decodeURIComponent(
    new URLSearchParams(window.location.search).get('name') || 'Unknown User'
  );

  const {
    data: messages = [],
    isLoading,
    error,
    refetch
  } = useMessagesForConversation(userId);

  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkMessageAsRead();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark unread messages as read when viewing conversation
  useEffect(() => {
    const unreadMessages = messages.filter(
      msg => msg.receiverId === user?.id && !msg.isRead
    );

    unreadMessages.forEach(msg => {
      markAsReadMutation.mutate(msg.id);
    });
  }, [messages, user?.id, markAsReadMutation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || !userId) return;

    sendMessageMutation.mutate(
      {
        receiverId: userId,
        content: messageText.trim(),
      },
      {
        onSuccess: () => {
          setMessageText('');
        },
      }
    );
  };

  const handleGoBack = () => {
    setLocation('/messages');
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load conversation. Please try again.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => refetch()}
            className="w-full mt-4"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            data-testid="button-back"
          >
            <ArrowBack sx={{ fontSize: 20 }} />
          </Button>

          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getUserInitials(participantName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-semibold text-foreground">{participantName}</h1>
              <p className="text-xs text-muted-foreground">
                {messages.length > 0 ? `${messages.length} messages` : 'Start a conversation'}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="sm" data-testid="button-menu">
            <MoreVert sx={{ fontSize: 20 }} />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground text-center">
              No messages yet
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.senderId === user?.id;
            const showTimestamp =
              index === 0 ||
              new Date(messages[index - 1].createdAt).getTime() - new Date(message.createdAt).getTime() > 300000; // 5 minutes

            return (
              <div key={message.id} className="space-y-2">
                {showTimestamp && (
                  <div className="flex justify-center">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                )}

                <div
                  className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  data-testid={`message-${message.id}`}
                >
                  {!isOwnMessage && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        {getUserInitials(participantName)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      <span className="text-xs">
                        {format(new Date(message.createdAt), 'h:mm a')}
                      </span>
                      {isOwnMessage && (
                        <Badge
                          variant="secondary"
                          className={`text-xs h-4 ${
                            message.isRead ? 'bg-primary-foreground/20' : 'bg-primary-foreground/10'
                          }`}
                        >
                          {message.isRead ? 'Read' : 'Sent'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-card border-t border-card-border p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-base"
            disabled={sendMessageMutation.isPending}
            data-testid="input-message"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            data-testid="button-send"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send sx={{ fontSize: 20 }} />
            )}
          </Button>
        </form>

        {sendMessageMutation.isError && (
          <Alert variant="destructive" className="mt-3">
            <AlertDescription>
              Failed to send message. Please try again.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}