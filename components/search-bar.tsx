'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value)
    }, 400)
    return () => clearTimeout(timer)
  }, [value, onSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Cari artikel..."
        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
      />
    </div>
  )
}