"use client";

import type React from "react";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin } from "lucide-react";
import { sendContactEmail } from "@/lib/actions/contact";
import { startTransition } from "react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactSection() {
  const [state, formAction, isPending] = useActionState(sendContactEmail, {
    success: false,
    message: "",
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value || "");
    });
    startTransition(() => {
      formAction(formData);
    });
  };

  // Reset form on successful submission
  useEffect(() => {
    if (state.success) {
      form.reset();
    }
  }, [state.success, form]);

  return (
    <section id="contact" className="py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            Let&apos;s Create Something Beautiful
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Get in touch to discuss your photography needs and book your session
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 container mx-auto">
          {/* Contact Information */}
          <div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Get in Touch
            </h3>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                  <p className="text-muted-foreground">+27 (0) 123 456 789</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Email</h4>
                  <p className="text-muted-foreground">
                    hello@exquisitephotography.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Location
                  </h4>
                  <p className="text-muted-foreground">
                    Cape Town, South Africa
                  </p>
                </div>
              </div>
            </div>

            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/api/media/file/equipment.jpg"
                alt="Photography studio"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {state.message && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  state.success
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {state.message}
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
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
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
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
                        <Input
                          type="tel"
                          placeholder="+27 (0) 123 456 789"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Interested In</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wedding">
                            Wedding Photography
                          </SelectItem>
                          <SelectItem value="matric">
                            Matric Farewells
                          </SelectItem>
                          <SelectItem value="schools">Schools</SelectItem>
                          <SelectItem value="creches">Creches</SelectItem>
                          <SelectItem value="families">
                            Families & Couples
                          </SelectItem>
                          <SelectItem value="portraits">Portraits</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your photography needs..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

