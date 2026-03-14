export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <span className="text-3xl font-display font-extrabold text-[#e8ff47]">pulse</span>
        <p className="text-xs font-mono text-[#444] mt-1">share your thoughts</p>
      </div>
      {children}
    </div>
  );
}