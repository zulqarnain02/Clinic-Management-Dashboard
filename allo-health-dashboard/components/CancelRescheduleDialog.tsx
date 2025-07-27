import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays, parseISO } from 'date-fns'
import { useToast } from "@/hooks/use-toast"
import { Appointment } from "@/services/appointmentService"
import { useQueryClient } from "@tanstack/react-query"

type CancelRescheduleDialogProps = {
  children: React.ReactNode
  appointment: Appointment
  onCancel: (appointmentId: number) => void
  onReschedule: (appointmentId: number, newDate: Date, newTime: string) => void
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
]

export default function CancelRescheduleDialog({ children, appointment, onCancel, onReschedule }: CancelRescheduleDialogProps) {
  const [open, setOpen] = useState(false)
  const [newDate, setNewDate] = useState<string | null>(null)
  const [newTime, setNewTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleCancel = async () => {
    setIsSubmitting(true)
    try {
      await onCancel(appointment.id)
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive"
      })
    }
    setIsSubmitting(false)
  }

  const handleReschedule = async () => {
    if (!newDate || !newTime) return
    setIsSubmitting(true)
    try {
      await onReschedule(appointment.id, parseISO(newDate), newTime)
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule appointment",
        variant: "destructive"
      })
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Appointment</DialogTitle>
          <DialogDescription>
            Cancel or reschedule your appointment on {format(appointment.appointmentDate, 'MMMM d, yyyy')} at {appointment.time}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Select value={newDate || ""} onValueChange={setNewDate}>
              <SelectTrigger className="col-span-4 bg-white text-black border border-input">
                <SelectValue placeholder="Select new date" className="text-black">
                  {newDate ? format(parseISO(newDate), 'EEEE, MMM dd') : "Select new date"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                  const date = addDays(new Date(), dayOffset)
                  return (
                    <SelectItem 
                      key={dayOffset} 
                      value={date.toISOString()}
                      className="text-black hover:bg-gray-100"
                    >
                      {format(date, 'EEEE, MMM dd')}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Select onValueChange={setNewTime}>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Select new time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCancel} variant="destructive" disabled={isSubmitting}>
            {isSubmitting ? "Cancelling..." : "Cancel Appointment"}
          </Button>
          <Button onClick={handleReschedule} disabled={!newDate || !newTime || isSubmitting}>
            {isSubmitting ? "Rescheduling..." : "Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

