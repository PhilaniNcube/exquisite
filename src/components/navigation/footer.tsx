import { Facebook, Instagram, Twitter } from "lucide-react"
import { cacheLife } from "next/cache"
import Link from "next/link"

async function getCurrentYear() {
  "use cache"
  return new Date().getFullYear()
}

export async function Footer() {
  "use cache"
  cacheLife('weeks')
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl font-bold mb-4">Exquisite Photography</h3>
            <p className="text-primary-foreground/80 leading-relaxed max-w-md">
              Capturing life&apos;s precious moments with artistry and passion. Professional photography services for all
              your special occasions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation-policy"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
          
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/70">
          <p>&copy; {await getCurrentYear()} Exquisite Photography. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
