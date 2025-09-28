import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import { ArrowLeft, Calendar, Clock, Users, Bell, Repeat, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@supabase/supabase-js';

const mockGroups = [
  { id: "1", name: "Calculus Study Group", subject: "Mathematics" },
  { id: "2", name: "Physics Lab Prep", subject: "Physics" },
  { id: "3", name: "CS Algorithms", subject: "Computer Science" },
];

const durations = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
];

const recurringOptions = [
  { value: "none", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const notificationOptions = [
  { value: "15min", label: "15 minutes before", checked: true },
  { value: "1hour", label: "1 hour before", checked: false },
  { value: "1day", label: "1 day before", checked: false },
  { value: "email", label: "Email notification", checked: true },
];

const SessionForm = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isEdit = Boolean(sessionId);
  const preselectedGroup = searchParams.get("groupId");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    groupId: preselectedGroup || "",
    date: "",
    time: "",
    duration: "120",
    topic: "",
    agenda: "",
    recurring: "none",
    recurringEnd: "",
    notifications: notificationOptions.map(opt => ({ ...opt })),
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

  useEffect(() => {
    // Load session data if editing
    if (isEdit && sessionId) {
      // TODO: Load session data from Supabase
      // For now, mock loading existing session
      setFormData({
        title: "Derivatives Review Session",
        groupId: "1",
        date: "2024-01-15",
        time: "19:00",
        duration: "120",
        topic: "Derivatives and Chain Rule",
        agenda: "Review derivative rules, practice chain rule problems, and work through sample exams.",
        recurring: "weekly",
        recurringEnd: "2024-03-15",
        notifications: notificationOptions.map(opt => ({ ...opt })),
      });
    }
  }, [isEdit, sessionId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationToggle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      notifications: prev.notifications.map((notif, i) => 
        i === index ? { ...notif, checked: !notif.checked } : notif
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a session title.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.groupId) {
      toast({
        title: "Group required",
        description: "Please select a study group.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.date || !formData.time) {
      toast({
        title: "Date and time required",
        description: "Please set the session date and time.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual session creation/update with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: isEdit ? "Session updated!" : "Session created!",
        description: `Your study session has been ${isEdit ? 'updated' : 'created'} successfully.`,
      });
      
      // Navigate back to group or calendar
      if (preselectedGroup) {
        navigate(`/groups/${preselectedGroup}`);
      } else {
        navigate("/calendar");
      }
    } catch (error) {
      toast({
        title: `Error ${isEdit ? 'updating' : 'creating'} session`,
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (preselectedGroup) {
      navigate(`/groups/${preselectedGroup}`);
    } else {
      navigate("/calendar");
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
          <Button variant="ghost" onClick={handleCancel} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-inter font-bold text-primary mb-2">
            {isEdit ? "Edit Session" : "Create Study Session"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Update your study session details" : "Schedule a new collaborative learning session"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Session Details
              </CardTitle>
              <CardDescription>Basic information about your study session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Derivatives Review Session"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupId">Study Group *</Label>
                <Select 
                  value={formData.groupId} 
                  onValueChange={(value) => handleInputChange("groupId", value)}
                  disabled={Boolean(preselectedGroup)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a study group" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} ({group.subject})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {preselectedGroup && (
                  <p className="text-xs text-muted-foreground">
                    Group pre-selected from your navigation
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select 
                  value={formData.duration} 
                  onValueChange={(value) => handleInputChange("duration", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content & Agenda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Content & Agenda
              </CardTitle>
              <CardDescription>What will you cover in this session?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Main Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Derivatives and Chain Rule"
                  value={formData.topic}
                  onChange={(e) => handleInputChange("topic", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agenda">Session Agenda</Label>
                <Textarea
                  id="agenda"
                  placeholder="Describe what you'll cover, goals, and any preparation needed..."
                  value={formData.agenda}
                  onChange={(e) => handleInputChange("agenda", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recurring Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Repeat className="mr-2 h-5 w-5" />
                Recurring Options
              </CardTitle>
              <CardDescription>Set up repeating sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recurring">Repeat</Label>
                <Select 
                  value={formData.recurring} 
                  onValueChange={(value) => handleInputChange("recurring", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.recurring !== "none" && (
                <div className="space-y-2">
                  <Label htmlFor="recurringEnd">End Repeat</Label>
                  <Input
                    id="recurringEnd"
                    type="date"
                    value={formData.recurringEnd}
                    onChange={(e) => handleInputChange("recurringEnd", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    When should the recurring sessions stop?
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>How would you like to be reminded?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.notifications.map((notification, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`notification-${index}`}
                    checked={notification.checked}
                    onCheckedChange={() => handleNotificationToggle(index)}
                  />
                  <Label htmlFor={`notification-${index}`} className="text-sm">
                    {notification.label}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading 
                ? (isEdit ? "Updating..." : "Creating...") 
                : (isEdit ? "Update Session" : "Create Session")
              }
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SessionForm;