import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  jobId?: string;
  isRead: boolean;
  createdAt: string;
}

interface SendMessageRequest {
  receiverId: string;
  content: string;
  jobId?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  userId: string; // The other participant's ID
}

export function useMessagesForConversation(otherUserId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['/api/messages', user?.id, otherUserId],
    queryFn: async (): Promise<Message[]> => {
      if (!user?.id || !otherUserId) return [];

      const res = await fetch(`/api/messages/${user.id}/${otherUserId}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }

      return res.json();
    },
    enabled: !!user?.id && !!otherUserId,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: SendMessageRequest): Promise<Message> => {
      const res = await apiRequest('POST', '/api/messages', data);
      return res.json();
    },
    onSuccess: (newMessage) => {
      // Invalidate and refetch conversations
      queryClient.invalidateQueries({
        queryKey: ['/api/messages', user?.id, newMessage.receiverId]
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/messages', newMessage.receiverId, user?.id]
      });
    },
  });
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string): Promise<void> => {
      await apiRequest('PATCH', `/api/messages/${messageId}/read`, { isRead: true });
    },
    onSuccess: () => {
      // Invalidate message queries to update read status
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
  });
}

// Mock function to get conversations list - in a real app this would be an API endpoint
export function useConversations() {
  const { user } = useAuth();

  // For now, return mock data since there's no conversations endpoint
  // In a real app, you'd have an endpoint that returns all conversations for a user
  return useQuery({
    queryKey: ['/api/conversations', user?.id],
    queryFn: async (): Promise<Conversation[]> => {
      // This would be replaced with a real API call
      return [
        {
          id: '1',
          name: 'ABC Construction Pvt Ltd',
          avatar: '',
          lastMessage: 'Can you start tomorrow at 8 AM?',
          timestamp: new Date(),
          unreadCount: 2,
          isOnline: true,
          userId: 'employer-1', // In real app, this would be the actual user ID
        },
        {
          id: '2',
          name: 'Metro Builders',
          avatar: '',
          lastMessage: 'Thanks for your interest. We will get back to you.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          unreadCount: 0,
          isOnline: false,
          userId: 'employer-2',
        },
        {
          id: '3',
          name: 'City Projects Ltd',
          avatar: '',
          lastMessage: 'Your application has been received',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          unreadCount: 1,
          isOnline: false,
          userId: 'employer-3',
        },
      ];
    },
    enabled: !!user,
  });
}