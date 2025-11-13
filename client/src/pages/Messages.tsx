import { useLocation } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useConversations } from '@/hooks/useMessages';

export default function Messages() {
  const [, setLocation] = useLocation();
  const { data: conversations = [], isLoading, error, refetch } = useConversations();

  const handleOpenConversation = (conversation: typeof conversations[0]) => {
    // Navigate to conversation with user details as query params
    const params = new URLSearchParams({
      name: conversation.name,
    });
    setLocation(`/conversation/${conversation.userId}?${params.toString()}`);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
        </header>
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
        </header>
        <div className="flex items-center justify-center py-16 px-4">
          <div className="text-center space-y-4 max-w-md">
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load messages. Please check your connection and try again.
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">Messages</h1>
      </header>

      {/* Conversations List */}
      <div className="divide-y divide-border">
        {conversations.map((conversation) => {
          const initials = getUserInitials(conversation.name);

          return (
            <button
              key={conversation.id}
              className="w-full px-4 py-3 flex items-start gap-3 hover-elevate active-elevate-2 transition-colors text-left"
              onClick={() => handleOpenConversation(conversation)}
              data-testid={`conversation-${conversation.id}`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-chart-3 border-2 border-background rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {format(conversation.timestamp, 'h:mm a')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground line-clamp-1 flex-1">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="h-5 min-w-[20px] flex items-center justify-center px-1.5 bg-primary text-primary-foreground text-xs shrink-0">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <p className="text-muted-foreground text-center">No messages yet</p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Start applying to jobs to connect with employers
          </p>
        </div>
      )}
    </div>
  );
}
