"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, ShoppingBag, User, Heart, LogIn, Sun, Moon, Menu, Package, Gavel, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const { user, isAuthenticated, signOut } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [watchlistCount, setWatchlistCount] = useState(0)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check if we're on the auth pages
  const isAuthPage = pathname?.includes("/auth/")

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/notifications?unread=1")
        .then(res => res.json())
        .then(data => setUnreadCount(data.count || 0))
        .catch(() => setUnreadCount(0));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/user/watchlist")
        .then(res => res.json())
        .then(data => setWatchlistCount((data.watchlist || []).length))
        .catch(() => setWatchlistCount(0));
      const handler = () => {
        fetch("/api/user/watchlist")
          .then(res => res.json())
          .then(data => setWatchlistCount((data.watchlist || []).length))
          .catch(() => setWatchlistCount(0));
      };
      window.addEventListener("watchlist-updated", handler);
      return () => window.removeEventListener("watchlist-updated", handler);
    }
  }, [isAuthenticated]);

  const routes = [
    { href: "/", label: "Home" },
    { href: "/auctions", label: "Auctions" },
    { href: "/categories", label: "Categories" },
    { href: "/sell", label: "Sell" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-4 mt-8">
              <Link href="/" className="flex items-center gap-2 px-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">AuctionHub</span>
              </Link>

              <nav className="flex flex-col gap-1 mt-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href === "/categories" ? "/auctions/categories" : route.href}
                    className={`flex items-center gap-2 px-2 py-2 text-base rounded-md hover:bg-muted ${
                      pathname === route.href || (route.href === "/categories" && pathname.startsWith("/auctions/categories")) ? "font-medium text-primary bg-primary/10" : "text-muted-foreground"
                    }`}
                  >
                    {route.href === "/" && <ShoppingBag className="h-4 w-4" />}
                    {route.href === "/auctions" && <Gavel className="h-4 w-4" />}
                    {route.href === "/sell" && <Package className="h-4 w-4" />}
                    {route.label}
                  </Link>
                ))}
              </nav>

              {isAuthenticated ? (
                <div className="mt-auto border-t pt-4">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar>
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="mt-auto border-t pt-4 flex flex-col gap-2">
                  <Link href="/auth/signin">
                    <Button variant="default" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="outline" className="w-full">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">AuctionHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href === "/categories" ? "/auctions/categories" : route.href}
              className={`transition-colors hover:text-primary ${
                pathname === route.href || (route.href === "/categories" && pathname.startsWith("/auctions/categories")) ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center ml-auto gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {!isAuthPage && (
            <>
              {isAuthenticated ? (
                <>
                  <Link href="/notifications">
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground">
                          {unreadCount}
                        </Badge>
                      )}
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </Link>

                  <Link href="/watchlist">
                    <Button variant="ghost" size="icon" className="relative">
                      <Heart className="h-5 w-5" />
                      {watchlistCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground">
                          {watchlistCount}
                        </Badge>
                      )}
                      <span className="sr-only">Watchlist</span>
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {user?.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer">
                              <Gavel className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="default" size="sm" className="gap-1">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
