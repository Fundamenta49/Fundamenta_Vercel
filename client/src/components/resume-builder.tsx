import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

interface Education {
  school: string;
  degree: string;
  year: string;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export default function ResumeBuilder() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
  });

  const [education, setEducation] = useState<Education[]>([
    { school: "", degree: "", year: "" },
  ]);

  const [experience, setExperience] = useState<Experience[]>([
    { company: "", position: "", duration: "", description: "" },
  ]);

  const addEducation = () => {
    setEducation([...education, { school: "", degree: "", year: "" }]);
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      { company: "", position: "", duration: "", description: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={personalInfo.name}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={personalInfo.summary}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, summary: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Education
            <Button
              variant="outline"
              size="sm"
              onClick={addEducation}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>School</Label>
                <Input
                  value={edu.school}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].school = e.target.value;
                    setEducation(newEducation);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].degree = e.target.value;
                    setEducation(newEducation);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  value={edu.year}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].year = e.target.value;
                    setEducation(newEducation);
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Experience
            <Button
              variant="outline"
              size="sm"
              onClick={addExperience}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experience.map((exp, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].company = e.target.value;
                    setExperience(newExperience);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].position = e.target.value;
                    setExperience(newExperience);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={exp.duration}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].duration = e.target.value;
                    setExperience(newExperience);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].description = e.target.value;
                    setExperience(newExperience);
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
