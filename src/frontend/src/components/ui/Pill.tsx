import { twMerge } from "tailwind-merge";

type PillProps = {
  className?: string;
  children: React.ReactNode;
};
export default function Pill({ className, children }: PillProps) {
  className = twMerge(
    "flex items-center px-3 py-1 text-sm rounded-full bg-zinc-800 gap-2",
    className
  );

  return <div className={className}>{children}</div>;
}
