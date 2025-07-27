import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format, parseISO } from 'date-fns'
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Doctor } from "@/services/doctorService"



type BookAppointmentDialogProps = {
  children: React.ReactNode
  doctorId?: number
  date?: string
  time?: string
  onBookAppointment: (doctorId: number, date: Date, time: string, patientName: string) => void
  doctors: Doctor[]
}

export default function BookAppointmentDialog({ children, doctorId: initialDoctorId, date: initialDate, time: initialTime, onBookAppointment, doctors }: BookAppointmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [patientName, setPatientName] = useState("")
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId?.toString() || "")
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setSelectedDoctorId(initialDoctorId?.toString() || "")
      setSelectedDate(initialDate || "")
      setSelectedTime(initialTime || "")
    }
  }, [open, initialDoctorId, initialDate, initialTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!patientName.trim() || !selectedDoctorId || !selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    onBookAppointment(Number(selectedDoctorId), parseISO(selectedDate), selectedTime, patientName)
    setOpen(false)
    setPatientName("")
    setSelectedDoctorId("")
    setSelectedDate("")
    setSelectedTime("")
    setIsSubmitting(false)
  }

  const selectedDoctor = doctors.find(d => d.id.toString() === selectedDoctorId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            {selectedDoctor && selectedDate && selectedTime
              ? `Book an appointment with ${selectedDoctor.name} on ${format(parseISO(selectedDate), 'MMMM d, yyyy')} at ${selectedTime}`
              : "Fill in the details to book an appointment"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="col-span-3"
                placeholder="Enter patient name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctor" className="text-right">
                Doctor
              </Label>
              <Select
                value={selectedDoctorId}
                onValueChange={setSelectedDoctorId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

