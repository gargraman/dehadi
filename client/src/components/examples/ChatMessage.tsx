import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="p-4 bg-background">
      <ChatMessage
        id="1"
        message="Hello, I'm interested in the Mason position you posted."
        timestamp={new Date(Date.now() - 1000 * 60 * 5)}
        isSent={false}
        senderName="Ramesh Kumar"
      />
      <ChatMessage
        id="2"
        message="Great! Can you come for an interview tomorrow at 10 AM?"
        timestamp={new Date(Date.now() - 1000 * 60 * 3)}
        isSent={true}
      />
      <ChatMessage
        id="3"
        message="Yes, I can. Please share the location."
        timestamp={new Date(Date.now() - 1000 * 60 * 1)}
        isSent={false}
        senderName="Ramesh Kumar"
      />
    </div>
  );
}
