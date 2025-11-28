import { Button } from "@/components/ui/button"
import { Award, Eye, Heart } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Creating Timeless Memories Through Photography
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              With years of experience and a passion for storytelling, we specialize in capturing the authentic moments
              that matter most. Our approach combines technical excellence with artistic vision to create photographs
              you&apos;ll treasure forever.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Whether it&apos;s the joy of a wedding day, the excitement of a matric farewell, or the warmth of a family
              portrait, we&apos;re dedicated to preserving your precious memories with care and creativity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Professional</h3>
                <p className="text-sm text-muted-foreground">Quality work</p>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Creative Vision</h3>
                <p className="text-sm text-muted-foreground">Unique perspectives</p>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Passionate</h3>
                <p className="text-sm text-muted-foreground">Dedicated service</p>
              </div>
            </div>

          </div>

          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/toddler.jpg"
                alt="Professional photographer working on location"
                className="h-full w-full object-cover object-left"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-accent/20 rounded-lg -z-10" />
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary/20 rounded-lg -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
