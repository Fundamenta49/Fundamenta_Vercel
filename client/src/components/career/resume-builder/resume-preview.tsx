import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ResumePreviewProps } from './types';

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const formatDate = (date: string, current: boolean | undefined) => {
    if (!date) return '';
    if (current) return 'Present';
    return date;
  };
  
  return (
    <Card className="p-6 border shadow-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {resumeData.personalInfo.name || "Your Name"}
        </h1>
        {resumeData.jobTitle && (
          <p className="text-xl text-muted-foreground mt-1">
            {resumeData.jobTitle}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-3">
          {resumeData.personalInfo.email && (
            <span className="text-sm text-muted-foreground">
              {resumeData.personalInfo.email}
            </span>
          )}
          {resumeData.personalInfo.phone && (
            <span className="text-sm text-muted-foreground">
              • {resumeData.personalInfo.phone}
            </span>
          )}
          {resumeData.personalInfo.location && (
            <span className="text-sm text-muted-foreground">
              • {resumeData.personalInfo.location}
            </span>
          )}
          {resumeData.personalInfo.website && (
            <span className="text-sm text-muted-foreground">
              • {resumeData.personalInfo.website}
            </span>
          )}
        </div>
      </div>
      
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b pb-1 mb-2">Professional Summary</h2>
          <p className="text-sm">
            {resumeData.personalInfo.summary}
          </p>
        </div>
      )}
      
      {resumeData.experience && resumeData.experience.length > 0 && resumeData.experience[0].company && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b pb-1 mb-2">Work Experience</h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-md font-semibold">{exp.position}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(exp.startDate, false)} - {formatDate(exp.endDate, exp.current)}
                  </span>
                </div>
                <h4 className="text-sm text-muted-foreground">{exp.company}</h4>
                
                {exp.description && (
                  <p className="text-sm mt-1">
                    {exp.description}
                  </p>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && exp.achievements[0] && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Key Achievements:</h5>
                    <ul className="list-disc pl-5 mt-1">
                      {exp.achievements.map((achievement, j) => (
                        achievement ? (
                          <li key={j} className="text-sm">
                            {achievement}
                          </li>
                        ) : null
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {resumeData.education && resumeData.education.length > 0 && resumeData.education[0].institution && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b pb-1 mb-2">Education</h2>
          <div className="space-y-4">
            {resumeData.education.map((edu, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-md font-semibold">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(edu.startDate, false)} - {formatDate(edu.endDate, edu.current)}
                  </span>
                </div>
                <h4 className="text-sm text-muted-foreground">{edu.institution}</h4>
                
                {edu.description && (
                  <p className="text-sm mt-1">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {resumeData.skills && resumeData.skills.length > 0 && resumeData.skills[0].name && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b pb-1 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {resumeData.skills.map((skill, i) => (
              skill.name ? (
                <Badge key={i} variant="secondary">
                  {skill.name}{skill.level ? ` (${skill.level})` : ''}
                </Badge>
              ) : null
            ))}
          </div>
        </div>
      )}
      
      {resumeData.certifications && resumeData.certifications.length > 0 && resumeData.certifications[0].name && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b pb-1 mb-2">Certifications</h2>
          <div className="space-y-3">
            {resumeData.certifications.map((cert, i) => (
              <div key={i} className="mb-2">
                <h3 className="text-md font-semibold">{cert.name}</h3>
                
                <div className="flex text-sm text-muted-foreground">
                  {cert.issuer && (
                    <span>{cert.issuer}</span>
                  )}
                  
                  {cert.date && (
                    <span className="ml-2">
                      Issued: {cert.date}
                      {cert.neverExpires 
                        ? ' (No Expiration)' 
                        : cert.expiryDate ? ` - Expires: ${cert.expiryDate}` : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}