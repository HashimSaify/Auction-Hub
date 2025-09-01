"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Info, Upload, Loader2, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Form validation schema
const auctionFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  startingPrice: z.string().min(1, "Starting price is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Starting price must be a positive number"
  ),
  durationValue: z.string().min(1, "Duration is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Duration must be a positive number"
  ),
  durationUnit: z.string().min(1, "Unit is required"),
  images: z.array(z.any()).min(1, "At least one image is required"),
})

// Categories for dropdown
const categories = [
  "Watches & Jewelry",
  "Electronics",
  "Vehicles",
  "Collectibles",
  "Art",
  "Fashion",
  "Furniture",
  "Books & Media",
  "Music",
  "Cameras & Photo",
  "Business & Industrial",
  "Food & Beverages",
]

const conditions = [
  "New",
  "Like New",
  "Very Good",
  "Good",
  "Acceptable",
]

const timeUnits = [
  { value: "seconds", label: "Seconds", multiplier: 1000 },
  { value: "minutes", label: "Minutes", multiplier: 60 * 1000 },
  { value: "hours", label: "Hours", multiplier: 60 * 60 * 1000 },
  { value: "days", label: "Days", multiplier: 24 * 60 * 60 * 1000 },
  { value: "months", label: "Months", multiplier: 30 * 24 * 60 * 60 * 1000 }, // Approximate month
]

