import Image from "next/image";

interface CurrentUser {
  id: string;
  name: string;
  avatar: string;
}

interface NewCommentFormProps {
  currentUser: CurrentUser | null;
  newCommentText: string;
  setNewCommentText: (text: string) => void;
  onSubmit: () => void;
  isReply?: boolean; // New optional prop to indicate if this is a reply
}

export default function NewCommentForm({ 
  currentUser, 
  newCommentText, 
  setNewCommentText, 
  onSubmit, 
  isReply = false 
}: NewCommentFormProps) {
  
  // The form is more compact when used as a reply
  const placeholder = isReply ? "Write a reply..." : `Share your thoughts, ${currentUser?.name || "User"}...`;
  const buttonText = isReply ? "Post Reply" : "Post Comment";
  const rows = isReply ? 2 : 3;

  const formContent = (
    <div className="flex items-start gap-3 sm:gap-4">
      {/* The main form shows the user avatar */}
      {!isReply && (
        <Image 
          src={currentUser?.avatar || "https://i.pravatar.cc/150"} 
          alt={currentUser?.name || "User"} 
          width={40} 
          height={40} 
          className="rounded-full mt-1 flex-shrink-0" 
        />
      )}
      <div className="flex-1">
        <textarea 
          value={newCommentText} 
          onChange={(e) => setNewCommentText(e.target.value)} 
          placeholder={placeholder}
          rows={rows} 
          className="w-full resize-none" 
        />
        <div className="mt-2 flex justify-end">
          <button 
            onClick={onSubmit} 
            disabled={!newCommentText.trim()} 
            className={`rounded-md btn-accent text-sm ${isReply ? 'px-4 py-1.5 text-xs' : 'px-5 py-2'}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );

  // The main form gets a card wrapper, the reply form does not
  return isReply ? formContent : <div className="card p-4 sm:p-5 mb-8">{formContent}</div>;
}