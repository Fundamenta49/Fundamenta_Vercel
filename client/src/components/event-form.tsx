import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parse, setHours, setMinutes } from "date-fns";
import { useLocation } from "wouter";
import { toast } from "@/hooks/use-toast";

// Type definitions
export type EventCategory = 'work' | 'personal' | 'family' | 'school' | 'health' | 'finance' | 'other';

export type LearningResource = {
  id: string;
  title: string;
  path: string;
  category: EventCategory;
  duration: number; // in minutes
};

export type EventFormData = {
  id?: string;
  title: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  location?: string;
  description?: string;
  category: EventCategory;
  learningResourceId?: string;
};

type EventFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventFormData) => void;
  selectedDate?: Date;
  editEvent?: EventFormData | null;
  learningResources: LearningResource[];
};

// Learning resources catalog
const generateLearningResources = (): LearningResource[] => {
  return [
    { id: 'economics', title: 'Economics Basics', path: '/learning/courses/economics', category: 'finance', duration: 60 },
    { id: 'vehicle-maintenance', title: 'Vehicle Maintenance', path: '/learning/courses/vehicle-maintenance', category: 'personal', duration: 45 },
    { id: 'home-maintenance', title: 'Home Maintenance', path: '/learning/courses/home-maintenance', category: 'personal', duration: 50 },
    { id: 'cooking-basics', title: 'Cooking Basics', path: '/learning/courses/cooking-basics', category: 'personal', duration: 40 },
    { id: 'health-wellness', title: 'Health & Wellness', path: '/learning/courses/health-wellness', category: 'health', duration: 30 },
    { id: 'critical-thinking', title: 'Critical Thinking', path: '/learning/courses/critical-thinking', category: 'school', duration: 55 },
    { id: 'conflict-resolution', title: 'Conflict Resolution', path: '/learning/courses/conflict-resolution', category: 'work', duration: 40 },
    { id: 'decision-making', title: 'Decision Making', path: '/learning/courses/decision-making', category: 'work', duration: 45 },
    { id: 'time-management', title: 'Time Management', path: '/learning/courses/time-management', category: 'work', duration: 35 },
    { id: 'coping-with-failure', title: 'Coping with Failure', path: '/learning/courses/coping-with-failure', category: 'personal', duration: 40 },
    { id: 'conversation-skills', title: 'Conversation Skills', path: '/learning/courses/conversation-skills', category: 'personal', duration: 30 },
    { id: 'forming-positive-habits', title: 'Positive Habits', path: '/learning/courses/forming-positive-habits', category: 'health', duration: 45 },
    { id: 'utilities-guide', title: 'Utilities Guide', path: '/learning/courses/utilities-guide', category: 'finance', duration: 30 },
    { id: 'shopping-buddy', title: 'Shopping Buddy', path: '/learning/courses/shopping-buddy', category: 'finance', duration: 25 },
    { id: 'repair-assistant', title: 'Repair Assistant', path: '/learning/courses/repair-assistant', category: 'personal', duration: 35 },
  ];
};

const EventForm = ({ isOpen, onClose, onSave, selectedDate, editEvent, learningResources = generateLearningResources() }: EventFormProps) => {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: selectedDate || new Date(),
    category: 'personal',
  });
  const [startTimeString, setStartTimeString] = useState('09:00');
  const [endTimeString, setEndTimeString] = useState('10:00');
  const [selectedLearningResource, setSelectedLearningResource] = useState<string | undefined>(undefined);

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editEvent) {
      setFormData({
        ...editEvent,
        date: editEvent.date || selectedDate || new Date(),
      });
      
      if (editEvent.startTime) {
        setStartTimeString(format(editEvent.startTime, 'HH:mm'));
      }
      
      if (editEvent.endTime) {
        setEndTimeString(format(editEvent.endTime, 'HH:mm'));
      }
      
      setSelectedLearningResource(editEvent.learningResourceId);
    } else if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [editEvent, selectedDate]);

  // Handle learning resource selection
  const handleLearningResourceChange = (resourceId: string) => {
    setSelectedLearningResource(resourceId);
    
    // If none is selected, clear the learning resource
    if (resourceId === 'none') {
      setFormData(prev => ({
        ...prev,
        learningResourceId: undefined
      }));
      return;
    }
    
    // Find the selected resource
    const resource = learningResources.find(r => r.id === resourceId);
    
    if (resource) {
      // Auto-fill category based on resource
      setFormData(prev => ({
        ...prev,
        category: resource.category,
        title: `Learn: ${resource.title}`,
        learningResourceId: resourceId
      }));
      
      // Calculate end time based on duration
      if (startTimeString) {
        try {
          const startTime = parse(startTimeString, 'HH:mm', new Date());
          const endTime = new Date(startTime.getTime() + resource.duration * 60000);
          setEndTimeString(format(endTime, 'HH:mm'));
        } catch (error) {
          console.error('Error calculating end time:', error);
        }
      }
    }
  };

  const handleSubmit = () => {
    try {
      // Parse times
      let startTime, endTime;
      
      if (startTimeString) {
        const [hours, minutes] = startTimeString.split(':').map(Number);
        startTime = setMinutes(setHours(new Date(formData.date), hours), minutes);
      }
      
      if (endTimeString) {
        const [hours, minutes] = endTimeString.split(':').map(Number);
        endTime = setMinutes(setHours(new Date(formData.date), hours), minutes);
      }
      
      // Prepare the event data
      const eventData: EventFormData = {
        ...formData,
        startTime,
        endTime,
        learningResourceId: selectedLearningResource === 'none' ? undefined : selectedLearningResource,
      };
      
      // If it's a learning resource, add information
      if (selectedLearningResource && selectedLearningResource !== 'none') {
        const resource = learningResources.find(r => r.id === selectedLearningResource);
        if (!formData.location && resource) {
          eventData.location = `Online course: ${resource.title}`;
        }
      }
      
      onSave(eventData);
      onClose();
      
      // If it's a learning resource, offer navigation
      if (selectedLearningResource && selectedLearningResource !== 'none') {
        const resource = learningResources.find(r => r.id === selectedLearningResource);
        if (resource) {
          toast({
            title: "Event scheduled!",
            description: "Would you like to access the learning content now?",
            action: (
              <Button 
                variant="outline" 
                onClick={() => navigate(resource.path)}
              >
                Open Content
              </Button>
            ),
          });
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your event. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Learning resource selector */}
          <div className="space-y-2">
            <Label htmlFor="learning-resource">Link to Learning Content (Optional)</Label>
            <Select 
              value={selectedLearningResource} 
              onValueChange={handleLearningResourceChange}
            >
              <SelectTrigger id="learning-resource">
                <SelectValue placeholder="Choose learning content (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {learningResources.map((resource) => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {resource.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Linking to learning content will automatically set up your study schedule
            </p>
          </div>
          
          {/* Event title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title"
              required
            />
          </div>
          
          {/* Date and time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={format(formData.date, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const newDate = e.target.value ? new Date(e.target.value) : new Date();
                  setFormData({ ...formData, date: newDate });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: EventCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTimeString}
                onChange={(e) => setStartTimeString(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTimeString}
                onChange={(e) => setEndTimeString(e.target.value)}
              />
            </div>
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter location"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!formData.title}>
            {editEvent ? 'Update' : 'Add'} Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;