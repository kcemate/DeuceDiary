import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format } from "date-fns";

interface LogDeuceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Group {
  id: string;
  name: string;
}

interface Location {
  id: number;
  name: string;
  isDefault: boolean;
  createdBy?: string;
}

export function LogDeuceModal({ open, onOpenChange }: LogDeuceModalProps) {
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedTime, setSelectedTime] = useState(format(new Date(), "HH:mm"));
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups = [], error: groupsError, isLoading: groupsLoading } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
    enabled: open,
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
    enabled: open,
  });

  const createLocationMutation = useMutation({
    mutationFn: async (name: string) => {
      return await apiRequest("/api/locations", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      setShowCustomLocation(false);
      setCustomLocation("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create location",
        variant: "destructive",
      });
    },
  });

  const logDeuceMutation = useMutation({
    mutationFn: async (data: { location: string; thoughts: string; groupIds: string[]; loggedAt: string }) => {
      return await apiRequest("/api/deuces", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (response: any) => {
      const count = response.count || 1;
      toast({
        title: "Success",
        description: `Deuce logged successfully to ${count} group${count > 1 ? 's' : ''}!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/most-deuces"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to log deuce",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setLocation("");
    setCustomLocation("");
    setThoughts("");
    setSelectedGroupIds([]);
    setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    setSelectedTime(format(new Date(), "HH:mm"));
    setShowCustomLocation(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGroupIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one group",
        variant: "destructive",
      });
      return;
    }

    if (!location && !showCustomLocation) {
      toast({
        title: "Error",
        description: "Please select a location",
        variant: "destructive",
      });
      return;
    }

    if (showCustomLocation && !customLocation.trim()) {
      toast({
        title: "Error",
        description: "Please enter a custom location",
        variant: "destructive",
      });
      return;
    }

    if (!thoughts.trim()) {
      toast({
        title: "Error",
        description: "Please enter your thoughts",
        variant: "destructive",
      });
      return;
    }

    const finalLocation = showCustomLocation ? customLocation.trim() : location;
    const loggedAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();
    
    logDeuceMutation.mutate({
      location: finalLocation,
      thoughts: thoughts.trim(),
      groupIds: selectedGroupIds,
      loggedAt,
    });
  };

  const handleAddCustomLocation = () => {
    if (!customLocation.trim()) return;
    createLocationMutation.mutate(customLocation.trim());
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a Deuce</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            {!showCustomLocation ? (
              <>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.name}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setShowCustomLocation(true)}
                >
                  Add New Location
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Enter new location name"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowCustomLocation(false);
                      setCustomLocation("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddCustomLocation}
                    disabled={!customLocation.trim() || createLocationMutation.isPending}
                  >
                    {createLocationMutation.isPending ? "Adding..." : "Add Location"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="thoughts">What's on your mind?</Label>
            <Textarea
              id="thoughts"
              placeholder="Share your throne thoughts..."
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              maxLength={1000}
              className="h-32 resize-none"
            />
            <div className="text-right text-xs text-muted-foreground mt-1">
              {thoughts.length}/1000 characters
            </div>
          </div>

          <div>
            <Label htmlFor="group">Groups</Label>
            {groupsLoading ? (
              <div className="text-sm text-muted-foreground">Loading groups...</div>
            ) : groupsError ? (
              <div className="text-sm text-red-500">Error loading groups: {groupsError.message}</div>
            ) : groups.length === 0 ? (
              <div className="text-sm text-muted-foreground">No groups available. Join a group first!</div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">
                  Selected: {selectedGroupIds.map(id => groups.find(g => g.id === id)?.name).filter(Boolean).join(', ')}
                </div>
                {groups.map((group) => {
                  const isSelected = selectedGroupIds.includes(group.id);
                  return (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`group-${group.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const isChecked = checked === true || checked === 'indeterminate';
                          if (isChecked) {
                            setSelectedGroupIds(prev => {
                              if (prev.includes(group.id)) return prev;
                              return [...prev, group.id];
                            });
                          } else {
                            setSelectedGroupIds(prev => prev.filter(id => id !== group.id));
                          }
                        }}
                      />
                      <Label htmlFor={`group-${group.id}`} className="text-sm font-normal cursor-pointer">
                        {group.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={logDeuceMutation.isPending}
          >
            {logDeuceMutation.isPending ? "Logging..." : "Log Deuce"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
