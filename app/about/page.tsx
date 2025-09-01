import { ShoppingBag, Award, Shield, Clock, CreditCard, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col space-y-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-2">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About AuctionHub</h1>
          <p className="max-w-3xl text-xl text-muted-foreground">
            The premier online auction platform connecting buyers and sellers from around the world.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
            <p className="text-lg text-muted-foreground">
              AuctionHub was founded in 2025 with a simple mission: to create a trusted marketplace where people can buy and
              sell unique items through a fair and transparent bidding process, with a focus on sustainability and community building.
            </p>
            <p className="text-lg text-muted-foreground">
              What started as a small platform for collectibles has grown into a global marketplace featuring everything
              from vintage watches and rare books to electronics and art. We're proud to have facilitated millions of
              successful transactions and to have built a community of passionate buyers and sellers.
            </p>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop"
              alt="Team working together"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">How AuctionHub Works</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              Our platform is designed to be simple, secure, and fair for everyone.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-3 p-6 bg-card rounded-lg border transition-all hover:shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up for free to start browsing auctions or listing your own items for sale.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-6 bg-card rounded-lg border transition-all hover:shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary/10 text-secondary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Place Bids</h3>
              <p className="text-muted-foreground">
                Find items you love and place bids. Our system will automatically bid up to your maximum amount.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-6 bg-card rounded-lg border transition-all hover:shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 text-accent">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Win & Pay</h3>
              <p className="text-muted-foreground">
                If you're the highest bidder when the auction ends, you'll be notified to complete your purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose AuctionHub</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              We're committed to providing the best auction experience possible.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex space-x-4 p-6 bg-card rounded-lg border transition-all hover:shadow-md">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Buyer Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Our buyer protection program ensures you get what you paid for or your money back.
                </p>
              </div>
            </div>

            <div className="flex space-x-4 p-6 bg-card rounded-lg border transition-all hover:shadow-md">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold">Verified Sellers</h3>
                <p className="text-sm text-muted-foreground">
                  We verify our sellers to ensure you're dealing with legitimate businesses and individuals.
                </p>
              </div>
            </div>

            <div className="flex space-x-4 p-6 bg-card rounded-lg border transition-all hover:shadow-md">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold">Real-Time Bidding</h3>
                <p className="text-sm text-muted-foreground">
                  Our platform updates in real-time so you always know where you stand in an auction.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-muted rounded-lg p-8 text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Start Bidding?</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Join thousands of users and find unique items at great prices.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="/auth/signup"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Create Account
            </a>
            <a
              href="/auctions"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Browse Auctions
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
