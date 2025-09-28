import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Search, Plus, Users, Clock, Lock, Globe, Filter } from "lucide-react";
import type { User } from '@supabase/supabase-js';

// Mock data for demonstration
const mockGroups = [
  {
    id: "1",
    title: "Calculus Study Group",
    subject: "Mathematics",
    description: "Weekly calculus problem-solving sessions for Math 101",
    memberCount: 8,
    maxMembers: 12,
    isPrivate: false,
    schedule: "Tuesdays 7:00 PM",
    nextSession: "Today 7:00 PM",
    members: [
      { id: "1", name: "Alice", avatar: "" },
      { id: "2", name: "Bob", avatar: "" },
      { id: "3", name: "Carol", avatar: "" },
    ],
  },
  {
    id: "2",
    title: "Physics Lab Prep",
    subject: "Physics",
    description: "Preparing for weekly physics lab experiments and reports",
    memberCount: 6,
    maxMembers: 8,
    isPrivate: true,
    schedule: "Mondays 3:00 PM",
    nextSession: "Mon 3:00 PM",
    members: [
      { id: "4", name: "David", avatar: "" },
      { id: "5", name: "Eve", avatar: "" },
    ],
  },
  {
    id: "3",
    title: "Computer Science Algorithms",
    subject: "Computer Science",
    description: "Tackling complex algorithms and data structures together",
    memberCount: 10,
    maxMembers: 15,
    isPrivate: false,
    schedule: "Thursdays 6:00 PM",
    nextSession: "Thu 6:00 PM",
    members: [
      { id: "6", name: "Frank", avatar: "" },
      { id: "7", name: "Grace", avatar: "" },
      { id: "8", name: "Henry", avatar: "" },
    ],
  },
];

const Groups = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState<typeof mockGroups[0] | null>(null);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

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

  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch = group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === "all" || group.subject === subjectFilter;
    // Add more filter logic as needed
    return matchesSearch && matchesSubject;
  });

  const handleJoinGroup = (group: typeof mockGroups[0]) => {
    setSelectedGroup(group);
    setJoinDialogOpen(true);
  };

  const confirmJoinGroup = () => {
    // TODO: Implement actual join logic
    setJoinDialogOpen(false);
    setSelectedGroup(null);
    // Show success message
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-inter font-bold text-primary mb-2">Study Groups</h1>
            <p className="text-muted-foreground">Find and join collaborative learning sessions</p>
          </div>
          <Button onClick={() => navigate("/groups/create")} className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search groups by name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-inter flex items-center gap-2">
                      {group.title}
                      {group.isPrivate ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Globe className="h-4 w-4 text-accent" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="secondary" className="mr-2 mb-1">
                        {group.subject}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <Clock className="mr-1 h-3 w-3" />
                        {group.schedule}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {group.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {group.memberCount}/{group.maxMembers} members
                    </span>
                  </div>
                  <div className="text-sm text-accent font-medium">
                    Next: {group.nextSession}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 3).map((member, index) => (
                      <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {group.members.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{group.members.length - 3}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => handleJoinGroup(group)}
                    disabled={group.memberCount >= group.maxMembers}
                  >
                    {group.memberCount >= group.maxMembers ? "Full" : "Join"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Group Modal */}
        <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join {selectedGroup?.title}</DialogTitle>
              <DialogDescription>
                You're about to join this study group. You'll be able to participate in discussions and attend sessions.
              </DialogDescription>
            </DialogHeader>
            
            {selectedGroup && (
              <div className="py-4">
                <div className="space-y-2 text-sm">
                  <div><strong>Subject:</strong> {selectedGroup.subject}</div>
                  <div><strong>Schedule:</strong> {selectedGroup.schedule}</div>
                  <div><strong>Members:</strong> {selectedGroup.memberCount}/{selectedGroup.maxMembers}</div>
                  <div><strong>Privacy:</strong> {selectedGroup.isPrivate ? "Private" : "Public"}</div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setJoinDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={confirmJoinGroup}>
                    Join Group
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Groups;