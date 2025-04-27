import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 mb-4">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">Last updated: April 27, 2025</p>
      </div>
      
      <div className="space-y-8 text-muted-foreground">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Introduction</h2>
          <p>
            Fundamenta Life Skills ("we", "our", or "us") respects your privacy and is committed
            to protecting your personal data. This privacy policy explains how we collect, use,
            and safeguard your information when you use our platform.
          </p>
          <p>
            By using our services, you agree to the collection and use of information in accordance
            with this policy. We use your data to provide and improve our services, and we will
            not use or share your information with anyone except as described in this policy.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
          <p>
            We collect several types of information for various purposes to provide and improve our
            services to you:
          </p>
          <h3 className="text-xl font-medium text-foreground mt-4">Personal Data</h3>
          <p>
            While using our service, we may ask you to provide us with certain personally
            identifiable information that can be used to contact or identify you, including:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Learning and personal development goals</li>
            <li>Progress data</li>
            <li>Usage data</li>
          </ul>
          
          <h3 className="text-xl font-medium text-foreground mt-4">Usage Data</h3>
          <p>
            We may also collect information on how the service is accessed and used. This data may
            include information such as your computer's Internet Protocol address, browser type,
            browser version, the pages of our service that you visit, the time and date of your visit,
            the time spent on those pages, and other diagnostic data.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Security Measures</h2>
          <p>
            The security of your data is important to us. We implement modern security best practices to 
            protect your personal information, including:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Secure password hashing using bcrypt</li>
            <li>JWT (JSON Web Token) authentication with secure refresh token rotation</li>
            <li>HTTPS-only connections with TLS encryption</li>
            <li>HttpOnly, Secure, and SameSite cookies</li>
            <li>Input validation and sanitization to prevent injection attacks</li>
            <li>Regular security audits and updates</li>
          </ul>
          <p className="mt-2">
            While we strive to use commercially acceptable means to protect your personal data,
            remember that no method of transmission over the Internet or method of electronic
            storage is 100% secure. We continuously work to improve our security practices.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">How We Use Your Information</h2>
          <p>We use the collected data for various purposes:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To personalize your learning experience</li>
            <li>To improve our service based on how you use it</li>
            <li>To track your progress and provide recommendations</li>
            <li>To communicate with you about updates or changes</li>
            <li>To provide support and assistance</li>
          </ul>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Your Data Rights</h2>
          <p>
            You have certain rights regarding your personal data, including:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>The right to access the personal information we hold about you</li>
            <li>The right to request correction of inaccurate data</li>
            <li>The right to request deletion of your data</li>
            <li>The right to withdraw consent at any time</li>
            <li>The right to object to processing of your personal data</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please contact us using the information provided below.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Children's Privacy</h2>
          <p>
            Our service is not intended for use by children under the age of 13. We do not knowingly
            collect personally identifiable information from children under 13. If you are a parent
            or guardian and you are aware that your child has provided us with personal data, please
            contact us so that we can take necessary actions.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "last updated" date.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to
            this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>By email: privacy@fundamentalifeskills.com</li>
            <li>Through our website contact form</li>
          </ul>
        </section>
      </div>
    </div>
  );
}