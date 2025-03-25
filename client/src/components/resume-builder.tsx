import { useState, useRef } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form validation schema
const resumeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  resumeText: z.string().min(1, "Resume content is required")
});

type ResumeFormData = z.infer<typeof resumeSchema>;

// Styles for PDF generation
const styles = StyleSheet.create({
  page: { flexDirection: "column", backgroundColor: "#FFFFFF", padding: 30 },
  section: { marginBottom: 10, color: "#000000" },
  title: { fontSize: 20, marginBottom: 10, fontWeight: "bold", color: "#003366" },
  text: { fontSize: 14, marginBottom: 5 },
});

const ResumePDF: React.FC<ResumeFormData> = ({ name, email, phone, resumeText }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.text}>Email: {email}</Text>
        <Text style={styles.text}>Phone: {phone}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>{resumeText}</Text>
      </View>
    </Page>
  </Document>
);

const FileUpload: React.FC<{
  onUpload: (text: string) => void;
  setUploadMessage: (message: string) => void;
}> = ({ onUpload, setUploadMessage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('resume', file);
      setUploadMessage("⏳ Processing resume...");

      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      if (data.success && data.data) {
        form.setValue("name", data.data.personalInfo.name || '');
        form.setValue("email", data.data.personalInfo.email || '');
        form.setValue("phone", data.data.personalInfo.phone || '');
        form.setValue("resumeText", data.data.personalInfo.summary || '');
        setUploadMessage(`✅ Successfully parsed: ${file.name}`);
      } else {
        throw new Error(data.message || 'Failed to parse resume');
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      setUploadMessage(`❌ Error: ${error instanceof Error ? error.message : 'Failed to upload resume'}`);
    }
  };

  return (
    <div className="mb-4">
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        <UploadCloud className="w-4 h-4 mr-2" />
        Choose File
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.doc,.docx,.pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default function ResumeBuilder() {
  const [uploadMessage, setUploadMessage] = useState("");

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      resumeText: ""
    }
  });

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto text-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Resume Builder (AI Enhanced)</h2>

      <FileUpload 
        onUpload={(text) => form.setValue("resumeText", text)} 
        setUploadMessage={setUploadMessage}
      />
      {uploadMessage && <p className="text-green-600 text-sm mb-4">{uploadMessage}</p>}

      <Form {...form}>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resumeText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume Content</FormLabel>
                <FormControl>
                  <Textarea 
                    className="h-32 w-full text-base px-4 py-3 rounded-md bg-gray-50 border border-gray-300"
                    placeholder="Paste or upload your resume content..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("resumeText") && (
            <PDFDownloadLink
              document={
                <ResumePDF 
                  name={form.watch("name")}
                  email={form.watch("email")}
                  phone={form.watch("phone")}
                  resumeText={form.watch("resumeText")}
                />
              }
              fileName="optimized_resume.pdf"
              className="block w-full"
            >
              {({ loading }) => (
                <Button 
                  type="button"
                  className="w-full mt-4 bg-blue-700 text-white hover:bg-blue-800" 
                  disabled={loading || !form.formState.isValid}
                >
                  {loading ? "Generating PDF..." : "Download Resume PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </form>
      </Form>
    </div>
  );
}