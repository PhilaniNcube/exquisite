"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";
import { Media, Product, SchoolPhoto } from "@/payload-types";
import { toast } from "sonner";
import { useState } from "react";

interface ImageGenerationModalProps {
  product: Product;
  schoolPhoto: SchoolPhoto;
}

export function ImageGenerationModal({ product, schoolPhoto }: ImageGenerationModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleGenerateImage = async () => {
    const productImage = typeof product.image === "number" ? null : (product.image as Media);
    const schoolPhotoImage = typeof schoolPhoto.photo === "number" ? null : (schoolPhoto.photo as Media);

    if (!productImage?.url || !schoolPhotoImage?.url) {
      toast.error("Missing images for generation");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/image-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: schoolPhotoImage.url,
          productImageUrl: productImage.url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);
      setShowModal(true);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (generatedImage) {
      URL.revokeObjectURL(generatedImage);
      setGeneratedImage(null);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleGenerateImage}
        disabled={isGenerating}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {isGenerating ? "Generating..." : "Generate Preview"}
      </Button>

      {/* Generated Image Modal */}
      {showModal && generatedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Generated Preview</h3>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="relative aspect-square w-full max-w-md mx-auto">
                <Image
                  src={generatedImage}
                  alt="Generated preview"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
