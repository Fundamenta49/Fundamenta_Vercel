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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

export default function VehicleGuide() {
  const [vin, setVin] = useState("");
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch recall data from NHTSA API
  const fetchRecalls = async () => {
    if (!vin) {
      setError("Please enter a VIN number.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.nhtsa.gov/recalls/recallsByVehicle?vin=${vin}`
      );
      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        setRecalls(data.results);
      } else {
        setRecalls([]);
        setError("No recalls found for this VIN.");
      }
    } catch (err) {
      setError("Failed to fetch recall data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Safety Lookup</CardTitle>
          <CardDescription>
            Enter your Vehicle Identification Number (VIN) to check for recalls and safety information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter VIN (17 characters)"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                className="w-full pr-8"
                maxLength={17}
              />
              <Info
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-help"
                title="Vehicle Identification Number - Located on your vehicle registration or driver's side door frame"
              />
            </div>

            <Button
              onClick={fetchRecalls}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Checking..." : "Check Recalls"}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {recalls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Recall Results:</h3>
                <ul className="mt-2 space-y-2">
                  {recalls.map((recall:any, index) => (
                    <li key={index} className="p-3 bg-gray-100 rounded">
                      <strong>{recall.Component}</strong>
                      <p>{recall.Summary}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}