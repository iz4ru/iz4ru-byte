# iz4ru.byte - Personal Blog

A modern personal blog built with Next.js 15, Tailwind CSS, and TipTap rich text editor. Features a dark theme with pixel art aesthetic, real-time view/like counters, and a powerful admin panel for content management.

## Features

### 📖 Public Blog
- Beautiful post feed with cards showing title, excerpt, date, views, and likes
- Individual post pages with full-content display
- View counter that increments on page load
- Like button with persistent counter using local storage user IDs
- Responsive design optimized for all screen sizes
- Indonesian UI text and date formatting

### 🎨 Design
- Dark theme with pixel art aesthetic
- Three-font system: Sora (UI), Lora (headings), JetBrains Mono (code)
- Smooth animations and transitions
- Custom Tailwind design tokens for consistent theming
- Color palette: Deep purple background (#2b2d42), neon purple accent (#c77dff), bright cyan secondary

### ✍️ Admin Panel
- Create, edit, and delete posts
- Rich text editor powered by TipTap with formatting toolbar
- Support for headings, bold, italic, lists, blockquotes, and code blocks
- Draft and published states
- Publish/unpublish posts with one click
- Dashboard showing all posts with statistics

### 🔄 Real-time Features
- View counter tracking (increments server-side)
- Like system with user session persistence
- SWR for optimistic updates and caching
- Real-time post statistics in admin panel

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom dark theme
- **Editor**: TipTap (based on ProseMirror)
- **Data**: File-based JSON storage (ready for database migration)
- **UI Components**: Custom shadcn/ui components
- **State Management**: SWR for client-side caching

## Project Structure

```
.
├── app/
│   ├── page.tsx                 # Homepage with blog feed
│   ├── layout.tsx               # Root layout with fonts
│   ├── globals.css              # Tailwind styles and theme
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx         # Individual blog post page
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout
│   │   ├── page.tsx             # Dashboard
│   │   ├── create/
│   │   │   └── page.tsx         # Create post form
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx     # Edit post form
│   └── api/
│       ├── posts/
│       │   ├── route.ts         # GET all posts, POST create
│       │   ├── [id]/route.ts    # GET/PUT/DELETE single post
│       │   └── by-slug/[slug]/route.ts  # GET post by slug
│       ├── views/route.ts       # Increment view counter
│       └── likes/route.ts       # Toggle like
├── components/
│   ├── post-card.tsx            # Blog post preview card
│   ├── post-list.tsx            # Blog feed component
│   ├── navbar.tsx               # Navigation bar
│   ├── footer.tsx               # Footer
│   ├── tiptap-editor.tsx        # Rich text editor
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── textarea.tsx
├── lib/
│   ├── blog-data.ts             # Data layer with CRUD operations
│   └── utils.ts                 # Utility functions
├── data/
│   └── posts.json               # Post storage
└── public/
    └── blog-hero.jpg            # Hero image
```

## Getting Started

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Create Your First Post

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Click "Buat Artikel Baru" (Create New Article)
3. Fill in the form:
   - **Judul** (Title): Article title
   - **Slug**: URL-friendly version (auto-generated from title)
   - **Ringkasan** (Excerpt): Short summary shown in feed
   - **Konten** (Content): Full article content with rich formatting
4. Click "Simpan Artikel" to save as draft
5. Go back to dashboard and click "Publikasi" to publish

## API Reference

### GET /api/posts
Fetch all published posts or all posts (admin view)
```
Query params:
- admin=true: Get all posts including drafts
```

### POST /api/posts
Create a new post
```json
{
  "title": "Post Title",
  "slug": "post-slug",
  "excerpt": "Short summary",
  "content": [/* TipTap JSON content */]
}
```

### GET /api/posts/[id]
Get a post by ID

### GET /api/posts/by-slug/[slug]
Get a post by slug

### PUT /api/posts/[id]
Update a post
```json
{
  "title": "Updated Title",
  "published": true,
  "publishedAt": "2024-04-21T10:00:00Z"
}
```

### DELETE /api/posts/[id]
Delete a post

### POST /api/views
Increment view counter
```json
{
  "postId": "1"
}
```

### POST /api/likes
Toggle like on a post
```json
{
  "postId": "1",
  "userId": "user-session-id"
}
```

## Customization

### Change Blog Name
Edit `app/layout.tsx` and `components/navbar.tsx` to update the blog title.

### Customize Colors
Update the color tokens in `app/globals.css`:
- `--background`: Page background
- `--foreground`: Text color
- `--primary`: Primary accent color
- `--accent`: Highlight color

### Change Fonts
Modify font imports in `app/layout.tsx` and update `tailwind.config.ts`.

### Add Navigation Links
Edit `components/navbar.tsx` to add more navigation items.

## Future Enhancements

- [ ] Add Supabase PostgreSQL for scalable storage
- [ ] Implement full authentication for admin panel
- [ ] Add comments system
- [ ] Search functionality
- [ ] Tags and categories
- [ ] Reading time estimation
- [ ] Social sharing buttons
- [ ] Analytics dashboard
- [ ] Image optimization and uploads

## Data Migration

When ready to migrate from file-based storage to a database:

1. Install Prisma and create schema with Post, View, and Like tables
2. Create migration scripts
3. Update `/lib/blog-data.ts` to use Prisma client
4. No changes needed to API routes or components

## Deployment

Deploy to Vercel with one click:

```bash
vercel deploy
```

The project is optimized for Vercel with automatic function deployment and edge network caching.

## License

MIT - Feel free to use this template for your own blog!

## Author

iz4ru - Building on the web 🚀
