"use client"

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PasswordInput } from '@/components/PasswordInput'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy } from 'lucide-react'

const TestCredentialsContent = () => {
  const { toast } = useToast()

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
      duration: 2000,
    })
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Staff Account</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Staff ID:</Label>
              <code className="relative rounded bg-muted px-3 py-1 font-mono text-sm">12345</code>
            </div>
            <div className="flex items-center justify-between">
              <Label>Password:</Label>
              <Button 
                variant="outline" 
                size="sm"
                className="font-mono text-sm"
                onClick={() => copyToClipboard("pes@pes", "Staff password")}
              >
                <span className="mr-2">••••••••</span>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-lg">Admin Account</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Staff ID:</Label>
              <code className="relative rounded bg-muted px-3 py-1 font-mono text-sm">67890</code>
            </div>
            <div className="flex items-center justify-between">
              <Label>Password:</Label>
              <Button 
                variant="outline" 
                size="sm"
                className="font-mono text-sm"
                onClick={() => copyToClipboard("admin@pes", "Admin password")}
              >
                <span className="mr-2">••••••••</span>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const [staffId, setStaffId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const [showCredentials, setShowCredentials] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(staffId, password)
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2f1e51]">
      <Card className="w-[350px] bg-white">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="https://cdn.prod.website-files.com/61a4b9739ac56e51853f7bb2/63104b02a54e193fc31e5261_Allo%20Logo.webp"
              alt="Allo Health Clinic Logo"
              width={100}
              height={40}
            />
          </div>
          <CardTitle className="text-2xl text-black">Login</CardTitle>
          <CardDescription className="text-gray-600">Enter your staff ID and password to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="staffId" className="text-black">Staff ID</Label>
            <Input 
              id="staffId" 
              type="text" 
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="border-gray-300 bg-white text-black"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-black">Password</Label>
            <PasswordInput 
              id="password"
              value={password}
              onChange={setPassword}
              className="bg-white text-black"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            className="w-full bg-black text-white hover:bg-gray-800" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
            <DialogTrigger asChild>
              <Button variant="link" className="mt-2 text-sm text-gray-600 hover:text-gray-800">
                Get test credentials
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Credentials</DialogTitle>
                <DialogDescription>
                  Use these credentials to test the application. Click on the password to copy.
                </DialogDescription>
              </DialogHeader>
              <TestCredentialsContent />
            </DialogContent>
          </Dialog>
          <p className="mt-2 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

