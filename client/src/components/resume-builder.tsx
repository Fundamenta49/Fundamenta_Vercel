import { useState } from "react";
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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        onUpload(text);
        setUploadMessage(`✅ Uploaded and parsed: ${file.name}`);
      };
      reader.onerror = () => {
        setUploadMessage("❌ Error reading file");
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("File upload error:", error);
      setUploadMessage("❌ Error uploading file");
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex justify-between items-center mb-4" onClick={handleClick}>
      <Label className="text-sm font-semibold">Upload Existing Resume</Label>
      <div className="flex items-center gap-2">
        <label 
          htmlFor="resumeUpload" 
          className="flex items-center cursor-pointer px-3 py-2 bg-blue-100 rounded-md text-sm text-blue-800 hover:bg-blue-200"
          onClick={handleClick}
        >
          <UploadCloud className="w-4 h-4 mr-2" /> Choose File
        </label>
        <input 
          id="resumeUpload" 
          type="file" 
          accept=".txt,.doc,.docx,.pdf" 
          onChange={handleFileUpload}
          onClick={handleClick}
          className="hidden" 
        />
      </div>
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