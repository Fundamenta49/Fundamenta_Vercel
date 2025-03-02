import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart } from "lucide-react";

export default function InvestmentEducation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Investment Types Explained
          </CardTitle>
          <CardDescription>
            Understanding different investment options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Stocks</h4>
              <p className="text-muted-foreground">
                When you buy stocks, you own a small piece of a company. They offer potential for high returns but come with more volatility.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Bonds</h4>
              <p className="text-muted-foreground">
                Bonds are loans to companies or governments. They generally offer lower risk and steady returns.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Real Estate</h4>
              <p className="text-muted-foreground">
                Invest in physical property or through REITs. Can provide rental income and hedge against inflation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}