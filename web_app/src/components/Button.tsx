
interface ButtonProps {
  children: React.ReactNode
}

export default function Button({
  children
}: ButtonProps) {
  return (
    <button
      className="bg-blue-300 hover:bg-blue-500 transition-all px-3 py-2 rounded-sm border border-zinc-50 cursor-pointer"
    >
      {children}
    </button>
  )
}
