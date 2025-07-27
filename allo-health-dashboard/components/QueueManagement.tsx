import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, Search, UserPlus, X, AlertCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { queueService } from "@/services/queueService"
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Patient = {
  id: number
  name: string
  age: number
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  status: "WAITING" | "WITH_DOCTOR" | "COMPLETED"
  arrivalTime: string
  estimatedWait: string
  priority: "NORMAL" | "URGENT"
  queueNumber: number
  mobileNumber: string
}

export default function QueueManagement() {
  const queryClient = useQueryClient()
  const { data: queueData, isLoading, error } = useQuery({
    queryKey: ['queue'],
    queryFn: queueService.getQueue,
  })

  // Convert API response to our Patient type
  const patients: Patient[] = queueData?.map((item: any) => ({
    id: item.id,
    name: item.patient.name,
    age: item.patient.age,
    gender: item.patient.gender,
    status: item.status,
    arrivalTime: new Date(item.arrived_at).toLocaleTimeString(),
    estimatedWait: "15 min",
    priority: item.priority,
    queueNumber: item.queueNumber,
    mobileNumber: item.patient.phone_number || ''
  })) || []
  // Prefetch queue data when component mounts
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['queue'],
      queryFn: queueService.getQueue,
    })
  }, [queryClient])

  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const filteredPatients = patients.filter(
    (patient) =>
      (filter === "All" || patient.status === filter) &&
      patient.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleStatusChange = async (patientId: number, newStatus: Patient["status"]) => {
    try {
      await queueService.updateQueue(patientId, { status: newStatus});
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      toast({
        title: "Status Updated",
        description: `Patient status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update patient status",
        variant: "destructive",
      });
    }
  };

  const handlePriorityChange = async (patientId: number, newPriority: Patient["priority"]) => {
    try {
      await queueService.updateQueue(patientId, { priority: newPriority });
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      toast({
        title: "Priority Updated",
        description: `Patient priority changed to ${newPriority}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update patient priority",
        variant: "destructive",
      });
    }
  };

  const handleRemovePatient = async (patientId: number) => {
    try {
      await queueService.removeFromQueue(patientId);
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      toast({
        title: "Patient Removed",
        description: "Patient has been removed from the queue",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove patient from queue",
        variant: "destructive",
      });
    }
  };

  const handleAddPatient = async (
    name: string, 
    age: number,
    gender: 'MALE' | 'FEMALE' | 'OTHER',
    mobileNumber: string,
    priority: "NORMAL" | "URGENT"
  ) => {
    try {
      await queueService.addToQueue({
        patientName: name,
        age,
        gender,
        mobileNumber
      });

      // Invalidate and refetch queue data
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      
      toast({
        title: "Patient Added",
        description: `${name} has been added to the queue`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add patient to queue",
        variant: "destructive",
      });
    }
  };

  // Add loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Queue Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading queue data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Add error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Queue Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-red-500">
            <AlertCircle className="mx-auto h-10 w-10" />
            <p className="mt-2">Failed to load queue data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients"
              className="pl-8 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select onValueChange={setFilter} defaultValue={filter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="WAITING">Waiting</SelectItem>
              <SelectItem value="WITH_DOCTOR">With Doctor</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Patient Cards */}
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id}>
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 space-y-4 sm:space-y-0">
                <div className="w-full sm:w-auto">
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2 sm:gap-4">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Arrived: {patient.arrivalTime}</span>
                    </div>
                    <div>Est. Wait: {patient.estimatedWait}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          defaultValue={patient.status}
                          onValueChange={(value) => handleStatusChange(patient.id, value as Patient["status"])}
                        >
                          <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WAITING">Waiting</SelectItem>
                            <SelectItem value="WITH_DOCTOR">With Doctor</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change patient status</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          defaultValue={patient.priority}
                          onValueChange={(value) => handlePriorityChange(patient.id, value as Patient["priority"])}
                        >
                          <SelectTrigger className="w-full sm:w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NORMAL">Normal</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change patient priority</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="w-full sm:w-10 h-9 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently remove the patient from the queue.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                              <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRemovePatient(patient.id)}
                                className="w-full sm:w-auto"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove patient from queue</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Patient Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mt-4">
              <UserPlus className="mr-2 h-4 w-4" /> Add New Patient to Queue
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>Enter the patient's details to add them to the queue.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get('name') as string;
              const age = parseInt(formData.get('age') as string);
              const gender = formData.get('gender') as 'MALE' | 'FEMALE' | 'OTHER';
              const mobileNumber = formData.get('mobileNumber') as string;
              const priority = formData.get('priority') as "NORMAL" | "URGENT";

              if (name && age && gender && mobileNumber && priority) {
                handleAddPatient(name, age, gender, mobileNumber, priority);
                e.currentTarget.reset();
              }
            }}>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">Age</Label>
                  <Input id="age" name="age" type="number" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gender" className="text-right">Gender</Label>
                  <Select name="gender" defaultValue="MALE">
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="mobileNumber" className="text-right">Mobile</Label>
                  <Input id="mobileNumber" name="mobileNumber" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">Priority</Label>
                  <Select name="priority" defaultValue="NORMAL">
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full sm:w-auto mt-4">Add Patient</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

