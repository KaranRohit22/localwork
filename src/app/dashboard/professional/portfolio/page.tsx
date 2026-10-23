"use client";

import { useState } from "react";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { mockProfessionals } from "@/lib/data/mock-data";
import { PortfolioImage } from "@/types";

export default function ProfessionalPortfolioPage() {
  const initialPhotos = mockProfessionals[0].portfolio_images || [];
  const [photos, setPhotos] = useState<PortfolioImage[]>(initialPhotos);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    const newPhoto: PortfolioImage = {
      id: `port-${Date.now()}`,
      professional_id: "pro-1",
      image_url: imageUrl.trim(),
      caption: caption.trim() || null,
      sort_order: photos.length + 1,
      created_at: new Date().toISOString(),
    };

    setPhotos([...photos, newPhoto]);
    setImageUrl("");
    setCaption("");
    setIsAddModalOpen(false);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Portfolio Showcase</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Upload photos of completed jobs. Profiles with 3+ project photos receive 4x more customer inquiries.
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} className="font-semibold">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Project Photo
        </Button>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-border overflow-hidden shadow-card flex flex-col justify-between"
            >
              <div className="aspect-video relative bg-input-bg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.caption || "Portfolio item"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-4 flex items-center justify-between gap-2 border-t border-border">
                <p className="text-xs font-medium text-text line-clamp-1">
                  {item.caption || "Untitled Project"}
                </p>
                <button
                  onClick={() => handleDeletePhoto(item.id)}
                  className="text-text-muted hover:text-error transition-colors p-1"
                  title="Delete image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ImageIcon}
          title="No portfolio images uploaded"
          description="Showcase your recent projects and craft quality to win customer trust."
          actionLabel="Add First Photo"
          onAction={() => setIsAddModalOpen(true)}
        />
      )}

      {/* Add Photo Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Portfolio Project"
        description="Paste an image URL and describe the project."
        maxWidth="md"
      >
        <form onSubmit={handleAddPhoto} className="space-y-4">
          <FormField
            label="Image URL"
            helper="Paste a link to your image (e.g. Unsplash, Cloudinary, Imgur)"
            required
          >
            <Input
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </FormField>

          {imageUrl && (
            <div className="aspect-video rounded-xl overflow-hidden border border-border bg-input-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                }}
              />
            </div>
          )}

          <FormField label="Caption / Project Description">
            <Input
              placeholder="e.g. Modern kitchen recess lighting installation"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </FormField>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add to Portfolio
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
