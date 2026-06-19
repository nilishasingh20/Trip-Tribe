import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-ocean-600 text-sm shadow-sm"
            aria-hidden
          >
            🌍
          </span>
          <span className="text-base font-bold tracking-tight text-stone-900 group-hover:text-ocean-700">
            Trip Tribe
          </span>
        </Link>
        <Link
          href="/"
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
        >
          Home
        </Link>
      </div>
    </header>
  );
}
