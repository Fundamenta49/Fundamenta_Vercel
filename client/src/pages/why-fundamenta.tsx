import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function WhyFundamenta() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Why Fundamenta</h1>

      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="h-6 w-6 text-primary" />
            <span className="italic text-lg font-normal">
              "Knowing your Why is the only way to maintain lasting success and fulfillment in whatever you do."
            </span>
          </CardTitle>
          <CardDescription className="text-right font-medium">
            —Simon Sinek
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-muted-foreground">
          <p>
            I created Fundamenta because I believe every young person deserves the chance to move into adulthood with confidence—not confusion. 
            When I left home at 17 with $300 and a head full of ambition, I didn't lack motivation—I lacked direction. 
            And I learned quickly that growing up doesn't automatically mean being prepared for what life throws at you.
          </p>
          
          <p>
            This section isn't just about my Why—it's about helping you discover yours. 
            Fundamenta exists to empower young adults with the tools, knowledge, and support they need to succeed on their own terms. 
            For parents, it's not a sign you've failed—it's a sign you care. For users, it's a sign that you're ready to take control.
          </p>
          
          <p>
            This platform bridges the gap between where you are and where you're going. 
            It turns questions into skills, uncertainty into action, and potential into progress. 
            Whether you're just starting out or trying to get back on track, you don't have to do it alone.
          </p>
          
          <div className="mt-6 bg-white bg-opacity-60 p-4 rounded-lg border border-indigo-100">
            <p className="font-medium text-indigo-900">This is why Fundamenta exists.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>To make sure knowing what to do next doesn't feel like a mystery.</li>
              <li>To help you define success by your own values.</li>
              <li>To give purpose the tools it needs to grow.</li>
            </ul>
          </div>
          
          <p className="font-medium text-lg text-indigo-900 text-center mt-4">
            It's fun. It's fundamental. It's Fundamenta.
          </p>
          <p className="text-right italic">
            —Matthew Bishop, Founder & CEO
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
