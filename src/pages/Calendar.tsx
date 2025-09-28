import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Settings,
  Clock,
  Users,
  MapPin
} from "lucide-react";
import type { User } from '@supabase/supabase-js';

// Mock calendar events
const mockEvents = [
  {
    id: "1",
    title: "Calculus Review Session",
    group: "Calculus Study Group",
    date: "2024-01-15",
    time: "19:00",
    duration: "2 hours",
    type: "study",
    participants: 8,
    color: "bg-blue-500"
  },
  {
    id: "2",
    title: "Physics Lab Prep",
    group: "Physics Lab Group", 
    date: "2024-01-16",
    time: "15:00",
    duration: "1.5 hours",
    type: "preparation",
    participants: 6,
    color: "bg-green-500"
  },
  {
    id: "3",
    title: "Algorithm Study Session",
    group: "CS Algorithms",
    date: "2024-01-18",
    time: "18:00", 
    duration: "2 hours",
    type: "study",
    participants: 10,
    color: "bg-purple-500"
  }
];

const Calendar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [filterGroup, setFilterGroup] = useState("all");

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startCalendar = new Date(firstDay);
    startCalendar.setDate(startCalendar.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startCalendar);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockEvents.filter(event => event.date === dateStr);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const calendarDays = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-inter font-bold text-primary mb-2">Calendar</h1>
            <p className="text-muted-foreground">Manage your study sessions and events</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button onClick={() => navigate("/sessions/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Session
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Calendar Settings
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          {/* View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold min-w-[200px] text-center">
                {currentDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* View Mode & Filters */}
          <div className="flex items-center space-x-2">
            <Select value={filterGroup} onValueChange={setFilterGroup}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="calculus">Calculus Study Group</SelectItem>
                <SelectItem value="physics">Physics Lab Group</SelectItem>
                <SelectItem value="cs">CS Algorithms</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={viewMode} onValueChange={(value: "month" | "week" | "day") => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-4 text-center font-medium text-muted-foreground border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const events = getEventsForDate(day);
                const isCurrentMonthDay = isCurrentMonth(day);
                const isTodayDay = isToday(day);
                
                return (
                  <div 
                    key={index} 
                    className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                      !isCurrentMonthDay ? 'bg-muted/30 text-muted-foreground' : ''
                    } ${isTodayDay ? 'bg-accent/20' : ''}`}
                  >
                    <div className={`text-sm mb-2 ${isTodayDay ? 'font-bold text-primary' : ''}`}>
                      {day.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {events.map((event) => (
                        <Dialog key={event.id}>
                          <DialogTrigger asChild>
                            <div 
                              className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${event.color} text-white`}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="truncate font-medium">{event.title}</div>
                              <div className="truncate opacity-90">{event.time}</div>
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{selectedEvent?.title}</DialogTitle>
                              <DialogDescription>
                                Session details and information
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedEvent && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <div className="font-medium mb-1">Group</div>
                                    <Badge variant="secondary">{selectedEvent.group}</Badge>
                                  </div>
                                  <div>
                                    <div className="font-medium mb-1">Type</div>
                                    <Badge variant="outline">{selectedEvent.type}</Badge>
                                  </div>
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formatDate(new Date(selectedEvent.date))}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    {selectedEvent.time} ({selectedEvent.duration})
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="mr-2 h-4 w-4" />
                                    {selectedEvent.participants} participants
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2 pt-4">
                                  <Button 
                                    onClick={() => navigate(`/groups/${selectedEvent.group.toLowerCase().replace(/\s+/g, '-')}`)}
                                    className="flex-1"
                                  >
                                    View Group
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => navigate(`/sessions/${selectedEvent.id}/edit`)}
                                    className="flex-1"
                                  >
                                    Edit Session
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your next study sessions this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${event.color}`} />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.group}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{formatDate(new Date(event.date))}</p>
                    <p className="text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Calendar;