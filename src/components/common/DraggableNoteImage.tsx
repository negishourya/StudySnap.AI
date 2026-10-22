import React, { useState } from 'react';
import { Download, Move, ZoomIn, X, Check, ExternalLink } from 'lucide-react';

interface DraggableNoteImageProps {
  imageUrl: string;
  imageName?: string | null;
  altText?: string;
  className?: string;
  showBadge?: boolean;
}

export const DraggableNoteImage: React.FC<DraggableNoteImageProps> = ({
  imageUrl,
  imageName = 'study-note-diagram.png',
  altText = 'Study note attached diagram',
  className = '',
  showBadge = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const safeFileName = (imageName || 'study-note-diagram.png').replace(/[^a-zA-Z0-9._-]/g, '_');

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'copyMove';

    // Standard URLs
    e.dataTransfer.setData('text/plain', imageUrl);
    e.dataTransfer.setData('text/uri-list', imageUrl);
    e.dataTransfer.setData(
      'text/html',
      `<img src="${imageUrl}" alt="${altText}" style="max-width:100%;height:auto;" />`
    );

    // Browser-to-desktop drag-and-drop file download (supported on Chromium browsers: Chrome, Edge, Brave, Opera)
    // Format: mime:filename:download_url
    try {
      e.dataTransfer.setData('DownloadURL', `image/png:${safeFileName}:${imageUrl}`);
    } catch {
      // Ignored if browser restricts custom scheme
    }
  };

  const handleDirectDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = safeFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch {
      // Direct link fallback
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = safeFileName;
      a.target = '_blank';
      a.rel = 'noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative group cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700 bg-slate-900/5 dark:bg-slate-950/40 select-none transition-all hover:shadow-lg ${className}`}
        title="Click to preview or drag this image out to your desktop / another window"
      >
        <img
          src={imageUrl}
          alt={altText}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] pointer-events-none"
        />

        {/* Drag Out Badge */}
        {showBadge && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/20 shadow-md">
            <Move className="w-3 h-3 text-indigo-400 animate-pulse" />
            <span>Drag Out Image</span>
          </div>
        )}

        {/* Action Overlay */}
        <div
          className={`absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center gap-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 shadow-md transition-transform hover:scale-110 cursor-pointer"
            title="Preview full image"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDirectDownload}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
            title="Download image file"
          >
            {downloadSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom subtle drag hint */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-center text-[10px] text-white/90 font-medium">
          Drag out to desktop or folder
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
          >
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-md">
                {safeFileName}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDirectDownload}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              draggable
              onDragStart={handleDragStart}
              className="p-4 overflow-auto flex items-center justify-center bg-slate-950/5 dark:bg-slate-950/40 cursor-grab active:cursor-grabbing"
              title="Drag this full image out to your desktop"
            >
              <img
                src={imageUrl}
                alt={altText}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>

            <div className="p-2 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              Tip: You can drag this image directly out of the browser onto your desktop or file manager.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
