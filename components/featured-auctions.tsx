"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for featured auctions with realistic images
const mockAuctions = [
  {
    id: "1",
    title: "Vintage Rolex Submariner",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop",
    currentBid: 4250,
    bids: 18,
    endTime: new Date(Date.now() + 86400000 * 2.5), // 2.5 days from now
    category: "Watches",
  },
  {
    id: "2",
    title: "Apple MacBook Pro M2",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    currentBid: 1350,
    bids: 24,
    endTime: new Date(Date.now() + 86400000 * 1.2), // 1.2 days from now
    category: "Electronics",
  },
  {
    id: "3",
    title: "Antique Wooden Desk",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop",
    currentBid: 575,
    bids: 9,
    endTime: new Date(Date.now() + 86400000 * 3), // 3 days from now
    category: "Furniture",
  },
  {
    id: "4",
    title: "Diamond Engagement Ring",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
    currentBid: 2800,
    bids: 12,
    endTime: new Date(Date.now() + 86400000 * 0.5), // 0.5 days from now
    category: "Jewelry",
  },
]

export default function FeaturedAuctions() {
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: { text: string; isEndingSoon: boolean } }>({})

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const newTimeLeft: { [key: string]: { text: string; isEndingSoon: boolean } } = {}

      mockAuctions.forEach((auction) => {
        const difference = auction.endTime.getTime() - now.getTime()
        const isEndingSoon = difference < 86400000 // Less than 24 hours

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

          if (days > 0) {
            newTimeLeft[auction.id] = {
              text: `${days}d ${hours}h`,
              isEndingSoon,
            }
          } else if (hours > 0) {
            newTimeLeft[auction.id] = {
              text: `${hours}h ${minutes}m`,
              isEndingSoon,
            }
          } else {
            newTimeLeft[auction.id] = {
              text: `${minutes}m`,
              isEndingSoon,
            }
          }
        } else {
          newTimeLeft[auction.id] = {
            text: "Ended",
            isEndingSoon: false,
          }
        }
      })

      setTimeLeft(newTimeLeft)
    }, 60000) // Update every minute

    // Initial calculation
    const now = new Date()
    const initialTimeLeft: { [key: string]: { text: string; isEndingSoon: boolean } } = {}

    mockAuctions.forEach((auction) => {
      const difference = auction.endTime.getTime() - now.getTime()
      const isEndingSoon = difference < 86400000 // Less than 24 hours

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

        if (days > 0) {
          initialTimeLeft[auction.id] = {
            text: `${days}d ${hours}h`,
            isEndingSoon,
          }
        } else if (hours > 0) {
          initialTimeLeft[auction.id] = {
            text: `${hours}h ${minutes}m`,
            isEndingSoon,
          }
        } else {
          initialTimeLeft[auction.id] = {
            text: `${minutes}m`,
            isEndingSoon,
          }
        }
      } else {
        initialTimeLeft[auction.id] = {
          text: "Ended",
          isEndingSoon: false,
        }
      }
    })

    setTimeLeft(initialTimeLeft)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {mockAuctions.map((auction) => (
        <Link href={`/auctions/${auction.id}`} key={auction.id} className="group">
          <Card className="overflow-hidden transition-all hover:shadow-md auction-card">
            <CardHeader className="p-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/70 category-badge">
                  {auction.category}
                </Badge>
                {timeLeft[auction.id]?.isEndingSoon && (
                  <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">Ending Soon</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg truncate">{auction.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Current Bid</p>
                  <p className="font-bold">${auction.currentBid.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{auction.bids} bids</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center text-sm">
              <div
                className={`flex items-center ${
                  timeLeft[auction.id]?.isEndingSoon ? "countdown ending-soon" : "countdown"
                }`}
              >
                <Clock className="h-4 w-4 mr-1" />
                <span>{timeLeft[auction.id]?.text || "Loading..."}</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </>
  )
}
