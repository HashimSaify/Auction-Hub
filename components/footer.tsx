import Link from "next/link"
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold">AuctionHub</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              The premier online auction platform for unique and valuable items.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-base font-medium mb-2">Auctions</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auctions" className="text-muted-foreground hover:text-foreground">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/auctions?filter=featured" className="text-muted-foreground hover:text-foreground">
                  Featured Items
                </Link>
              </li>
              <li>
                <Link href="/auctions?filter=ending-soon" className="text-muted-foreground hover:text-foreground">
                  Ending Soon
                </Link>
              </li>
              <li>
                <Link href="/auctions?filter=new" className="text-muted-foreground hover:text-foreground">
                  Recently Added
                </Link>
              </li>
              <li>
                <Link href="/auctions/categories" className="text-muted-foreground hover:text-foreground">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium mb-2">Selling</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sell" className="text-muted-foreground hover:text-foreground">
                  Start Selling
                </Link>
              </li>
              <li>
                <Link href="/seller-guidelines" className="text-muted-foreground hover:text-foreground">
                  Seller Guidelines
                </Link>
              </li>
              <li>
                <Link href="/fees" className="text-muted-foreground hover:text-foreground">
                  Fees & Charges
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                  Shipping Options
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium mb-2">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium mb-2">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground"> {new Date().getFullYear()} AuctionHub. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
