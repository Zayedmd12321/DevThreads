import Image from "next/image";
import { Flame, ThumbsUp, MessageSquare, Share2 } from "lucide-react";

interface PostCardProps {
  totalComments: number;
}

export default function PostCard({ totalComments }: PostCardProps) {
  return (
    <div className="lg:sticky lg:top-24">
      <div className="card p-4 flex flex-col gap-3">
        <a href="https://github.com/Zayedmd12321">
          <div className="flex items-center gap-3 cursor-pointer">
            <Image
              src="/profilePic.jpg"
              alt="User avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-[rgb(var(--text))]">Zayed</p>
              <p className="text-sm text-muted">@zayedmd12321</p>
            </div>
          </div>
        </a>

        <div className="w-full mt-1">
          <Image
            src="/post.png"
            alt="Utility-first CSS hot take image"
            width={400}
            height={200}
            layout="responsive"
            className="rounded-lg border border-[rgb(var(--border))] max-h-[400px] object-cover"
          />
        </div>

        <div className="flex items-start gap-1">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[rgba(var(--accent),0.1)] text-[rgb(var(--accent))]">
              <Flame size={20} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold">Hot Take: Utility-first CSS is just a messier version of inline styles.</h1>
            <p className="text-sm text-muted mt-1">
              I've been using Tailwind CSS for this project, and while the development speed is amazing, I can't shake the feeling that my TSX is becoming unreadable. It feels like we're just relearning inline styles with extra steps. Are the benefits of utility classes worth the cost to readability, or is this really the future of styling?<br /><b>Change my mind.</b>
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[rgb(var(--border))] flex items-center justify-around text-muted">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-[rgba(var(--border),0.5)] hover:text-[rgb(var(--text))] transition-colors duration-200 cursor-pointer">
            <ThumbsUp size={18} />
            <span className="text-sm font-semibold">1M</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-[rgba(var(--border),0.5)] hover:text-[rgb(var(--text))] transition-colors duration-200 cursor-pointer">
            <MessageSquare size={18} />
            <span className="text-sm font-semibold">{totalComments}</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-[rgba(var(--border),0.5)] hover:text-[rgb(var(--text))] transition-colors duration-200 cursor-pointer">
            <Share2 size={18} />
            <span className="text-sm font-semibold">700K</span>
          </button>
        </div>
      </div>
    </div>
  );
}