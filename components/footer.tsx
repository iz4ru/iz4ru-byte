export function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-8 bg-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 iz4ru.byte. Semua hak cipta terlindungi.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="https://instagram.com/tria.mr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://github.com/iz4ru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
