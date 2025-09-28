import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users, Globe, Lock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@supabase/supabase-js';

const subjects = [
  "Mathematics",
  "Physics", 
  "Chemistry",
  "Biology",
  "Computer Science",
  "Engineering",
  "Literature",
  "History",
  "Psychology",
  "Economics",
  "Business",
  "Art",
  "Music",
  "Other"
];

const scheduleOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" }, 
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" }
];

const timeSlots = [
  "Morning (8AM - 12PM)",
  "Afternoon (12PM - 6PM)", 
  "Evening (6PM - 10PM)",
  "Late Evening (10PM - 12AM)"
];

const CreateGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    isPrivate: false,
    maxMembers: 10,
    schedule: {
      frequency: "",
      timeSlots: [] as string[],
      duration: "2 hours"
    }
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value
      }
    }));
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        timeSlots: prev.schedule.timeSlots.includes(timeSlot)
          ? prev.schedule.timeSlots.filter(slot => slot !== timeSlot)
          : [...prev.schedule.timeSlots, timeSlot]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your study group.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.subject) {
      toast({
        title: "Subject required", 
        description: "Please select a subject for your study group.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual group creation with Supabase
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Group created!",
        description: "Your study group has been created successfully.",
      });
      
      // Navigate to the new group (mock ID)
      navigate("/groups/new-group-id");
    } catch (error) {
      toast({
        title: "Error creating group",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/groups")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Groups
          </Button>
          
          <h1 className="text-3xl font-inter font-bold text-primary mb-2">Create Study Group</h1>
          <p className="text-muted-foreground">Start a new collaborative learning session</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Tell us about your study group</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Group Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Calculus Study Group"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this group will focus on, goals, and any requirements..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Size Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Privacy & Size
              </CardTitle>
              <CardDescription>Configure group access and capacity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {formData.isPrivate ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Label htmlFor="privacy">
                      {formData.isPrivate ? "Private Group" : "Public Group"}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formData.isPrivate 
                      ? "Requires approval to join" 
                      : "Anyone can join immediately"
                    }
                  </p>
                </div>
                <Switch
                  id="privacy"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => handleInputChange("isPrivate", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxMembers">Maximum Members</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="maxMembers"
                    type="number"
                    min="2"
                    max="50"
                    value={formData.maxMembers}
                    onChange={(e) => handleInputChange("maxMembers", parseInt(e.target.value) || 10)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    members (2-50)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Preferences
              </CardTitle>
              <CardDescription>Set recurring meeting preferences (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Meeting Frequency</Label>
                <Select 
                  value={formData.schedule.frequency} 
                  onValueChange={(value) => handleScheduleChange("frequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {scheduleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Preferred Time Slots</Label>
                <div className="grid grid-cols-1 gap-3">
                  {timeSlots.map((timeSlot) => (
                    <div key={timeSlot} className="flex items-center space-x-2">
                      <Checkbox
                        id={timeSlot}
                        checked={formData.schedule.timeSlots.includes(timeSlot)}
                        onCheckedChange={() => handleTimeSlotToggle(timeSlot)}
                      />
                      <Label htmlFor={timeSlot} className="text-sm">
                        {timeSlot}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Select when your group typically prefers to meet
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Session Duration</Label>
                <Select 
                  value={formData.schedule.duration} 
                  onValueChange={(value) => handleScheduleChange("duration", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 hour">1 hour</SelectItem>
                    <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                    <SelectItem value="2 hours">2 hours</SelectItem>
                    <SelectItem value="3 hours">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/groups")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateGroup;