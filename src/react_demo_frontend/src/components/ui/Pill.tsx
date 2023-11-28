type PillProps = {
  children: React.ReactNode;
};
export default function Pill({ children }: PillProps) {
  return (
    <div className="flex items-center px-3 py-1 text-sm rounded-full bg-zinc-800 gap-2">
      {children}
    </div>
  );
}
