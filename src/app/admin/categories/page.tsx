"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { mockCategories } from "@/lib/data/mock-data";
import { ServiceCategory } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>(mockCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Wrench");

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCategory: ServiceCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/\s+/g, "-"),
      description: description.trim() || null,
      icon: icon || "Wrench",
      is_active: true,
      sort_order: categories.length + 1,
      created_at: new Date().toISOString(),
    };

    setCategories([...categories, newCategory]);
    setName("");
    setSlug("");
    setDescription("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Service Categories</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Manage public marketplace service categories, icons, and visibility.
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} className="font-semibold">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-border text-xs font-semibold uppercase tracking-wider text-text-muted">
              <tr>
                <th className="py-3.5 px-6">Category Name</th>
                <th className="py-3.5 px-6">Slug</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-text">{cat.name}</span>
                  </td>
                  <td className="py-4 px-6 text-xs text-text-muted font-mono">
                    /{cat.slug}
                  </td>
                  <td className="py-4 px-6 text-xs text-text-secondary max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="py-4 px-6">
                    {cat.is_active ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCategoryStatus(cat.id)}
                    >
                      {cat.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
        description="Create a new trade taxonomy category for search and directory filters."
        maxWidth="md"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <FormField label="Category Name" required>
            <Input
              placeholder="e.g. Solar Energy Installation"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }}
              required
            />
          </FormField>

          <FormField label="Slug (URL Friendly)" required>
            <Input
              placeholder="solar-energy"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Icon (Lucide name)">
            <Input
              placeholder="e.g. Wrench, Zap, Hammer"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              rows={3}
              placeholder="Describe what services fall under this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
