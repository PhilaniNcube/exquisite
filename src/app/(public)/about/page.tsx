import { Button } from "@/components/ui/button";
import { Award, Eye, Heart, Camera, Users, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/40 z-10" />
        <Image
          src="/api/media/file/valeria-nikitina.jpg"
          alt="Professional photographer at work"
          className="absolute inset-0 w-full h-full object-cover"
          fill
          priority
        />
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance">
            About Us
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto text-balance">
            Capturing life&apos;s precious moments with passion and artistry
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Meet Esté Oberhauser
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Hi, I&apos;m Esté Oberhauser, owner and photographer at
                Exquisite Photography.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Photography has been my passion since childhood, and I feel
                incredibly fortunate to have turned that passion into a career.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                I&apos;ve been in the photography industry since 2007 and have
                loved every moment of the journey. There&apos;s something truly
                special about capturing memories, whether it&apos;s the quiet
                emotion of a portrait or the lively energy of a family session.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                What I treasure most is the connection I get to build with my
                clients, children and adults alike. That trust, that shared
                excitement — it&apos;s what makes each session meaningful.
              </p>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/images/este.jpg"
                  alt="Professional photographer"
                  className="h-full w-full object-top object-cover"
                  fill
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-accent/20 rounded-lg -z-10" />
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary/20 rounded-lg -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Our Values & Approach
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Every photograph we take is guided by our core principles and
              commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                Professional Excellence
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We maintain the highest standards in every aspect of our work,
                from initial consultation to final delivery. Our award-winning
                quality speaks for itself.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                Creative Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We see the world through a unique lens, finding beauty and
                meaning in every moment. Our artistic approach ensures your
                photos are truly one-of-a-kind.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                Passionate Service
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Photography isn&apos;t just our profession—it&apos;s our
                passion. We pour our hearts into every session, ensuring you
                feel comfortable and confident.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
                <Camera className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                Technical Mastery
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We use state-of-the-art equipment and stay current with the
                latest techniques to deliver stunning, high-quality images in
                any setting.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                Client-Centered
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your vision and satisfaction are our top priorities. We listen
                carefully to your needs and work collaboratively to exceed your
                expectations.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                Authentic Moments
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We capture genuine emotions and real connections, not just posed
                shots. The result is a collection of images that truly tell your
                story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-4/3 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/images/canon.webp"
                  alt="Canon camera, professional photography equipment"
                  className="h-full w-full object-cover rounded-lg"
                  fill
                  priority
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Experience That Matters
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Over the years, we&apos;ve had the privilege of documenting
                thousands of special moments across a wide range of settings and
                occasions.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-16 h-16 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-serif text-2xl font-bold">
                    10+
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Years of Experience
                    </h3>
                    <p className="text-muted-foreground">
                      A decade of capturing life&apos;s most precious moments
                      with skill and artistry
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-16 h-16 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-serif text-2xl font-bold">
                    500+
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Happy Clients
                    </h3>
                    <p className="text-muted-foreground">
                      Families, couples, schools, and businesses who trust us
                      with their memories
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-16 h-16 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-serif text-2xl font-bold">
                    15k+
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Photos Delivered
                    </h3>
                    <p className="text-muted-foreground">
                      Thousands of stunning images preserving cherished memories
                      forever
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
            Ready to Create Beautiful Memories Together?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-balance opacity-90">
            Let&apos;s discuss your photography needs and create something
            extraordinary
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/portfolio">Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
