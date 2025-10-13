import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const mockConversations = [
  {
    id: '1',
    name: 'ABC Construction Pvt Ltd',
    avatar: '',
    lastMessage: 'Can you start tomorrow at 8 AM?',
    timestamp: new Date(),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Metro Builders',
    avatar: '',
    lastMessage: 'Thanks for your interest. We will get back to you.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    name: 'City Projects Ltd',
    avatar: '',
    lastMessage: 'Your application has been received',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 1,
    isOnline: false,
  },
];

export default function Messages() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">Messages</h1>
      </header>

      {/* Conversations List */}
      <div className="divide-y divide-border">
        {mockConversations.map((conversation) => {
          const initials = conversation.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          
          return (
            <button
              key={conversation.id}
              className="w-full px-4 py-3 flex items-start gap-3 hover-elevate active-elevate-2 transition-colors text-left"
              onClick={() => console.log('Open conversation:', conversation.id)}
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

      {mockConversations.length === 0 && (
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
