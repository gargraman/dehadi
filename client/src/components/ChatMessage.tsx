import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface ChatMessageProps {
  id: string;
  message: string;
  timestamp: Date;
  isSent: boolean;
  senderName?: string;
  senderAvatar?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'document';
}

export default function ChatMessage({
  id,
  message,
  timestamp,
  isSent,
  senderName,
  senderAvatar,
  attachmentUrl,
  attachmentType,
}: ChatMessageProps) {
  const initials = senderName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className={`flex gap-2 mb-4 ${isSent ? 'flex-row-reverse' : 'flex-row'}`} data-testid={`message-${id}`}>
      {!isSent && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={senderAvatar} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[75%] ${isSent ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isSent
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-card text-card-foreground rounded-tl-sm'
          }`}
          data-testid={`message-content-${id}`}
        >
          {attachmentUrl && attachmentType === 'image' && (
            <img 
              src={attachmentUrl} 
              alt="Attachment" 
              className="rounded-lg mb-2 max-w-full"
              data-testid={`message-image-${id}`}
            />
          )}
          {attachmentUrl && attachmentType === 'document' && (
            <div className="flex items-center gap-2 p-2 bg-background/20 rounded-lg mb-2" data-testid={`message-document-${id}`}>
              <span className="material-icons text-xl">description</span>
              <span className="text-sm">Document.pdf</span>
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1" data-testid={`message-time-${id}`}>
          {format(timestamp, 'h:mm a')}
        </span>
      </div>
    </div>
  );
}
