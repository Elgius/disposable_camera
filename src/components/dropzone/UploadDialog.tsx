import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import UploadDropzone from "./UploadDropzone";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[], albumCode: string) => void;
  isUploading: boolean;
}

export default function UploadDialog({
  open,
  onOpenChange,
  onUpload,
  isUploading,
}: UploadDialogProps) {
  const [albumCode, setAlbumCode] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (file: File) => {
    // Check file size (35MB = 35 * 1024 * 1024 bytes)
    if (file.size > 35 * 1024 * 1024) {
      toast.error("File size must be less than 35MB");
      return;
    }
    setSelectedFiles((prev) => [...prev, file]);
  };

  const handleUpload = () => {
    if (!albumCode.trim()) {
      toast.error("Please enter an album code");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }
    onUpload(selectedFiles, albumCode);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="albumCode" className="text-right">
              Album Code
            </Label>
            <Input
              id="albumCode"
              value={albumCode}
              onChange={(e) => setAlbumCode(e.target.value)}
              className="col-span-3"
              placeholder="Enter album code"
            />
          </div>
          <UploadDropzone
            onFileSelect={handleFileSelect}
            onClearPreview={() => {}}
            filePreview={null}
            isUploading={isUploading}
            uploadProgress={0}
          />
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
          >
            {isUploading ? "Uploading..." : "Upload Images"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
