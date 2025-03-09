import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Category = "emergency" | "finance" | "career" | "wellness" | "learning" | "fitness" | "cooking";

interface ChatInterfaceProps {
  category: Category;
  context?: string;
}

// Rest of the file remains unchanged
