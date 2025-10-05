"use server";

import { Resend } from "resend";
import * as z from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const getServiceDisplayName = (service: string) => {
  const services: Record<string, string> = {
    wedding: "Wedding Photography",
    matric: "Matric Farewells",
    schools: "Schools",
    creches: "Creches",
    families: "Families & Couples",
    portraits: "Portraits",
  };
  return services[service] || service;
};

export async function sendContactEmail(
  prevState: { success: boolean; message: string },
  formData: FormData
) {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string,
      message: formData.get("message") as string,
    };

    // Validate the form data
    const validatedData = contactFormSchema.parse(data);

    const serviceDisplayName = getServiceDisplayName(validatedData.service);

    // Send email using Resend with plain HTML
    await resend.emails.send({
      from: "Contact Form <dev@athenamedia.co.za>",
      to: ["ncbphi001@gmail.com"],
      replyTo: validatedData.email,
      subject: `New Contact Form Submission - ${serviceDisplayName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h1 style="color: #2c3e50; margin-bottom: 30px; text-align: center;">New Contact Form Submission</h1>
            
            <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="margin-bottom: 20px;">
                <strong style="color: #34495e; font-size: 16px;">Name:</strong>
                <p style="margin: 5px 0; font-size: 16px;">${validatedData.name}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #34495e; font-size: 16px;">Email:</strong>
                <p style="margin: 5px 0; font-size: 16px;">
                  <a href="mailto:${validatedData.email}" style="color: #3498db; text-decoration: none;">${validatedData.email}</a>
                </p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #34495e; font-size: 16px;">Phone:</strong>
                <p style="margin: 5px 0; font-size: 16px;">${validatedData.phone || "Not provided"}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #34495e; font-size: 16px;">Service of Interest:</strong>
                <p style="margin: 5px 0; font-size: 16px; color: #e74c3c; font-weight: 600;">${serviceDisplayName}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #34495e; font-size: 16px;">Message:</strong>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 5px; border-left: 4px solid #3498db;">
                  <p style="margin: 0; font-size: 16px; white-space: pre-wrap;">${validatedData.message}</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                This email was sent from the Exquisite Photography contact form.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully. We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Error sending contact email:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form data and try again.",
      };
    }

    return {
      success: false,
      message: "Sorry, there was an error sending your message. Please try again later.",
    };
  }
}
