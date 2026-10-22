import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2, ArrowRight, Layers } from 'lucide-react';
import { uploadDocumentChunked } from '../../services/api';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTextExtracted: (extractedText: string) => void;
  title?: string;
  description?: string;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onTextExtracted,
  title = 'Upload Study Document',
  description = 'Upload your lecture notes, textbook excerpt, or draft resume (TXT, PDF, DOCX up to 50 MB).',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Real configured limit: 50 MB
  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  const MAX_CHARS = 30000;

  const processFile = async (selectedFile: File) => {
    setError(null);
    setExtractedText('');
    setUploadPercent(0);

    // 1. Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(
        `File exceeds the current server processing limit of 50 MB (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB). Please upload a smaller file.`
      );
      return;
    }

    // 2. Validate file type
    const validExtensions = ['.txt', '.pdf', '.docx'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setError('Unsupported file type. Please upload a .txt, text-based .pdf, or .docx document.');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      let text = '';

      // If file is > 10MB, use server-side chunked upload pipeline
      if (selectedFile.size > 10 * 1024 * 1024) {
        const uploadResult = await uploadDocumentChunked(selectedFile, (pct, stage) => {
          setUploadPercent(pct);
          setUploadStage(stage);
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Server-side chunked upload failed.');
        }

        text = uploadResult.extractedText || '';
      } else {
        // Fast in-browser stream parsing
        setUploadStage('Reading document in browser memory...');
        setUploadPercent(40);

        if (fileName.endsWith('.txt')) {
          text = await selectedFile.text();
        } else if (fileName.endsWith('.pdf')) {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const rawContent = decoder.decode(arrayBuffer);

          const streamMatches = rawContent.match(/BT[\s\S]*?ET/g);
          if (streamMatches && streamMatches.length > 0) {
            const lines: string[] = [];
            for (const match of streamMatches) {
              const textParts = match.match(/\((.*?)\)/g);
              if (textParts) {
                const line = textParts.map((p) => p.slice(1, -1)).join(' ');
                lines.push(line);
              }
            }
            text = lines.join('\n').trim();
          }

          if (!text || text.length < 20) {
            const readableStrings = rawContent
              .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();

            const filtered = readableStrings
              .split(' ')
              .filter((word) => word.length > 1 && !word.startsWith('/') && !word.startsWith('%PDF'))
              .join(' ');

            if (filtered.length > 40) {
              text = filtered;
            } else {
              throw new Error(
                'No readable text found in this PDF. It may be a scanned image or encrypted document. (Note: Scanned OCR is not currently supported).'
              );
            }
          }
        } else if (fileName.endsWith('.docx')) {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const content = decoder.decode(arrayBuffer);

          const wtMatches = content.match(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/g);
          if (wtMatches && wtMatches.length > 0) {
            text = wtMatches
              .map((t) => t.replace(/<[^>]+>/g, ''))
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();
          } else {
            const readable = content.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
            if (readable.length > 50) text = readable;
            else throw new Error('Could not extract text from this DOCX file. Ensure it contains standard text content.');
          }
        }

        setUploadPercent(100);
      }

      if (!text || text.trim().length === 0) {
        throw new Error('The uploaded file was parsed but contains no extractable text content.');
      }

      if (text.length > MAX_CHARS) {
        text = text.slice(0, MAX_CHARS);
      }

      setExtractedText(text);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setError(err.message || 'Failed to extract text from document. Please verify the file is not corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleApply = () => {
    if (extractedText.trim().length > 0) {
      onTextExtracted(extractedText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {!extractedText ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                {isProcessing ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {isProcessing ? 'Processing document...' : 'Click to browse or drag & drop'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supported formats: TXT, text-based PDF, DOCX (Configured limit: up to 50 MB)
              </p>

              {isProcessing && (
                <div className="mt-4 max-w-xs mx-auto space-y-2">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${uploadPercent || 45}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{uploadStage}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Text extracted successfully from {file?.name}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {extractedText.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Preview and edit extracted notes before submitting:
                </label>
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  rows={9}
                  className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all resize-y dark:text-slate-200"
                  placeholder="Extracted content..."
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setExtractedText('');
                  setFile(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
              >
                Choose another file
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Extraction notice: </strong>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!extractedText || isProcessing}
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            <span>Use Extracted Text</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
