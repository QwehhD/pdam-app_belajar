import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans antialiased">
      <main className="max-w-3xl px-8 py-20 text-center">
        {/* Badge Sederhana */}
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50/50 px-3 py-1 text-sm font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-900/30 dark:text-sky-300 mb-8">
          Sistem Informasi Terpadu
        </div>

        {/* Heading yang Bersih */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-6">
          Perusahaan Daerah Air Minum
        </h1>

        {/* Subtext dengan Leading yang Nyaman */}
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-10">
          Selamat datang di portal manajemen PDAM. Kelola data pelanggan, 
          pantau distribusi, dan optimalkan layanan operasional dalam satu platform yang efisien.
        </p>

        {/* Action Button yang Solid */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="h-12 px-10 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white transition-all shadow-md hover:shadow-lg"
            asChild
          >
            <a href="/sign-in">
              Sign-In
            </a>
          </Button>
        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="absolute bottom-8 text-sm text-slate-400 dark:text-slate-600">
        &copy; 2026 PDAM Indonesia
      </footer>
    </div>
  );
}