'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, Search, Check, UploadCloud, ImageIcon, Loader2 } from 'lucide-react';
import { MediaItem, fetchAllMediaItems, addMediaItem, subscribeMediaChanges } from '@/lib/media-library';
import { createClient } from '@/lib/supabase/client';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
}

export function MediaPickerModal({ isOpen, onClose, onSelect, currentValue }: MediaPickerModalProps) {
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([]);
  const [selectedUrl, setSelectedUrl] = React.useState<string>(currentValue || '');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);

  const loadMedia = React.useCallback(async () => {
    setIsLoading(true);
    const items = await fetchAllMediaItems();
    setMediaList(items);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      loadMedia();
      setSelectedUrl(currentValue || '');
    }
  }, [isOpen, currentValue, loadMedia]);

  React.useEffect(() => {
    return subscribeMediaChanges(() => {
      loadMedia();
    });
  }, [loadMedia]);

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return mediaList;
    const q = searchQuery.toLowerCase();
    return mediaList.filter(
      (m) => m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q)
    );
  }, [mediaList, searchQuery]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large. Please select an image under 2MB.');
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
        // Fallback to DataURL
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          addMediaItem({ name: file.name, url: dataUrl });
          setSelectedUrl(dataUrl);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      addMediaItem({ name: file.name, url: publicUrl });
      setSelectedUrl(publicUrl);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Media Library</h2>
              <p className="text-xs text-muted-foreground">Select an existing asset or upload a new one</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search + Quick Upload */}
        <div className="px-6 py-3 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by asset name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-background border border-input focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shrink-0">
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5" />
            )}
            <span>{isUploading ? 'Uploading...' : 'Upload New File'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Grid Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-primary" />
              <span className="text-xs">Loading media assets...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center">
              <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-xs font-semibold text-foreground">No media assets found</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Upload your first image using the button above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedUrl(item.url)}
                    className={`group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 shadow-md scale-[1.02]'
                        : 'border-border/80 hover:border-primary/50'
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-card border-t border-border/40">
                      <p className="text-[11px] font-bold text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.uploadedAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-border/80 bg-muted/20 flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground truncate max-w-md">
            {selectedUrl ? (
              <span className="truncate block">
                Selected: <strong className="text-foreground">{selectedUrl}</strong>
              </span>
            ) : (
              <span>Select an image to use</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelect}
              disabled={!selectedUrl}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Use Selected Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
