import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import BudgetCalculator from "@/components/budget-calculator";

export default function Finance() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Financial Literacy</h1>

      <Tabs defaultValue="chat">
        <TabsList className="mb-4">
          <TabsTrigger value="chat">Financial Advisor</TabsTrigger>
          <TabsTrigger value="calculator">Budget Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Financial AI Advisor</CardTitle>
              <CardDescription>
                Get personalized financial advice and guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface category="finance" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator">
          <BudgetCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
