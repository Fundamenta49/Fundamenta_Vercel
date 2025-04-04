import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, DollarSign, Briefcase, Heart, GraduationCap, Activity, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Life Skills",
    description: "Learn essential skills, personal development, and continuous learning",
    icon: GraduationCap,
    href: "/learning",
    color: "text-orange-500",
  },
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
    title: "Emergency Guidance",
    description: "Get instant step-by-step guidance for emergency situations",
    icon: AlertCircle,
    href: "/emergency",
    color: "text-red-500",
  },
];

export default function Home() {
  const restartTour = () => {
    localStorage.removeItem("hasSeenTour");
    window.location.reload();
  };

  return (
    <div className="px-4 py-8">
      {/* Removed the header with Mood, Bell, and Settings buttons */}

      <div className="text-center mb-12 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={restartTour}
          className="absolute right-0 top-0 text-muted-foreground hover:text-primary"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
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
                <CardTitle className="text-[#1C3D5A] text-balance">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-pretty line-clamp-3 sm:line-clamp-none">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}