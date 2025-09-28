import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Calendar,
  MessageCircle,
  FolderOpen,
  Settings,
  Plus,
  Send,
  Paperclip,
  Search,
  Crown,
  UserCheck,
  Clock,
  MapPin,
  ArrowLeft,
  LogOut
} from "lucide-react";
import type { User } from '@supabase/supabase-js';

// Mock data
const mockGroup = {
  id: "1",
  title: "Calculus Study Group",
  subject: "Mathematics",
  description: "Weekly calculus problem-solving sessions for Math 101. We focus on derivatives, integrals, and real-world applications.",
  isPrivate: false,
  maxMembers: 15,
  currentMembers: 12,
  schedule: "Tuesdays 7:00 PM",
  createdBy: "user-1",
  members: [
    { id: "user-1", name: "Alice Johnson", role: "admin", avatar: "", online: true },
    { id: "user-2", name: "Bob Smith", role: "member", avatar: "", online: false },
    { id: "user-3", name: "Carol Davis", role: "moderator", avatar: "", online: true },
    { id: "user-4", name: "David Wilson", role: "member", avatar: "", online: true },
  ],
  upcomingSessions: [
    {
      id: "s1",
      title: "Derivatives Review",
      date: "Today 7:00 PM",
      duration: "2 hours",
      topic: "Chain rule and implicit differentiation"
    },
    {
      id: "s2", 
      title: "Integration Techniques",
      date: "Next Tuesday 7:00 PM",
      duration: "2 hours",
      topic: "Substitution and integration by parts"
    }
  ]
};

const mockMessages = [
  {
    id: "1",
    userId: "user-1",
    userName: "Alice Johnson",
    content: "Hey everyone! Don't forget about tonight's session on derivatives.",
    timestamp: "2 hours ago",
    type: "message"
  },
  {
    id: "2", 
    userId: "user-3",
    userName: "Carol Davis", 
    content: "I've uploaded the practice problems for tonight. Check the resources tab!",
    timestamp: "1 hour ago",
    type: "message"
  },
  {
    id: "3",
    userId: "ai-assistant",
    userName: "AI Assistant",
    content: "Based on your upcoming session, here are some recommended Khan Academy videos on chain rule: [link]",
    timestamp: "30 minutes ago", 
    type: "ai"
  }
];

const mockResources = [
  { id: "1", name: "Calculus Textbook Chapter 3.pdf", type: "pdf", uploadedBy: "Alice Johnson", size: "2.4 MB" },
  { id: "2", name: "Practice Problems Set 1.docx", type: "docx", uploadedBy: "Carol Davis", size: "156 KB" },
  { id: "3", name: "Derivative Rules Cheat Sheet.png", type: "image", uploadedBy: "Bob Smith", size: "892 KB" },
];

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // Check if user is member (mock check)
        setIsMember(true);
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

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement message sending
      setMessage("");
    }
  };

  const handleJoinGroup = () => {
    setIsMember(true);
    // TODO: Implement actual join logic
  };

  const handleLeaveGroup = () => {
    setIsMember(false);
    // TODO: Implement actual leave logic
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/groups")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Groups
          </Button>
          
          <div className="flex space-x-2">
            {isMember && (
              <>
                <Button onClick={() => navigate(`/sessions/create?groupId=${groupId}`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Session
                </Button>
                <Button variant="outline" onClick={handleLeaveGroup}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave Group
                </Button>
              </>
            )}
            {!isMember && (
              <Button onClick={handleJoinGroup}>
                <UserCheck className="mr-2 h-4 w-4" />
                Join Group
              </Button>
            )}
          </div>
        </div>

        {/* Group Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-inter mb-2">{mockGroup.title}</CardTitle>
                <div className="flex items-center space-x-4 mb-3">
                  <Badge variant="secondary">{mockGroup.subject}</Badge>
                  <Badge variant={mockGroup.isPrivate ? "destructive" : "default"}>
                    {mockGroup.isPrivate ? "Private" : "Public"}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {mockGroup.currentMembers}/{mockGroup.maxMembers} members
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {mockGroup.schedule}
                  </div>
                </div>
                <CardDescription className="text-base">
                  {mockGroup.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Sessions */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockGroup.upcomingSessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{session.title}</h4>
                        <Badge variant="outline">{session.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{session.topic}</p>
                      <div className="flex items-center text-sm text-accent">
                        <Clock className="mr-1 h-3 w-3" />
                        {session.date}
                      </div>
                    </div>
                  ))}
                  {isMember && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/sessions/create?groupId=${groupId}`)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule New Session
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Members
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockGroup.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          {member.online && (
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            {member.role === "admin" && <Crown className="mr-1 h-3 w-3" />}
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            {isMember ? (
              <Card className="h-96">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Group Chat</CardTitle>
                    <Button variant="ghost" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  {/* Messages */}
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                    {mockMessages.map((msg) => (
                      <div key={msg.id} className={`flex items-start space-x-3 ${msg.type === 'ai' ? 'bg-muted/30 p-3 rounded-lg' : ''}`}>
                        <Avatar className="h-6 w-6 mt-1">
                          <AvatarFallback className="text-xs">
                            {msg.type === 'ai' ? 'AI' : msg.userName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-medium">{msg.userName}</p>
                            <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-muted-foreground">Join the group to access chat</p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            {isMember ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FolderOpen className="mr-2 h-5 w-5" />
                      Shared Resources
                    </CardTitle>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockResources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            <FolderOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{resource.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded by {resource.uploadedBy} • {resource.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <FolderOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-muted-foreground">Join the group to access resources</p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {isMember && user?.id === mockGroup.createdBy ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Group Settings
                  </CardTitle>
                  <CardDescription>Manage your study group settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Group Title</label>
                      <Input defaultValue={mockGroup.title} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea defaultValue={mockGroup.description} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Privacy Setting</span>
                      <Badge variant={mockGroup.isPrivate ? "destructive" : "default"}>
                        {mockGroup.isPrivate ? "Private" : "Public"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button>Save Changes</Button>
                    <Button variant="destructive">Delete Group</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <Settings className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-muted-foreground">Only group admins can access settings</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default GroupDetail;