export default function SellPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<z.infer<typeof auctionFormSchema>>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      condition: "",
      startingPrice: "",
      durationValue: "",
      durationUnit: "minutes",
      images: [],
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      setSubmitError("Some files were rejected. Please only upload images (JPG, PNG, WebP) under 5MB.")
      return
    }

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])
    
    const updatedFiles = [...imageFiles, ...validFiles]
    setImageFiles(updatedFiles)
    form.setValue('images', updatedFiles, { shouldValidate: true })
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index])
    
    const updatedFiles = imageFiles.filter((_, i) => i !== index)
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index)
    
    setImageFiles(updatedFiles)
    setImagePreviews(updatedPreviews)
    form.setValue('images', updatedFiles, { shouldValidate: true })
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof auctionFormSchema>) => {
    try {
      if (!user?.id) {
        setSubmitError("You must be logged in to create an auction")
        return
      }

      setIsSubmitting(true)
      setSubmitError("")

      // Ensure category is always lowercase before sending to backend
      values.category = values.category.toLowerCase();

      // Convert duration to milliseconds
      const selectedUnit = timeUnits.find(unit => unit.value === values.durationUnit)
      const durationMs = Number(values.durationValue) * (selectedUnit?.multiplier || 60 * 1000)
      const durationDays = durationMs / (24 * 60 * 60 * 1000)

      // Create FormData and append files
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('category', values.category)
      formData.append('condition', values.condition)
      formData.append('startingPrice', values.startingPrice)
      // Send as days (float) to backend for compatibility
      formData.append('duration', durationDays.toString())
      imageFiles.forEach((file) => {
        formData.append(`images`, file)
      })

      const response = await fetch("/api/auctions", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create auction")
      }

      router.push("/auctions")
      router.refresh()
    } catch (error: any) {
      console.error("Error creating auction:", error)
      setSubmitError(error.message || "Failed to create auction. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Redirect to login if not authenticated
  if (authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/signin?redirect=/sell")
    return null
  }

  return (
    <div className="container max-w-5xl px-4 py-10 md:px-8 md:py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Main Form Section */}
      <div className="lg:col-span-2 space-y-10">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">1</span>
            <span className="ml-2 font-semibold text-primary">Details</span>
          </div>
          <span className="mx-2 text-muted-foreground">→</span>
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-primary font-bold">2</span>
            <span className="ml-2 text-muted-foreground">Pricing</span>
          </div>
          <span className="mx-2 text-muted-foreground">→</span>
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-primary font-bold">3</span>
            <span className="ml-2 text-muted-foreground">Duration</span>
          </div>
          <span className="mx-2 text-muted-foreground">→</span>
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-primary font-bold">4</span>
            <span className="ml-2 text-muted-foreground">Images</span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* Item Details Section */}
            <Card className="border border-border bg-muted/60">
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>Describe your item for potential buyers.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item title" {...field} />
                      </FormControl>
                      <FormDescription>A clear, descriptive title for your item</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Choose the most relevant category</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your item in detail" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormDescription>Include condition, features, and any important details</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="condition" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Choose the condition that best describes your item</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
            {/* Pricing Section */}
            <Card className="border border-border bg-muted/60">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set your starting price.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormField control={form.control} name="startingPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" min="0" step="1" {...field} />
                    </FormControl>
                    <FormDescription>Set a competitive starting price in ₹ (INR)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
            {/* Auction Duration Section */}
            <Card className="border border-border bg-muted/60">
              <CardHeader>
                <CardTitle>Auction Duration</CardTitle>
                <CardDescription>How long should your auction run?</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex gap-2 items-center">
                  <FormField control={form.control} name="durationValue" render={({ field }) => (
                    <FormItem className="w-28">
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" placeholder="Enter duration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="durationUnit" render={({ field }) => (
                    <FormItem className="w-40">
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeUnits.map(unit => (
                              <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormDescription>Set how long your auction should run (e.g., 5 minutes, 2 hours, 10 days, etc.)</FormDescription>
              </CardContent>
            </Card>
            {/* Images Section */}
            <Card className="border border-border bg-muted/60">
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Upload high-quality images to attract more buyers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square group">
                      <Image src={preview} alt={`Preview ${index + 1}`} fill className="rounded-lg object-cover border border-border" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90 group-hover:scale-110 transition-transform">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-primary/40 hover:border-primary/70 bg-background transition-colors">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-primary" />
                      <span className="mt-2 block text-sm text-muted-foreground">Upload Images</span>
                    </div>
                  </label>
                </div>
                <FormDescription>Upload images of your item (at least one required)</FormDescription>
                <FormMessage />
              </CardContent>
            </Card>
            {/* Error and Submit Button */}
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end">
              <Button type="submit" size="lg" className="px-8 py-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Auction...
                  </>
                ) : (
                  "Create Auction"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      {/* Sidebar with Tips and Live Preview */}
      <aside className="hidden lg:block space-y-8">
        {/* Selling Tips */}
        <div className="bg-muted/80 border border-border rounded-xl p-6 shadow-sm animate-fade-in">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Info className="w-5 h-5 text-primary" /> Selling Tips</h3>
          <ul className="list-disc pl-5 text-muted-foreground space-y-2 text-sm">
            <li>Use clear, high-quality images for best results.</li>
            <li>Write a detailed, honest description.</li>
            <li>Choose the most relevant category and condition.</li>
            <li>Set a competitive starting price to attract bidders.</li>
            <li>Respond promptly to bidder questions.</li>
          </ul>
        </div>
        {/* Live Preview */}
        <div className="bg-background border border-border rounded-xl p-4 shadow-sm animate-fade-in">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><Upload className="w-5 h-5 text-primary" /> Live Preview</h3>
          <div className="flex flex-col items-center">
            {imagePreviews[0] ? (
              <Image src={imagePreviews[0]} alt="Preview" width={120} height={120} className="rounded-lg object-cover border border-border mb-3" />
            ) : (
              <div className="w-28 h-28 rounded-lg bg-muted flex items-center justify-center mb-3 text-muted-foreground">No Image</div>
            )}
            <div className="text-lg font-semibold text-foreground truncate w-full text-center">{form.watch("title") || "Item Title"}</div>
            <div className="text-sm text-muted-foreground text-center">{form.watch("category") || "Category"}</div>
            <div className="text-primary font-bold text-center mt-1">₹{form.watch("startingPrice") || "0"}</div>
          </div>
        </div>
      </aside>
    </div>
  )
}
