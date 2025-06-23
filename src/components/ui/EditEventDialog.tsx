"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Event {
  _id: string;
  title: string;
  type: string;
  image: string;
  isActive: boolean;
}

interface EditeventDialogProps {
  event: Event | null;
  formData: { title: string; type: string };
  setFormData: React.Dispatch<React.SetStateAction<{ title: string; type: string }>>;
  onSave: (updatedCategory: Event) => void;
  onClose: () => void;
  children?: React.ReactNode;
}

const EditEventDialog: React.FC<EditeventDialogProps> = ({ 
  event, 
  formData, 
  setFormData, 
  onSave, 
  onClose 
}) => {
  if (!event) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    // Create the updated category by merging the existing category with form data
    const updatedCategory: Event = {
      ...event, // includes _id, image, isActive
      title: formData.title,
      type: formData.type
    };
    onSave(updatedCategory);
  };

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              title="Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <input
              title="Types"
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;