import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResumePreviewProps } from './types';

export default function ResumePreview({ data }: ResumePreviewProps) {
  // Format date helper
  const formatDate = (date: string, current: boolean | undefined): string => {
    if (!date) return '';
    if (current) return 'Present';
    return date;
  };

  return (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{data.personalInfo.name}</h1>
        {data.jobTitle && (
          <h2 className="text-lg text-muted-foreground">{data.jobTitle}</h2>
        )}
        
        <div className="flex flex-wrap gap-3 pt-1">
          {data.personalInfo.email && (
            <Badge variant="outline" className="px-2 py-1">
              {data.personalInfo.email}
            </Badge>
          )}
          {data.personalInfo.phone && (
            <Badge variant="outline" className="px-2 py-1">
              {data.personalInfo.phone}
            </Badge>
          )}
          {data.personalInfo.location && (
            <Badge variant="outline" className="px-2 py-1">
              {data.personalInfo.location}
            </Badge>
          )}
          {data.personalInfo.website && (
            <Badge variant="outline" className="px-2 py-1">
              {data.personalInfo.website}
            </Badge>
          )}
        </div>
      </div>
      
      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="space-y-1">
          <h3 className="text-md font-semibold">Professional Summary</h3>
          <Separator className="my-1" />
          <p className="text-sm leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}
      
      {/* Experience */}
      {data.experience && data.experience.length > 0 && data.experience[0].company && (
        <div className="space-y-1">
          <h3 className="text-md font-semibold">Work Experience</h3>
          <Separator className="my-1" />
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{exp.position}</h4>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(exp.startDate, false)} - {formatDate(exp.endDate, exp.current)}
                  </div>
                </div>
                
                {exp.description && (
                  <p className="text-sm">{exp.description}</p>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && exp.achievements[0] && (
                  <ul className="list-disc list-inside text-sm space-y-1 pl-1 pt-1">
                    {exp.achievements.map((achievement, j) => (
                      achievement ? <li key={j}>{achievement}</li> : null
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Education */}
      {data.education && data.education.length > 0 && data.education[0].institution && (
        <div className="space-y-1">
          <h3 className="text-md font-semibold">Education</h3>
          <Separator className="my-1" />
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </h4>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(edu.startDate, false)} - {formatDate(edu.endDate, edu.current)}
                  </div>
                </div>
                
                {edu.description && (
                  <p className="text-sm">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills */}
      {data.skills && data.skills.length > 0 && data.skills[0].name && (
        <div className="space-y-1">
          <h3 className="text-md font-semibold">Skills</h3>
          <Separator className="my-1" />
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              skill.name ? (
                <Badge key={i} variant="secondary" className="px-2 py-1">
                  {skill.name}
                  {skill.level && <span className="opacity-60 ml-1">({skill.level})</span>}
                </Badge>
              ) : null
            ))}
          </div>
        </div>
      )}
      
      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && data.certifications[0].name && (
        <div className="space-y-1">
          <h3 className="text-md font-semibold">Certifications</h3>
          <Separator className="my-1" />
          <div className="space-y-3">
            {data.certifications.map((cert, i) => (
              cert.name ? (
                <div key={i} className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    {cert.issuer && (
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    )}
                  </div>
                  {cert.date && (
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      Issued: {cert.date}
                      {cert.neverExpires 
                        ? <span className="ml-1">(No Expiration)</span>
                        : cert.expiryDate ? <span className="ml-1">Expires: {cert.expiryDate}</span> : ''}
                    </div>
                  )}
                </div>
              ) : null
            ))}
          </div>
        </div>
      )}
    </div>
  );
}