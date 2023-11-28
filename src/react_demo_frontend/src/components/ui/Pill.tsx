type PillProps = {
  children: React.ReactNode;
};
export default function Pill({ children }: PillProps) {
  return (
    <div className="rounded-full bg-zinc-800 px-3 py-1 text-sm flex gap-2 items-center">
      {children}
    </div>
  );
}
