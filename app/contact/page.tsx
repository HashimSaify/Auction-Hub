"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to send the message
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful submission
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col space-y-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-2">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
          <p className="max-w-3xl text-xl text-muted-foreground">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <Alert className="bg-success/20 text-success border-success">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Thank you for your message! We'll get back to you as soon as possible.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.subject ? "border-destructive" : ""}
                    />
                    {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Get in Touch</h2>
              <p className="mt-2 text-muted-foreground">
                We're here to help with any questions or concerns you may have about AuctionHub.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-muted-foreground">For general inquiries:</p>
                  <a href="mailto:info@auctionhub.com" className="text-primary hover:underline">
                    info@auctionhub.com
                  </a>
                  <p className="text-muted-foreground mt-2">For support:</p>
                  <a href="mailto:support@auctionhub.com" className="text-primary hover:underline">
                    support@auctionhub.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Call Us</h3>
                  <p className="text-muted-foreground">Customer Service:</p>
                  <a href="tel:+91 8001234567" className="text-primary hover:underline">
                    +91 8001234567
                  </a>
                  <p className="text-muted-foreground mt-2">Business Hours:</p>
                  <p>Monday - Friday: 9am - 5pm IST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Visit Us</h3>
                  <p className="text-muted-foreground">Our Headquarters:</p>
                  <address className="not-italic">
                    243 Auction Street
                    <br />
                    Indore, MP 456789
                    <br />
                    India
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-2 text-muted-foreground">
              Find answers to common questions about AuctionHub and our services.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                question: "How do I create an account?",
                answer:
                  "Creating an account is easy! Click on the 'Sign Up' button in the top right corner of the page and follow the instructions to set up your account.",
              },
              {
                question: "How do I place a bid?",
                answer:
                  "To place a bid, navigate to the auction page of the item you're interested in, enter your bid amount, and click 'Place Bid'. Make sure you're signed in first!",
              },
              {
                question: "What happens if I win an auction?",
                answer:
                  "If you win an auction, you'll receive an email notification with instructions on how to complete your purchase and arrange shipping with the seller.",
              },
              {
                question: "How do I list an item for auction?",
                answer:
                  "To list an item, click on the 'Sell' link in the navigation menu. You'll need to provide details about your item, set a starting price, and upload photos.",
              },
              {
                question: "What fees does AuctionHub charge?",
                answer:
                  "AuctionHub charges a 10% fee on the final sale price for sellers. There are no fees for buyers to participate in auctions.",
              },
              {
                question: "How is shipping handled?",
                answer:
                  "Shipping arrangements are made between the buyer and seller after the auction ends. Sellers typically specify shipping options and costs in the item listing.",
              },
            ].map((faq, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
