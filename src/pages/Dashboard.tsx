import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Users, 
  Plus, 
  MessageCircle, 
  Clock, 
  BookOpen,
  TrendingUp,
  Bell
} from "lucide-react";
import type { User } from '@supabase/supabase-js';

// Mock data for demonstration
const upcomingSessions = [
  {
    id: "1",
    title: "Calculus Problem Set Review",
    group: "Calculus Study Group",
    time: "Today 7:00 PM",
    participants: 8,
  },
  {
    id: "2",
    title: "Physics Lab Preparation", 
    group: "Physics Lab Prep",
    time: "Tomorrow 3:00 PM",
    participants: 6,
  },
  {
    id: "3",
    title: "Algorithm Analysis Discussion",
    group: "CS Algorithms",
    time: "Thursday 6:00 PM",
    participants: 10,
  },
];

const myGroups = [
  {
    id: "1",
    name: "Calculus Study Group",
    subject: "Mathematics",
    members: 12,
    lastActivity: "2 hours ago",
  },
  {
    id: "2", 
    name: "Physics Lab Prep",
    subject: "Physics",
    members: 8,
    lastActivity: "1 day ago",
  },
  {
    id: "3",
    name: "CS Algorithms",
    subject: "Computer Science", 
    members: 15,
    lastActivity: "30 minutes ago",
  },
];

const recentActivity = [
  {
    id: "1",
    type: "message",
    content: "New message in Calculus Study Group",
    time: "5 minutes ago",
    group: "Calculus Study Group",
  },
  {
    id: "2",
    type: "session",
    content: "Session reminder: Physics Lab Prep tomorrow",
    time: "1 hour ago",
    group: "Physics Lab Prep",
  },
  {
    id: "3",
    type: "join",
    content: "Sarah joined CS Algorithms group",
    time: "2 hours ago",
    group: "CS Algorithms",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [aiChatMinimized, setAiChatMinimized] = useState(true);

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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-inter font-bold text-primary mb-2">
            Welcome back, {user.user_metadata?.full_name || "Student"}!
          </h1>
          <p className="text-muted-foreground">Ready to collaborate and learn together?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={() => navigate("/groups/create")}
            className="h-16 text-left justify-start"
            size="lg"
          >
            <Plus className="mr-3 h-5 w-5" />
            <div>
              <div className="font-medium">Create Study Group</div>
              <div className="text-sm opacity-90">Start a new collaborative session</div>
            </div>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate("/groups")}
            className="h-16 text-left justify-start"
            size="lg"
          >
            <Users className="mr-3 h-5 w-5" />
            <div>
              <div className="font-medium">Join Study Group</div>
              <div className="text-sm opacity-70">Find groups to collaborate with</div>
            </div>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your next 3 study sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-muted-foreground">{session.group}</p>
                    <div className="flex items-center mt-1 text-sm text-accent">
                      <Clock className="mr-1 h-3 w-3" />
                      {session.time}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-3 w-3" />
                    {session.participants}
                  </div>
                </div>
              ))}
              {upcomingSessions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No upcoming sessions</p>
                  <p className="text-sm">Join a study group to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Study Groups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                My Groups
              </CardTitle>
              <CardDescription>{myGroups.length} active groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {myGroups.map((group) => (
                <div key={group.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/groups/${group.id}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{group.name}</h4>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {group.subject}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {group.members} members
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Active {group.lastActivity}
                  </div>
                </div>
              ))}
              {myGroups.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Users className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No groups yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Stay updated with your study groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.type === "message" && <MessageCircle className="h-4 w-4 text-blue-500" />}
                    {activity.type === "session" && <Calendar className="h-4 w-4 text-accent" />}
                    {activity.type === "join" && <Users className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.group} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* AI Assistant Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {aiChatMinimized ? (
          <Button
            onClick={() => setAiChatMinimized(false)}
            className="rounded-full h-12 w-12 shadow-lg"
            size="icon"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        ) : (
          <Card className="w-80 h-96 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">AI Study Assistant</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiChatMinimized(true)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm">AI Assistant coming soon!</p>
                <p className="text-xs">Get help with scheduling and study tips</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;