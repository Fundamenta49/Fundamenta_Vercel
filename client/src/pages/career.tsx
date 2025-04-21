import React from 'react';
import CareerToolsDashboard from '@/components/career/career-tools-dashboard';

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="bg-primary-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Career Development Center
              </h1>
              <p className="text-lg text-muted-foreground">
                Access tools and resources to advance your professional journey. 
                Build your resume, find job opportunities, practice interviews, 
                and develop essential career skills.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8">
          <CareerToolsDashboard />
        </section>
      </main>
    </div>
  );
}