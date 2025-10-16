// components/NewCommentForm.tsx
import Image from "next/image";

interface CurrentUser {
  id: string;
  name: string;
  avatar: string;
}

interface NewCommentFormProps {
  currentUser: CurrentUser | undefined;
  newCommentText: string;
  setNewCommentText: (text: string) => void;
  onSubmit: () => void;
}

export default function NewCommentForm({ currentUser, newCommentText, setNewCommentText, onSubmit }: NewCommentFormProps) {
  return (
    <div className="card p-5 mb-8">
      <div className="flex items-start gap-4">
        <Image src={currentUser?.avatar || "https://i.pravatar.cc/150"} alt={currentUser?.name || "User"} width={40} height={40} className="rounded-full mt-1" />
        <div className="flex-1">
          <textarea 
            value={newCommentText} 
            onChange={(e) => setNewCommentText(e.target.value)} 
            placeholder={`Share your thoughts, ${currentUser?.name || "User"}...`} 
            rows={3} 
            className="w-full resize-none" 
          />
          <div className="mt-3 flex justify-end">
            <button 
              onClick={onSubmit} 
              disabled={!newCommentText.trim()} 
              className="rounded-md btn-accent px-5 py-2 text-sm"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}