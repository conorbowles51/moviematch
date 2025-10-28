import { Menu } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const onLogout = async () => {
    await logout()
    setOpen(false)
  }

  const go = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <div className="relative ml-4" ref={menuRef}>
      <div
        className="aspect-square border p-1.5 rounded-full hover:bg-zinc-900 transition-colors cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        role="button"
        tabIndex={0}
      >
        <Menu />
      </div>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 bg-black border border-zinc-800 rounded-md shadow-lg py-1 z-50"
          role="menu"
          aria-label="User menu"
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            onClick={() => go('/library')}
            role="menuitem"
          >
            View Library
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            onClick={() => go('/groups')}
            role="menuitem"
          >
            View Groups
          </button>
          <div className="my-1 h-px bg-zinc-800" />
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-900"
            onClick={onLogout}
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
