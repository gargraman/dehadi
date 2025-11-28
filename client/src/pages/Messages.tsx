import { useLocation } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Phone, Loader2, ChevronRight, Search, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import { useConversations } from '@/hooks/useMessages';

export default function Messages() {
  const [, setLocation] = useLocation();
  const { data: conversations = [], isLoading, error, refetch } = useConversations();

  const handleOpenConversation = (conversation: typeof conversations[0]) => {
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
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-primary text-primary-foreground px-4 py-5">
          <div className="text-center">
            <h1 className="text-xl font-bold flex items-center justify-center gap-2">
              <MessageCircle className="w-6 h-6" />
              बातचीत
            </h1>
            <p className="text-sm text-primary-foreground/80">Messages</p>
          </div>
        </header>
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
            <div>
              <p className="text-lg font-semibold">संदेश लोड हो रहे हैं...</p>
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-primary text-primary-foreground px-4 py-5">
          <div className="text-center">
            <h1 className="text-xl font-bold flex items-center justify-center gap-2">
              <MessageCircle className="w-6 h-6" />
              बातचीत
            </h1>
            <p className="text-sm text-primary-foreground/80">Messages</p>
          </div>
        </header>
        <div className="flex items-center justify-center py-16 px-4">
          <Card className="text-center p-8 max-w-sm">
            <CardContent className="space-y-4">
              <Inbox className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-semibold">संदेश नहीं मिले</p>
                <p className="text-sm text-muted-foreground">Couldn't load messages</p>
              </div>
              <Button onClick={() => refetch()}>
                दोबारा कोशिश करें • Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-5">
        <div className="text-center">
          <h1 className="text-xl font-bold flex items-center justify-center gap-2">
            <MessageCircle className="w-6 h-6" />
            बातचीत
          </h1>
          <p className="text-sm text-primary-foreground/80">Messages</p>
        </div>
      </header>

      {/* Conversations List */}
      <div className="px-4 py-4 space-y-3">
        {conversations.map((conversation) => {
          const initials = getUserInitials(conversation.name);

          return (
            <Card
              key={conversation.id}
              className="cursor-pointer hover-elevate"
              onClick={() => handleOpenConversation(conversation)}
              data-testid={`conversation-${conversation.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>

                  {/* Message Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-foreground truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {format(conversation.timestamp, 'h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {/* Unread Badge / Arrow */}
                  <div className="shrink-0">
                    {conversation.unreadCount > 0 ? (
                      <Badge className="h-6 min-w-[24px] px-2 bg-primary text-primary-foreground">
                        {conversation.unreadCount}
                      </Badge>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-10 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Phone call to', conversation.name);
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    कॉल करें
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 h-10 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenConversation(conversation);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    बात करें
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <Card className="text-center p-8 max-w-sm">
            <CardContent className="space-y-4">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-semibold">अभी कोई संदेश नहीं</p>
                <p className="text-sm text-muted-foreground">No messages yet</p>
              </div>
              <p className="text-sm text-muted-foreground">
                काम के लिए अप्लाई करें और नियोक्ता से बात करें
              </p>
              <Button onClick={() => setLocation('/')}>
                <Search className="w-4 h-4 mr-2" />
                काम खोजें • Find Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
