'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Eye, Heart, Pencil, Trash2, Globe, FileText, ChevronUp, ChevronDown, ChevronsUpDown, Search, MessageCircle } from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  publishedAt: string | null
  views: number
  likes: number
  commentCount: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())
const columnHelper = createColumnHelper<Post>()

export default function AdminDashboard() {
  const { data: posts, isLoading, error, mutate } = useSWR<Post[]>('/api/posts?admin=true', fetcher)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return
    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      if (response.ok) mutate()
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published: !published,
          publishedAt: !published ? new Date().toISOString() : null,
        }),
      })
      if (response.ok) mutate()
    } catch (err) {
      console.error('Failed to update post:', err)
    }
  }

  const columns = [
    columnHelper.accessor('title', {
      header: 'Judul',
      cell: (info) => (
        <div>
          <p className="font-medium text-foreground">{info.getValue()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{info.row.original.slug}</p>
        </div>
      ),
    }),
    columnHelper.accessor('published', {
      header: 'Status',
      cell: (info) => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
          info.getValue()
            ? 'bg-accent/15 text-accent'
            : 'bg-secondary text-muted-foreground'
        }`}>
          {info.getValue()
            ? <><Globe className="w-3 h-3" /> Dipublikasi</>
            : <><FileText className="w-3 h-3" /> Draft</>
          }
        </span>
      ),
    }),
    columnHelper.accessor('views', {
      header: 'Tayangan',
      cell: (info) => (
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Eye className="w-3.5 h-3.5" />
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('likes', {
      header: 'Suka',
      cell: (info) => (
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Heart className="w-3.5 h-3.5" />
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('commentCount', {
      header: 'Komentar',
      cell: (info) => (
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageCircle className="w-3.5 h-3.5" />
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="sr-only">Aksi</span>,
      cell: (info) => {
        const post = info.row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Link href={`/admin/${post.id}/edit`}>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            </Link>
            <Button
              size="sm"
              variant={post.published ? 'outline' : 'default'}
              onClick={() => handleTogglePublish(post.id, post.published)}
              className="gap-1.5"
            >
              {post.published
                ? <><FileText className="w-3.5 h-3.5" /> Draft</>
                : <><Globe className="w-3.5 h-3.5" /> Publikasi</>
              }
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(post.id)}
              className="gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </Button>
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: posts ?? [],
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-secondary rounded w-1/3" />
        <div className="h-64 bg-secondary rounded" />
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Gagal memuat artikel</p>
  }

  const filteredPosts = table.getFilteredRowModel().rows.map(r => r.original)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold font-lora text-foreground mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Kelola artikel blog Anda</p>
        </div>
        <Link href="/admin/create">
          <Button className="gap-2">
            <Pencil className="w-4 h-4" />
            Buat Artikel Baru
          </Button>
        </Link>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border bg-secondary/20">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Cari artikel..."
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 w-full transition-all"
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {table.getFilteredRowModel().rows.length} artikel
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-border bg-secondary/10">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {header.isPlaceholder ? null : (
                        <button
                          className={`flex items-center gap-1 ${header.column.getCanSort() ? 'cursor-pointer hover:text-foreground transition-colors' : ''}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            header.column.getIsSorted() === 'asc' ? <ChevronUp className="w-3.5 h-3.5" />
                            : header.column.getIsSorted() === 'desc' ? <ChevronDown className="w-3.5 h-3.5" />
                            : <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                          )}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center text-muted-foreground text-sm">
                    {globalFilter ? `Tidak ada artikel untuk "${globalFilter}"` : 'Belum ada artikel'}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-border hover:bg-secondary/40 transition-colors last:border-0">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="py-4 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-border">
          {table.getRowModel().rows.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              {globalFilter ? `Tidak ada artikel untuk "${globalFilter}"` : 'Belum ada artikel'}
            </div>
          ) : (
            table.getRowModel().rows.map(row => {
              const post = row.original
              return (
                <div key={post.id} className="p-4 space-y-3 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{post.slug}</p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      post.published ? 'bg-accent/15 text-accent' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {post.published
                        ? <><Globe className="w-3 h-3" /> Publik</>
                        : <><FileText className="w-3 h-3" /> Draft</>
                      }
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.views}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{post.commentCount}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/admin/${post.id}/edit`}>
                      <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                        <Pencil className="w-3 h-3" /> Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant={post.published ? 'outline' : 'default'}
                      onClick={() => handleTogglePublish(post.id, post.published)}
                      className="gap-1.5 h-8 text-xs"
                    >
                      {post.published
                        ? <><FileText className="w-3 h-3" /> Draft</>
                        : <><Globe className="w-3 h-3" /> Publikasi</>
                      }
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                      className="gap-1.5 h-8 text-xs"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/10 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Baris per halaman</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="text-xs border border-border rounded-md px-2 py-1 bg-background text-foreground focus:outline-none"
            >
              {[5, 10, 20].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
            </span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-7 px-2 text-xs">←</Button>
              <Button size="sm" variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-7 px-2 text-xs">→</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}