import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from '@tanstack/react-query'
import { appointmentService } from '@/services/appointmentService'
import { format } from 'date-fns'
import { Search, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const { data: allAppointments = [], isLoading } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: () => appointmentService.getAllAppointments()
  });

  const filteredAppointments = allAppointments.filter((appointment) =>
    (appointment.patient.name.toLowerCase().includes(search.toLowerCase()) ||
     appointment.doctor.name.toLowerCase().includes(search.toLowerCase())) &&
    (filter === "all" || appointment.status === filter)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Appointments Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by patient or doctor name"
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="BOOKED">Booked</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-10">
            <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted p-4 rounded-lg space-y-2 sm:space-y-0">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Patient: {appointment.patient.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Doctor: {appointment.doctor.name} ({appointment.doctor.specialization})
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')} at {appointment.time}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {appointment.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 