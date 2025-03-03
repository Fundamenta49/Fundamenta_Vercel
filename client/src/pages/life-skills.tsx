import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Book,
  Clock,
  CreditCard,
  Home,
  MessageSquare,
  Shield,
  Tool,
  Users,
} from "lucide-react";

const skillCategories = [
  {
    icon: Clock,
    title: "Time Management",
    description: "Learn to organize your day and manage priorities effectively",
    tips: [
      "Use a daily planner",
      "Break large tasks into smaller ones",
      "Set realistic deadlines",
      "Minimize distractions",
    ],
  },
  {
    icon: MessageSquare,
    title: "Communication",
    description: "Develop effective verbal and written communication skills",
    tips: [
      "Practice active listening",
      "Be clear and concise",
      "Read body language",
      "Ask clarifying questions",
    ],
  },
  {
    icon: CreditCard,
    title: "Personal Finance",
    description: "Essential money management and budgeting skills",
    tips: [
      "Create a monthly budget",
      "Track your expenses",
      "Save for emergencies",
      "Understand basic investments",
    ],
  },
  {
    icon: Home,
    title: "Home Management",
    description: "Basic household maintenance and organization",
    tips: [
      "Create cleaning schedules",
      "Learn basic repairs",
      "Organize living spaces",
      "Meal planning basics",
    ],
  },
  {
    icon: Users,
    title: "Social Skills",
    description: "Build and maintain healthy relationships",
    tips: [
      "Practice empathy",
      "Set healthy boundaries",
      "Network effectively",
      "Resolve conflicts",
    ],
  },
  {
    icon: Shield,
    title: "Personal Safety",
    description: "Stay safe in various situations",
    tips: [
      "Basic self-defense",
      "Online safety practices",
      "Emergency preparedness",
      "Situational awareness",
    ],
  },
];

export default function LifeSkills() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Essential Life Skills</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="learn">Learning Center</TabsTrigger>
          <TabsTrigger value="practice">Practice Exercises</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            {skillCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learn">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Learning Modules</CardTitle>
              <CardDescription>
                Structured lessons to build essential life skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming soon: Interactive learning modules for each skill category</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice">
          <Card>
            <CardHeader>
              <CardTitle>Practice Exercises</CardTitle>
              <CardDescription>
                Hands-on exercises to reinforce your learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming soon: Interactive exercises and scenarios</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>
                Helpful tools and external resources for continued learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming soon: Curated collection of books, articles, and tools</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
