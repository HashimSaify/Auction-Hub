"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Clock } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for auctions with MongoDB-compatible IDs
const mockAuctions = [
  {
    _id: "65f1a1234567890123456789",
    title: "Vintage Rolex Submariner",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop",
    currentBid: 4250,
    bids: 18,
    endTime: new Date(Date.now() + 86400000 * 2.5), // 2.5 days from now
    category: "watches & jewelry",
  },
  {
    _id: "65f1a2234567890123456789",
    title: "Outdoor Patio Furniture Set",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop",
    currentBid: 14000,
    bids: 0,
    endTime: new Date(Date.now() + 86400000 * 10),
    category: "furniture",
  },
  {
    _id: "65f1a3234567890123456789",
    title: "Canon EOS 90D DSLR Camera",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    currentBid: 58000,
    bids: 0,
    endTime: new Date(Date.now() + 86400000 * 13),
    category: "cameras & photo",
  },
  {
    _id: "65f1a4234567890123456789",
    title: "Heavy Duty Drill Machine",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=600&auto=format&fit=crop",
    currentBid: 9500,
    bids: 0,
    endTime: new Date(Date.now() + 86400000 * 14),
    category: "business & industrial",
  },
  {
    _id: "65f1a5234567890123456789",
    title: "Premium Chocolate Hamper",
    image: "https://images.unsplash.com/photo-1519864600265-abb23843ff58?q=80&w=600&auto=format&fit=crop",
    currentBid: 2000,
    bids: 0,
    endTime: new Date(Date.now() + 86400000 * 15),
    category: "food & beverages",
  },
]

export default function CategoryPage() {
  const { id } = useParams()
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: { text: string; isEndingSoon: boolean } }>({})
  const [auctions, setAuctions] = useState([])

  useEffect(() => {
    // In a real app, this would fetch from the API
    // For now, filter mock data based on category
    const filteredAuctions = mockAuctions.filter((auction) => auction.category === id)
    setAuctions(filteredAuctions)
  }, [id])

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
            newTimeLeft[auction._id] = {
              text: `${days}d ${hours}h`,
              isEndingSoon,
            }
          } else if (hours > 0) {
            newTimeLeft[auction._id] = {
              text: `${hours}h ${minutes}m`,
              isEndingSoon,
            }
          } else {
            newTimeLeft[auction._id] = {
              text: `${minutes}m`,
              isEndingSoon,
            }
          }
        } else {
          newTimeLeft[auction._id] = {
            text: "Ended",
            isEndingSoon: false,
          }
        }
      })

      setTimeLeft(newTimeLeft)
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <Link href={`/auctions/${auction._id}`} key={auction._id} className="group">
          <Card className="overflow-hidden transition-all hover:shadow-md auction-card">
            <CardHeader className="p-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                {timeLeft[auction._id]?.isEndingSoon && (
                  <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
                    Ending Soon
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-medium truncate">{auction.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="font-bold">₹{auction.currentBid.toLocaleString()}</p>
                <div
                  className={`flex items-center ${timeLeft[auction._id]?.isEndingSoon ? "countdown ending-soon" : "countdown"}`}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{timeLeft[auction._id]?.text || "Loading..."}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center text-sm">
              <p className="text-sm text-muted-foreground">{auction.bids} bids</p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}