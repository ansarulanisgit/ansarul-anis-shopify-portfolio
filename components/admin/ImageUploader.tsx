'use client';

import * as React from 'react';
import Image from 'next/image';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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
          onChange(reader.result as string);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed. You can paste an image URL directly.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-primary dark:text-sky-400 hover:underline"
        >
          {showUrlInput ? 'Upload file instead' : 'Enter URL manually'}
        </button>
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
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
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
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
