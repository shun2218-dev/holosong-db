export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HoloSongDB. Unofficial Fan Site.
          </p>
          <div className="text-xs text-gray-400">
            Created with Next.js & Neon
          </div>
        </div>
      </div>
    </footer>
  );
}