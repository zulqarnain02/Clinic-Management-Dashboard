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

export default function RegisterPage() {
  const [staffId, setStaffId] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(staffId, password)
      toast({
        title: "Registration Successful",
        description: "Your account has been created.",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      })
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
          <CardTitle className="text-2xl text-black">Register</CardTitle>
          <CardDescription className="text-gray-600">Create a new account to access the dashboard.</CardDescription>
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
          <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={handleSubmit}>Register</Button>
          <p className="mt-2 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

