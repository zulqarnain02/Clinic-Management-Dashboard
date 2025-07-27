"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QueueManagement from "@/components/QueueManagement"
import AppointmentManagement from "@/components/AppointmentManagement"
import AdminDashboard from "@/components/AdminDashboard"
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Role, useAuth } from '../contexts/AuthContext'
import Image from 'next/image'


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("queue")
  const { setTheme, theme } = useTheme()
  const { user, logout } = useAuth()
  const isAdmin = user?.role === Role.ADMIN

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
                <Image
                  src="https://cdn.prod.website-files.com/61a4b9739ac56e51853f7bb2/63104b02a54e193fc31e5261_Allo%20Logo.webp"
                  alt="Allo Health Clinic Logo"
                  width={80}
                  height={40}
                  className="h-8 w-auto"
                />
                <h1 className="ml-4 text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  Allo Health Clinic
                </h1>
              </div>
              <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-end">
                <span className="text-gray-700 text-sm sm:text-base">Welcome, {user?.name}</span>

                <Button size="sm" onClick={logout}>Logout</Button>
                <div className="flex items-center gap-2">
                  
                  <Button
                    variant="ghost" 
                    size="icon"
                    asChild
                  >
                    <a href="https://github.com/zulqarnain02/" target="_blank" rel="noopener noreferrer">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      <span className="sr-only">GitHub repository</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full h-auto flex flex-col sm:flex-row sm:h-10 space-y-2 sm:space-y-0">
              <TabsTrigger 
                value="queue" 
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base data-[state=active]:shadow-none"
              >
                Queue Management
              </TabsTrigger>
              <TabsTrigger 
                value="appointments" 
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base data-[state=active]:shadow-none"
              >
                Appointment Management
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger 
                  value="admin" 
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base data-[state=active]:shadow-none"
                >
                  Admin Overview
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="queue" className="space-y-4 mt-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <QueueManagement />
              </div>
            </TabsContent>
            <TabsContent value="appointments" className="space-y-4 mt-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <AppointmentManagement />
              </div>
            </TabsContent>
            {isAdmin && (
              <TabsContent value="admin" className="space-y-4 mt-2">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <AdminDashboard />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}

