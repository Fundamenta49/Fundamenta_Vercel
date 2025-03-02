import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, DollarSign, Briefcase, Heart } from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    title: "Emergency Guidance",
    description: "Get instant step-by-step guidance for emergency situations",
    icon: AlertCircle,
    href: "/emergency",
    color: "text-red-500",
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
    title: "Wellness Support",
    description: "Access mental health resources and meditation guides",
    icon: Heart,
    href: "/wellness",
    color: "text-purple-500",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to Fundamenta
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI-powered assistant for life skills and wellness
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
