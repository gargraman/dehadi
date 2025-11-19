import { useLocation } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Phone, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
        <header className="bg-blue-500 text-white px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">💬 बातचीत</h1>
            <p className="text-blue-100">Messages</p>
          </div>
        </header>
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-700">संदेश लोड हो रहे हैं...</p>
            <p className="text-gray-500">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
        <header className="bg-blue-500 text-white px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">💬 बातचीत</h1>
            <p className="text-blue-100">Messages</p>
          </div>
        </header>
        <div className="flex items-center justify-center py-16 px-4">
          <div className="text-center space-y-6">
            <div className="text-8xl">😞</div>
            <p className="text-xl font-semibold text-gray-700">संदेश नहीं मिले</p>
            <p className="text-gray-500">Messages couldn't load</p>
            <Button
              onClick={() => refetch()}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-xl"
            >
              🔄 दोबारा कोशिश करें
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Simplified Header */}
      <header className="bg-blue-500 text-white px-6 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">💬 बातचीत</h1>
          <p className="text-blue-100">Messages</p>
        </div>
      </header>

      {/* Conversations List */}
      <div className="px-6 py-6 space-y-4">
        {conversations.map((conversation) => {
          const initials = getUserInitials(conversation.name);

          return (
            <Card
              key={conversation.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-98 border-2"
              onClick={() => handleOpenConversation(conversation)}
              data-testid={`conversation-${conversation.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Large Avatar */}
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">●</span>
                      </div>
                    )}
                  </div>

                  {/* Message Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {conversation.name}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <Badge className="h-8 min-w-[32px] flex items-center justify-center px-3 bg-red-500 text-white text-base font-bold">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>

                    {/* Last Message */}
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle size={18} className="text-gray-500" />
                      <p className="text-gray-600 line-clamp-2 flex-1">
                        {conversation.lastMessage}
                      </p>
                    </div>

                    {/* Time and Action Buttons */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        ⏰ {format(conversation.timestamp, 'h:mm a')}
                      </span>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 px-4 rounded-xl border-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle phone call
                            console.log('Phone call to', conversation.name);
                          }}
                        >
                          <Phone size={16} />
                        </Button>

                        <Button
                          size="sm"
                          className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenConversation(conversation);
                          }}
                        >
                          <MessageCircle size={16} className="mr-2" />
                          बात करें
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="text-8xl mb-6">💬</div>
          <p className="text-2xl font-bold text-gray-700 mb-2">अभी कोई संदेश नहीं</p>
          <p className="text-lg text-gray-500 text-center mb-6">
            No messages yet
          </p>
          <p className="text-base text-gray-600 text-center mb-8">
            काम के लिए अप्लाई करें और नियोक्ता से बात करें
            <br />
            Apply for jobs to connect with employers
          </p>
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-xl"
            onClick={() => setLocation('/')}
          >
            🔍 काम खोजें
          </Button>
        </div>
      )}
    </div>
  );
}