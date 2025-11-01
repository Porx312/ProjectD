import { Flag, Gauge} from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="relative mt-auto border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      {/* Glow line */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Branding */}
          <div className="flex items-center gap-3 text-zinc-400">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-red-500" />
              <span className="text-zinc-200 font-semibold">
                ProjectD
              </span>
            </div>
            <span className="hidden md:inline text-zinc-500">|</span>
            <p className="text-sm text-zinc-500 italic">
              Driven to improve every lap 🏁
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/support"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Support
            </Link>
            <Link
              href="/privacy"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Terms
            </Link>
          
          </div>
        </div>

        {/* Divider line */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        {/* Bottom note */}
        <div className="flex items-center justify-center mt-6 text-xs text-zinc-600">
          <Flag className="w-3 h-3 mr-1 text-red-500" />
          <p>
            © {new Date().getFullYear()} ProjectD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
