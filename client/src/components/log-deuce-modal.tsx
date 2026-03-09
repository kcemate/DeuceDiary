import { useState, useEffect } from "react";
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
import { addToQueue } from "@/lib/offlineQueue";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { format } from "date-fns";
import { Link } from "wouter";
import { v4 as uuidv4 } from "uuid";

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
  const [shareLocation, setShareLocation] = useState(false);
  const [geoCoords, setGeoCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isOnline, syncQueue } = useOfflineSync();

  const { data: groups = [], error: groupsError, isLoading: groupsLoading } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
    enabled: open,
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
    enabled: open,
  });

  // Auto-select when user has exactly one group
  useEffect(() => {
    if (open && groups.length === 1 && selectedGroupIds.length === 0) {
      setSelectedGroupIds([groups[0].id]);
    }
  }, [open, groups]);

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
    mutationFn: async (data: { location: string; thoughts: string; groupIds: string[]; loggedAt: string; latitude?: number; longitude?: number }) => {
      // Optimistically update the user's deuce count in the cache
      queryClient.setQueryData(["/api/auth/user"], (old: any) => {
        if (!old) return old;
        return { ...old, deuceCount: (old.deuceCount ?? 0) + 1 };
      });

      // If offline, queue and return a synthetic success response
      if (!navigator.onLine) {
        await addToQueue({ id: uuidv4(), ...data });
        return { count: data.groupIds.length, queued: true };
      }

      try {
        return await apiRequest<{ count?: number }>("/api/deuces", {
          method: "POST",
          body: JSON.stringify(data),
        });
      } catch (err) {
        // Network failure mid-request — queue for later
        if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
          await addToQueue({ id: uuidv4(), ...data });
          return { count: data.groupIds.length, queued: true };
        }
        // Roll back optimistic count update for non-network errors
        queryClient.setQueryData(["/api/auth/user"], (old: any) => {
          if (!old) return old;
          return { ...old, deuceCount: Math.max(0, (old.deuceCount ?? 1) - 1) };
        });
        throw err;
      }
    },
    onSuccess: (response: { count?: number; queued?: boolean }) => {
      const count = response.count || 1;
      if (response.queued) {
        toast({
          title: "Saved offline",
          description: `Deuce queued — will sync when you're back online.`,
        });
        // Kick off sync in background (no-op if still offline)
        syncQueue();
      } else {
        toast({
          title: "Success",
          description: `Deuce logged successfully to ${count} group${count > 1 ? 's' : ''}!`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
        queryClient.invalidateQueries({ queryKey: ["/api/analytics/most-deuces"] });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        queryClient.invalidateQueries({ queryKey: ["/api/passport"] });
      }
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
    setShareLocation(false);
    setGeoCoords(null);
  };

  const handleLocationToggle = () => {
    if (shareLocation) {
      setShareLocation(false);
      setGeoCoords(null);
      return;
    }
    if (!navigator.geolocation) {
      toast({ title: "Not supported", description: "Geolocation is not supported by your browser", variant: "destructive" });
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setShareLocation(true);
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        toast({ title: "Location denied", description: "Enable location access in your browser settings to use this feature", variant: "destructive" });
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGroupIds.length === 0) {
      toast({
        title: "No group selected",
        description: groups.length === 0
          ? "Create a group first from the Groups tab"
          : "Please select at least one group",
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
      ...(geoCoords ? { latitude: geoCoords.latitude, longitude: geoCoords.longitude } : {}),
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
              maxLength={500}
              className="h-32 resize-none"
            />
            <div className={`text-right text-xs mt-1 ${
              thoughts.length > 500 ? "text-destructive" :
              thoughts.length > 480 ? "text-amber-500" :
              "text-muted-foreground"
            }`}>
              {thoughts.length} / 500
            </div>
          </div>

          <div>
            <Label htmlFor="group">Groups</Label>
            {groupsLoading ? (
              <div className="text-sm text-muted-foreground">Loading groups...</div>
            ) : groupsError ? (
              <div className="text-sm text-red-500">Error loading groups: {groupsError.message}</div>
            ) : groups.length === 0 ? (
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground mb-2">You need a group to log deuces.</p>
                <Link href="/groups" onClick={() => onOpenChange(false)}>
                  <span className="text-sm font-semibold text-primary hover:underline cursor-pointer">
                    + Create a Group
                  </span>
                </Link>
              </div>
            ) : groups.length === 1 ? (
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                <Checkbox
                  id={`group-${groups[0].id}`}
                  checked={selectedGroupIds.includes(groups[0].id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedGroupIds([groups[0].id]);
                    } else {
                      setSelectedGroupIds([]);
                    }
                  }}
                />
                <Label htmlFor={`group-${groups[0].id}`} className="text-sm font-normal cursor-pointer">
                  Logging to: <span className="font-semibold">{groups[0].name}</span>
                  <span className="text-muted-foreground"> (your default group)</span>
                </Label>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">
                  Selected: {selectedGroupIds.map(id => groups.find(g => g.id === id)?.name).filter(Boolean).join(', ') || 'None'}
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

          {/* Location sharing for Poop Passport */}
          <div className="flex items-center justify-between bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <div>
                <p className="text-sm font-medium text-foreground">Share Location</p>
                <p className="text-xs text-muted-foreground">Add to your Poop Passport</p>
              </div>
            </div>
            <Button
              type="button"
              variant={shareLocation ? "default" : "outline"}
              size="sm"
              onClick={handleLocationToggle}
              disabled={geoLoading}
              className="shrink-0"
            >
              {geoLoading ? "..." : shareLocation ? "On" : "Off"}
            </Button>
          </div>

          {!isOnline && (
            <p className="text-xs text-amber-500 text-center -mb-2">
              You're offline — your deuce will sync when you reconnect.
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={logDeuceMutation.isPending || thoughts.length > 500}
          >
            {logDeuceMutation.isPending ? "Logging..." : isOnline ? "Log Deuce" : "Queue Deuce"}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span className="mx-1">&middot;</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
