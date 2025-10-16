import { Code2 } from "lucide-react";

export default function LoginHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="h-16 w-16 mb-4 flex items-center justify-center rounded-xl bg-[rgba(var(--accent),0.1)] text-[rgb(var(--accent))]">
        <Code2 size={32} />
      </div>
      <h1 className="text-3xl font-bold text-[rgb(var(--text))]">
        Welcome to DevThreads
      </h1>
      <p className="text-md text-muted mt-1">
        Professional Developer Discussions
      </p>
    </div>
  );
}