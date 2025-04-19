import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumePDFProps } from './types';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 10,
    marginBottom: 2,
    color: '#444',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 2,
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#666',
  },
  dates: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    marginBottom: 2,
  },
  description: {
    fontSize: 10,
    marginTop: 4,
  },
  skills: {
    fontSize: 10,
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    marginRight: 20,
    marginBottom: 5,
  },
  summary: {
    fontSize: 11,
    marginBottom: 15,
    lineHeight: 1.4,
  },
  achievement: {
    fontSize: 10,
    marginLeft: 10,
    marginTop: 2,
  },
});

// Format date helper
const formatDate = (date: string, current: boolean | undefined): string => {
  if (!date) return '';
  if (current) return 'Present';
  return date;
};

// PDF Document Component
export default function ResumePDF({ data }: ResumePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.name}</Text>
          {data.jobTitle && (
            <Text style={styles.title}>{data.jobTitle}</Text>
          )}
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            {data.personalInfo.email && (
              <Text style={[styles.contactInfo, { marginRight: 15 }]}>
                {data.personalInfo.email}
              </Text>
            )}
            {data.personalInfo.phone && (
              <Text style={[styles.contactInfo, { marginRight: 15 }]}>
                {data.personalInfo.phone}
              </Text>
            )}
            {data.personalInfo.location && (
              <Text style={styles.contactInfo}>{data.personalInfo.location}</Text>
            )}
          </View>
          {data.personalInfo.website && (
            <Text style={styles.contactInfo}>{data.personalInfo.website}</Text>
          )}
        </View>

        {/* Summary Section */}
        {data.personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{data.personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && data.experience[0].company && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {data.experience.map((exp, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.dates}>
                  {formatDate(exp.startDate, false)} - {formatDate(exp.endDate, exp.current)}
                </Text>
                {exp.description && (
                  <Text style={styles.description}>{exp.description}</Text>
                )}
                {exp.achievements && exp.achievements.length > 0 && exp.achievements[0] && (
                  <View style={{ marginTop: 4 }}>
                    {exp.achievements.map((achievement, j) => (
                      achievement ? (
                        <Text key={j} style={styles.achievement}>
                          • {achievement}
                        </Text>
                      ) : null
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && data.education[0].institution && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </Text>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                <Text style={styles.dates}>
                  {formatDate(edu.startDate, false)} - {formatDate(edu.endDate, edu.current)}
                </Text>
                {edu.description && (
                  <Text style={styles.description}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && data.skills[0].name && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skills}>
              {data.skills.map((skill, i) => (
                skill.name ? (
                  <View key={i} style={styles.skill}>
                    <Text>
                      {skill.name}{skill.level ? ` (${skill.level})` : ''}
                    </Text>
                  </View>
                ) : null
              ))}
            </View>
          </View>
        )}

        {/* Certifications Section */}
        {data.certifications && data.certifications.length > 0 && data.certifications[0].name && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert, i) => (
              cert.name ? (
                <View key={i} style={styles.item}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>
                  {cert.issuer && (
                    <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                  )}
                  {cert.date && (
                    <Text style={styles.dates}>
                      Issued: {cert.date}
                      {cert.neverExpires
                        ? ' (No Expiration)'
                        : cert.expiryDate ? ` - Expires: ${cert.expiryDate}` : ''}
                    </Text>
                  )}
                </View>
              ) : null
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}