"use server";

import { z } from "zod";
import { Resend } from "resend";


// Schema for homepage contact form (without date field)
const homepageContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Schema for contact page form (with date field)
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  date: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const resend = new Resend(process.env.RESEND_API_KEY);

const serviceMap: Record<string, string> = {
  wedding: "Wedding Photography",
  matric: "Matric Farewells",
  schools: "Schools",
  creches: "Creches",
  families: "Families & Couples",
  portraits: "Portraits",
};

export async function sendContactEmail(prevState: unknown, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string,
      message: formData.get("message") as string,
    };

    // Validate the form data
    const validatedData = homepageContactSchema.parse(data);
    const serviceName = serviceMap[validatedData.service] || validatedData.service;

    // Send email to admin
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "hello@exquisitephotography.com",
      to: [process.env.ADMIN_EMAIL || "admin@exquisitephotography.com"],
      subject: `Homepage Inquiry: ${serviceName} - ${validatedData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #e1e1e1; padding-bottom: 10px;">
            New Homepage Contact Form Submission
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone || "Not provided"}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
              ${validatedData.message.replace(/\n/g, "<br>")}
            </div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e1e1e1;">
          <p style="color: #666; font-size: 12px;">
            <em>This email was sent from the Exquisite Photography homepage contact form.</em>
          </p>
        </div>
      `,
      replyTo: validatedData.email,
    });

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    };
  } catch (error) {
    console.error("Homepage contact form error:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form data and try again.",
      };
    }
    
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
}

export async function submitContactForm(data: ContactFormData) {
  try {
    // Validate the form data
    const validatedData = contactFormSchema.parse(data);

    // Service type mapping for better readability
    const serviceMap: Record<string, string> = {
      wedding: "Wedding Photography",
      matric: "Matric Farewells",
      schools: "Schools",
      creches: "Creches",
      families: "Families & Couples",
      portraits: "Portraits",
    };

    const serviceName = serviceMap[validatedData.service] || validatedData.service;

    // Send email to admin
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "hello@exquisitephotography.com",
      to: [process.env.FROM_EMAIL || "admin@exquisitephotography.com"],
      subject: `New Inquiry: ${serviceName} - ${validatedData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #e1e1e1; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone || "Not provided"}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Preferred Date:</strong> ${validatedData.date || "Not specified"}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
              ${validatedData.message.replace(/\n/g, "<br>")}
            </div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e1e1e1;">
          <p style="color: #666; font-size: 12px;">
            <em>This email was sent from the Exquisite Photography contact form.</em>
          </p>
        </div>
      `,
      replyTo: validatedData.email,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@athenamedia.co.za",
      to: [validatedData.email],
      subject: "Thank you for your inquiry - Exquisite Photography",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #e1e1e1; padding-bottom: 10px;">
            Thank you for contacting Exquisite Photography!
          </h2>
          
          <p>Dear ${validatedData.name},</p>
          
          <p>We've received your inquiry about our <strong>${serviceName}</strong> services and will get back to you within 24 hours.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your inquiry details:</h3>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Preferred Date:</strong> ${validatedData.date || "Not specified"}</p>
            <p><strong>Your Message:</strong></p>
            <div style="background: white; padding: 10px; border-left: 4px solid #007bff; margin: 10px 0;">
              ${validatedData.message.replace(/\n/g, "<br>")}
            </div>
          </div>
          
          <p>In the meantime, feel free to browse our portfolio or call us directly at <strong>+27 (0) 123 456 789</strong> for urgent inquiries.</p>
          
          <p>Best regards,<br>
          <strong>The Exquisite Photography Team</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e1e1e1;">
          <p style="color: #666; font-size: 12px;">
            <em>This is an automated confirmation email. Please do not reply to this email.</em>
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Contact form submission error:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Please check your form data and try again." 
      };
    }
    
    return { 
      success: false, 
      error: "Failed to send message. Please try again later." 
    };
  }
}
