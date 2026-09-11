'use client';

import * as React from 'react';
import Image from 'next/image';
import { Copy, Check, Trash2, UploadCloud, Search, ImageIcon, Loader2 } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  MediaItem,
  fetchAllMediaItems,
  addMediaItem,
  deleteMediaItem,
  subscribeMediaChanges,
} from '@/lib/media-library';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([]);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  const loadMedia = React.useCallback(async () => {
    setIsLoading(true);
    const items = await fetchAllMediaItems();
    setMediaList(items);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadMedia();
    return subscribeMediaChanges(() => {
      loadMedia();
    });
  }, [loadMedia]);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, url: string) => {
    if (confirm('Delete this asset from library?')) {
      deleteMediaItem(id, url);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleNewUpload = (url: string) => {
    if (!url) return;
    addMediaItem({ name: `Uploaded Asset ${mediaList.length + 1}`, url });
    setNewImageUrl('');
    loadMedia();
  };

  const filteredMedia = React.useMemo(() => {
    if (!searchQuery.trim()) return mediaList;
    const q = searchQuery.toLowerCase();
    return mediaList.filter(
      (m) => m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q)
    );
  }, [mediaList, searchQuery]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Media Library</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage all media assets uploaded to your portfolio site and Supabase Storage bucket (`portfolio-assets`).
          </p>
        </div>
        <div className="text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border shrink-0 self-start sm:self-auto font-medium">
          Total Assets: <strong className="text-foreground font-bold">{mediaList.length}</strong>
        </div>
      </div>

      {/* Top Controls: Upload Box + Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-card p-6 rounded-2xl border border-border/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
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

        <div className="md:col-span-2 bg-card p-6 rounded-2xl border border-border/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              <span>Search Library</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Quickly filter media assets by file name or URL string.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by image name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-background border border-input focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-2xl border border-border/80">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-xs font-semibold text-foreground">Loading Media Library...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground bg-card rounded-2xl border border-border/80">
          <ImageIcon className="w-12 h-12 mb-3 opacity-30 text-primary" />
          <h3 className="text-sm font-bold text-foreground">No media assets found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {searchQuery ? 'No images match your search query.' : 'Upload an image above to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-xs flex flex-col group hover:border-primary/50 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
                  <Image src={item.url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  {item.source && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider">
                      {item.source}
                    </span>
                  )}
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
                      onClick={() => handleDelete(item.id, item.url)}
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
      )}
    </div>
  );
}
