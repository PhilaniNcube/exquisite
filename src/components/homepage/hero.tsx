import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Star, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 lg:pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
              <Heart className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-secondary-foreground">
                Capturing Magical Moments
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Precious Moments, <br />
              <span className="text-primary">Timeless Memories</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Professional school and crèche photography that captures the joy,
              innocence, and wonder of childhood. Every smile tells a story
              worth preserving. 
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/one.webp"
                    alt="School Boy Portrait"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/two.webp"
                    alt="Toddler smiling"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/three.webp"
                    alt="Baby"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/school_boy.webp"
                    alt="Young child portrait"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Trusted by Parents & Schools
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-red-100 text-red-200"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
