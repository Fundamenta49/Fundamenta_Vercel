import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Image as ImageIcon,
  Calendar,
  Smile,
  Clock,
  Camera,
} from "lucide-react";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  imageUrl?: string;
  timestamp: string;
}

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤔", label: "Thoughtful" },
];

export default function JournalEntry() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState({
    title: "",
    content: "",
    mood: "",
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEntrySubmit = () => {
    if (!currentEntry.title || !currentEntry.content) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title,
      content: currentEntry.content,
      mood: currentEntry.mood,
      imageUrl: previewUrl || undefined,
      timestamp: new Date().toISOString(),
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry({ title: "", content: "", mood: "" });
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      {/* New Entry Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Create New Entry
          </CardTitle>
          <CardDescription>
            Capture your thoughts, feelings, and moments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Entry Title"
              value={currentEntry.title}
              onChange={(e) =>
                setCurrentEntry((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-4">
              {moods.map((mood) => (
                <Button
                  key={mood.label}
                  variant={currentEntry.mood === mood.label ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setCurrentEntry((prev) => ({ ...prev, mood: mood.label }))
                  }
                >
                  <span className="mr-1">{mood.emoji}</span>
                  {mood.label}
                </Button>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Write your thoughts here..."
            className="min-h-[200px]"
            value={currentEntry.content}
            onChange={(e) =>
              setCurrentEntry((prev) => ({ ...prev, content: e.target.value }))
            }
          />

          <div className="flex items-center justify-between">
            <div>
              <label className="cursor-pointer">
                <Button variant="outline" className="relative">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </label>
            </div>
            <Button onClick={handleEntrySubmit}>Save Entry</Button>
          </div>

          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Entries Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Journal History
          </CardTitle>
          <CardDescription>Your past reflections and memories</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(entry.timestamp), "PPp")}
                      </div>
                    </div>
                    {entry.mood && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Smile className="h-4 w-4" />
                        Feeling {entry.mood}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="whitespace-pre-wrap mb-4">{entry.content}</p>
                    {entry.imageUrl && (
                      <img
                        src={entry.imageUrl}
                        alt="Journal entry"
                        className="rounded-lg w-full h-auto object-cover"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
