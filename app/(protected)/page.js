"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notify } from "@/lib/helpers";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-hooks";
import {
  MessageCircle,
  Plus,
  Trash2,
  Users,
  Calendar,
  Search,
  Hash,
  MoreVertical,
  LogOut,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAppStore();
  const { logout } = useAuth();
  const [chatrooms, setChatrooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounce search term with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initialize with some mock data
  useEffect(() => {
    const mockChatrooms = [
      {
        id: "1",
        name: "General",
        description: "Main discussion room for everyone",
        memberCount: 45,
        lastActivity: new Date("2024-01-15T10:30:00"),
        createdBy: user?.id,
        isActive: true,
      },
      {
        id: "2",
        name: "Tech Talk",
        description: "Discuss latest tech trends and developments",
        memberCount: 23,
        lastActivity: new Date("2024-01-15T09:15:00"),
        createdBy: "other-user",
        isActive: true,
      },
      {
        id: "3",
        name: "Random",
        description: "Casual conversations and random topics",
        memberCount: 31,
        lastActivity: new Date("2024-01-15T08:45:00"),
        createdBy: user?.id,
        isActive: false,
      },
      {
        id: "4",
        name: "Dev Chat",
        description: "Development discussions and help with 100+ messages",
        memberCount: 67,
        lastActivity: new Date("2024-01-15T11:15:00"),
        createdBy: "other-user",
        isActive: true,
      },
    ];
    setChatrooms(mockChatrooms);
  }, [user]);

  const filteredChatrooms = chatrooms.filter(
    (room) =>
      room.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      notify.error("Room name is required");
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newRoom = {
      id: Date.now().toString(),
      name: newRoomName.trim(),
      description: newRoomDescription.trim() || "No description",
      memberCount: 1,
      lastActivity: new Date(),
      createdBy: user?.id,
      isActive: true,
    };

    setChatrooms((prev) => [newRoom, ...prev]);
    setNewRoomName("");
    setNewRoomDescription("");
    setCreateDialogOpen(false);
    setLoading(false);

    notify.success(`Chatroom "${newRoom.name}" created successfully! 🎉`);
  };

  const handleDeleteRoom = async (roomId) => {
    const room = chatrooms.find((r) => r.id === roomId);
    if (!room) return;

    if (room.createdBy !== user?.id) {
      notify.error("You can only delete rooms you created");
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setChatrooms((prev) => prev.filter((r) => r.id !== roomId));
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
    setLoading(false);

    notify.success(`Chatroom "${room.name}" deleted successfully`);
  };

  const handleEnterRoom = (roomId) => {
    router.push(`/chat/${roomId}`);
  };

  const handleLogout = async () => {
    await logout();
  };

  const formatLastActivity = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Chatrooms</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName || "User"}! Manage your chatrooms
              below.
            </p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-filled">
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Chatroom</DialogTitle>
                <DialogDescription>
                  Create a new chatroom for your community. Give it a
                  descriptive name and optional description.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    placeholder="Enter room name..."
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomDescription">
                    Description (Optional)
                  </Label>
                  <Input
                    id="roomDescription"
                    placeholder="Brief description of the room..."
                    value={newRoomDescription}
                    onChange={(e) => setNewRoomDescription(e.target.value)}
                    maxLength={100}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateRoom}
                  disabled={loading}
                  className="btn-filled"
                >
                  {loading ? "Creating..." : "Create Room"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chatrooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{chatrooms.length}</p>
                  <p className="text-sm text-muted-foreground">Total Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {chatrooms.reduce((sum, room) => sum + room.memberCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {
                      chatrooms.filter((room) => room.createdBy === user?.id)
                        .length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">My Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chatrooms List */}
        <div className="space-y-4">
          {filteredChatrooms.length === 0 ? (
            <Card className="card-elevated">
              <CardContent className="p-12 text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {debouncedSearchTerm ? "No rooms found" : "No chatrooms yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {debouncedSearchTerm
                    ? "Try adjusting your search terms"
                    : "Create your first chatroom to get started"}
                </p>
                {!debouncedSearchTerm && (
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="btn-filled"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Room
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredChatrooms.map((room) => (
              <Card
                key={room.id}
                className="card-elevated hover:shadow-elevation-2 transition-all duration-200 cursor-pointer"
                onClick={() => handleEnterRoom(room.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{room.name}</h3>
                        <div className="flex items-center gap-2">
                          {room.isActive ? (
                            <Badge variant="default" className="text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                          {room.createdBy === user?.id && (
                            <Badge variant="outline" className="text-xs">
                              Owner
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-3">
                        {room.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {room.memberCount} members
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatLastActivity(room.lastActivity)}
                        </div>
                      </div>
                    </div>

                    {room.createdBy === user?.id && (
                      <div className="flex items-center gap-2 ml-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setRoomToDelete(room);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Room
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) setRoomToDelete(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Chatroom</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &ldquo;
                {roomToDelete?.name}&rdquo;? This action cannot be undone and
                all messages will be lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteRoom(roomToDelete?.id)}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Room"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Logout Button */}
        <div className="flex justify-center py-8 mt-12 border-t border-border">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive hover:border-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
