
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarClock, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CalendarEvent {
  date: Date;
  title: string;
  completed: boolean;
}

const HealthCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    { 
      date: new Date(new Date().setDate(new Date().getDate() + 3)), 
      title: "Blood test follow-up", 
      completed: false 
    },
    { 
      date: new Date(new Date().setDate(new Date().getDate() + 7)), 
      title: "Doctor's appointment", 
      completed: false 
    }
  ]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");

  const dateHasEvent = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  const eventsForSelectedDate = events.filter(event => 
    event.date.getDate() === date.getDate() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  );

  const addEvent = () => {
    if (newEventTitle.trim()) {
      const newEvent: CalendarEvent = {
        date: date,
        title: newEventTitle,
        completed: false
      };
      setEvents([...events, newEvent]);
      setNewEventTitle("");
      setIsAddingEvent(false);
    }
  };

  const toggleEventCompletion = (index: number) => {
    const newEvents = [...events];
    const eventIndex = events.findIndex((event, i) => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear() &&
      i === index
    );
    
    if (eventIndex !== -1) {
      newEvents[eventIndex].completed = !newEvents[eventIndex].completed;
      setEvents(newEvents);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Health Calendar</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Health Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(day) => day && setDate(day)}
                    className="rounded-md border p-3 pointer-events-auto"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reminder Title</label>
                  <Input 
                    placeholder="E.g., Take medication, Doctor's appointment"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                  />
                </div>
                <Button onClick={addEvent} className="w-full">
                  Add Reminder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <h3 className="font-medium">
              {format(date, "MMMM d, yyyy")}
            </h3>
          </div>
        </div>
        
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={(day) => day && setDate(day)}
          className="rounded-md border"
          modifiers={{
            hasEvent: (day) => dateHasEvent(day),
          }}
          modifiersClassNames={{
            hasEvent: "bg-primary/20 font-bold text-primary",
          }}
        />
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Health Reminders</h3>
          {eventsForSelectedDate.length > 0 ? (
            <ul className="space-y-2">
              {eventsForSelectedDate.map((event, index) => (
                <li key={index} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                  <span className={event.completed ? "line-through text-muted-foreground" : ""}>
                    {event.title}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleEventCompletion(index)}
                    className={`h-6 w-6 p-0 ${event.completed ? 'bg-primary/20' : ''}`}
                  >
                    <Check className={`h-4 w-4 ${event.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No reminders for this date.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthCalendar;
