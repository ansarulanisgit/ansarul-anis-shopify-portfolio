'use client';

import * as React from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Copy, Check, Trash2, UploadCloud, Plus } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

const initialMedia: MediaItem[] = [
  {
    id: 'm-1',
    name: 'Aura Botanicals Skincare Cover',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    uploadedAt: '2 days ago',
  },
  {
    id: 'm-2',
    name: 'Veloce Cycling Landing Page Hero',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
    uploadedAt: '3 days ago',
  },
  {
    id: 'm-3',
    name: 'Nordic Home Decor Headless Store',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    uploadedAt: '1 week ago',
  },
  {
    id: 'm-4',
    name: 'Developer Profile Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    uploadedAt: '2 weeks ago',
  },
];

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = React.useState<MediaItem[]>(initialMedia);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = React.useState('');

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this asset from library?')) {
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleNewUpload = (url: string) => {
    if (!url) return;
    const newItem: MediaItem = {
      id: `m-${Date.now()}`,
      name: `Uploaded Asset ${mediaList.length + 1}`,
      url,
      uploadedAt: 'Just now',
    };
    setMediaList([newItem, ...mediaList]);
    setNewImageUrl('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Media Library</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Store and manage media assets uploaded to your Supabase Storage bucket (`portfolio-assets`).
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-xs max-w-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-primary" />
          <span>Upload New Asset</span>
        </h3>
        <ImageUploader
          label=""
          value={newImageUrl}
          onChange={handleNewUpload}
          helperText="Upload image directly to Supabase storage"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaList.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-xs flex flex-col group"
            >
              <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
                <Image src={item.url} alt={item.name} fill className="object-cover" />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-foreground truncate">{item.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.uploadedAt}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <button
                    onClick={() => handleCopy(item.id, item.url)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-muted text-[11px] font-semibold text-foreground hover:bg-muted/80 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
