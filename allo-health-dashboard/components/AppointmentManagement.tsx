"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight, Calendar, AlertCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { format, addDays, parseISO } from 'date-fns'
import BookAppointmentDialog from "./BookAppointmentDialog"
import CancelRescheduleDialog from "./CancelRescheduleDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from '@tanstack/react-query';
import { Doctor, DoctorSchedule, doctorService } from '@/services/doctorService';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { getNextAvailableDisplay } from "@/utils/dateUtils";
import { appointmentService } from '@/services/appointmentService';



export default function AppointmentManagement() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const maxDate = addDays(new Date(), 30)

  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentService.getAppointments({ status: 'BOOKED' }),
    select: (data) => data.filter(appointment => appointment.status === 'BOOKED')
  });

  const { data: apiDoctors = [], isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: doctorService.getDoctors
  });

  const doctors: Doctor[] = apiDoctors.map(d => ({
    ...d,
      specialization: d.specialization,
    status: d.schedules.length ? "Available" : "Off Duty",
    nextAvailable: "Now"
  }));

  const filteredDoctors = doctors.filter((doctor) =>
    (doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(search.toLowerCase())) &&
    (filter === "all" || doctor.schedules.some(schedule => schedule.slots.some(slot => slot.status === filter)))
  )

  const handleBookAppointment = async (doctorId: number, date: Date, time: string, patientName: string) => {
    try {
      await appointmentService.createAppointment({
        doctorId,
        patientName: patientName,
        appointmentDate: date.toISOString(),
        time
      });
      
      // Refresh appointments data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      toast({
        title: "Appointment Booked",
        description: `Appointment booked successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive"
      });
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await appointmentService.cancelAppointment(appointmentId);
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive"
      });
    }
  };

  const handleRescheduleAppointment = async (appointmentId: number, newDate: Date, newTime: string) => {
    try {
      await appointmentService.updateAppointment(appointmentId, {
        appointmentDate: newDate.toISOString(),
        time: newTime
      });
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Appointment Rescheduled",
        description: `Appointment rescheduled to ${format(newDate, 'MMM dd, yyyy')} at ${newTime}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule appointment",
        variant: "destructive"
      });
    }
  };

  if (isLoadingDoctors) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );  
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doctors"
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="off duty">Off Duty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No doctors found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find available doctors.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted p-4 rounded-lg space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <Badge
                      variant={(() => {
                        const now = new Date();
                        const currentTime = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
                        
                        const hasAvailableSlot = doctor.schedules.some(schedule => 
                          schedule.slots.some(slot => 
                            slot.status.toLowerCase() === "available" && slot.time >= currentTime
                          )
                        );

                        const hasBookedSlot = doctor.schedules.some(schedule =>
                          schedule.slots.some(slot =>
                            slot.status.toLowerCase() === "booked" && slot.time >= currentTime
                          )
                        );

                        return hasAvailableSlot ? "default" : hasBookedSlot ? "secondary" : "destructive";
                      })()}
                    >
                      {(() => {
                        const now = new Date();
                        const currentTime = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
                        
                        const hasAvailableSlot = doctor.schedules.some(schedule => 
                          schedule.slots.some(slot => 
                            slot.status.toLowerCase() === "available" && slot.time >= currentTime
                          )
                        );

                        const hasBookedSlot = doctor.schedules.some(schedule =>
                          schedule.slots.some(slot =>
                            slot.status.toLowerCase() === "booked" && slot.time >= currentTime
                          )
                        );

                        return hasAvailableSlot ? "Available" : hasBookedSlot ? "Busy" : "Off Duty";
                      })()}
                    </Badge>
                    <p className="text-sm text-gray-500 hidden sm:block">
                      Next available: {getNextAvailableDisplay(doctor.schedules)}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">View Schedule</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>{doctor.name}'s Schedule</DialogTitle>
                          <DialogDescription>Available time slots for the next 3 days</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="flex justify-between items-center mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentDate((prev) => addDays(prev, -1))}
                              disabled={currentDate <= new Date()}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous Day
                            </Button>
                            <span className="font-medium text-gray-900">
                              {format(currentDate, 'EEEE, MMM dd')}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentDate((prev) => addDays(prev, 1))}
                              disabled={currentDate >= maxDate}
                            >
                              Next Day
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {doctor.schedules.length === 0 ? (
                              <div className="col-span-2 text-center py-4">
                                <AlertCircle className="mx-auto h-6 w-6 text-muted-foreground" />
                                <p className="mt-2 text-sm text-gray-500">No schedule found for this doctor</p>
                              </div>
                            ) : (
                              doctor.schedules.map((schedule) => (
                                schedule.slots.map((slot) => (
                                  <BookAppointmentDialog
                                    key={slot.time}
                                    doctorId={doctor.id}
                                    date={currentDate.toISOString().split('T')[0]}
                                    time={slot.time}
                                    onBookAppointment={handleBookAppointment}
                                    doctors={doctors}
                                  >
                                    <Button variant="outline" size="sm" className="w-full">
                                      {slot.time}
                                    </Button>
                                  </BookAppointmentDialog>
                                ))
                              ))
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booked Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No appointments booked</h3>
              <p className="mt-1 text-sm text-gray-500">Book an appointment to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const doctor = doctors.find(d => d.id === appointment.doctor.id)
                return (
                  <div key={appointment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted p-4 rounded-lg space-y-2 sm:space-y-0">
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.patient.name}</h3>
                      <p className="text-sm text-gray-500">
                        With {doctor?.name} on {format(appointment.appointmentDate, 'MMM dd, yyyy')} at {appointment.time}
                      </p>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <CancelRescheduleDialog
                        appointment={appointment}
                        onCancel={handleCancelAppointment}
                        onReschedule={handleRescheduleAppointment}
                      >
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">Manage</Button>
                      </CancelRescheduleDialog>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <BookAppointmentDialog
        doctors={doctors}
        onBookAppointment={handleBookAppointment}
      >
        <Button className="w-full" size="lg">
          <Calendar className="mr-2 h-4 w-4" /> Book Appointment
        </Button>
      </BookAppointmentDialog>
    </div>
  )
}

