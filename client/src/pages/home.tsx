import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, DollarSign, Briefcase, Heart, GraduationCap, Activity } from "lucide-react";
import { Link } from "wouter";
import ChatInterface from "@/components/chat-interface";

const features = [
  {
    title: "Financial Literacy",
    description: "Learn budgeting, savings, and financial planning",
    icon: DollarSign,
    href: "/finance",
    color: "text-green-500",
  },
  {
    title: "Career Development",
    description: "Build your resume and prepare for interviews",
    icon: Briefcase,
    href: "/career",
    color: "text-blue-500",
  },
  {
    title: "Wellness & Nutrition",
    description: "Access mental health resources, meditation guides, and nutrition advice",
    icon: Heart,
    href: "/wellness",
    color: "text-purple-500",
  },
  {
    title: "Active You",
    description: "Get personalized fitness guidance with AI-powered workout plans",
    icon: Activity,
    href: "/active",
    color: "text-pink-500",
  },
  {
    title: "Life Skills",
    description: "Learn essential skills, personal development, and continuous learning",
    icon: GraduationCap,
    href: "/learning",
    color: "text-orange-500",
  },
  {
    title: "Emergency Guidance",
    description: "Get instant step-by-step guidance for emergency situations",
    icon: AlertCircle,
    href: "/emergency",
    color: "text-red-500",
  },
];

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const hasCompletedGreeting = localStorage.getItem('completedInitialGreeting');
    if (hasCompletedGreeting) {
      setShowWelcome(false);
    }
  }, []);

  const handleGreetingComplete = () => {
    setShowWelcome(false);
    localStorage.setItem('completedInitialGreeting', 'true');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {showWelcome && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight text-[#1C3D5A]">
              Welcome to Fundamenta! 👋
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChatInterface 
              category="welcome" 
              onConversationComplete={handleGreetingComplete} 
            />
          </CardContent>
        </Card>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#1C3D5A]">
          Welcome to Fundamenta
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI-powered assistant for life skills and wellness
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-white border border-gray-200">
              <CardHeader>
                <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                <CardTitle className="text-[#1C3D5A]">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}