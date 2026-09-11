'use client';

import * as React from 'react';
import Image from 'next/image';
import { UploadCloud, X, AlertCircle, ImageIcon, FileImage } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { addMediaItem } from '@/lib/media-library';
import { MediaPickerModal } from './MediaPickerModal';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = 'Image',
  helperText = 'Recommended: PNG, WebP or SVG up to 2MB',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [manualUrl, setManualUrl] = React.useState('');
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError('File is too large. Please select an image under 2MB.');
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) {
        // Fallback to FileReader DataURL if bucket is not created yet
        console.warn('Storage upload fallback:', uploadError.message);
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result as string;
          onChange(res);
          addMediaItem({ name: file.name, url: res });
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      addMediaItem({ name: file.name, url: publicUrl });
    } catch (err: any) {
      setError(err.message || 'Upload failed. You can paste an image URL directly.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      const url = manualUrl.trim();
      onChange(url);
      addMediaItem({ name: 'External Asset', url });
      setManualUrl('');
      setShowUrlInput(false);
    }
  };

  const handlePickFromLibrary = (url: string) => {
    onChange(url);
    addMediaItem({ name: 'Library Asset', url });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {label && <label className="text-xs font-semibold text-foreground">{label}</label>}
        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
          >
            <FileImage className="w-3.5 h-3.5" />
            <span>Choose from Library</span>
          </button>
          <span className="text-muted-foreground/40 text-[10px]">•</span>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-muted-foreground hover:text-foreground hover:underline"
          >
            {showUrlInput ? 'Upload file' : 'Enter URL'}
          </button>
        </div>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 h-10 px-3 rounded-xl border border-input text-xs bg-background"
          />
          <button
            type="button"
            onClick={handleManualUrlSubmit}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
          >
            Apply
          </button>
        </div>
      ) : value ? (
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border bg-muted/40 group">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white/90 text-black text-xs font-semibold hover:bg-white transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors relative">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-xs font-semibold text-foreground">
                {isUploading ? 'Uploading to storage...' : 'Click or drag image to upload'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{helperText}</p>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors flex items-center justify-center gap-2"
          >
            <FileImage className="w-4 h-4 text-primary" />
            <span>Select from Media Library</span>
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handlePickFromLibrary}
        currentValue={value}
      />
    </div>
  );
}
