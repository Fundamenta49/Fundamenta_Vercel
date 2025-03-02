import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Finance() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Financial Literacy</h1>
      <Card>
        <CardHeader>
          <CardTitle>Financial Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Financial planning tools and resources</p>
        </CardContent>
      </Card>
    </div>
  );
}