export default function MessageBubble({ message, sender }) {
  return (
    <div className={`message-bubble ${sender}`}>
      <p>{message}</p>
    </div>
  );
}