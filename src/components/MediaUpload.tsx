import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image, Video, FileImage, Sparkles } from 'lucide-react';
import anime from 'animejs';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'gif';
}

interface MediaUploadProps {
  onFilesChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export function MediaUpload({ 
  onFilesChange, 
  maxFiles = 10, 
  maxFileSize = 50,
  acceptedTypes = ['image/*', 'video/*'],
  className = ''
}: MediaUploadProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "파일 크기 초과",
        description: `파일 크기는 ${maxFileSize}MB 이하여야 합니다.`,
        variant: "destructive"
      });
      return false;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      toast({
        title: "지원하지 않는 파일 형식",
        description: "이미지, GIF, 비디오 파일만 업로드 가능합니다.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const getFileType = (file: File): 'image' | 'video' | 'gif' => {
    if (file.type === 'image/gif') return 'gif';
    if (file.type.startsWith('video/')) return 'video';
    return 'image';
  };

  const createMediaFile = (file: File): Promise<MediaFile> => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substr(2, 9);
      const type = getFileType(file);
      
      if (type === 'video') {
        // For videos, create a thumbnail
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.onloadedmetadata = () => {
          video.currentTime = 1; // Seek to 1 second for thumbnail
        };
        video.oncanplay = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          const preview = canvas.toDataURL();
          URL.revokeObjectURL(video.src);
          resolve({ id, file, preview, type });
        };
      } else {
        // For images and GIFs
        const preview = URL.createObjectURL(file);
        resolve({ id, file, preview, type });
      }
    });
  };

  const handleFiles = async (fileList: FileList) => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    if (files.length + validFiles.length > maxFiles) {
      toast({
        title: "파일 개수 초과",
        description: `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`,
        variant: "destructive"
      });
      return;
    }

    try {
      const mediaFiles = await Promise.all(
        validFiles.map(file => createMediaFile(file))
      );
      
      const newFiles = [...files, ...mediaFiles];
      setFiles(newFiles);
      onFilesChange(newFiles);

      // Animate new files
      setTimeout(() => {
        anime({
          targets: '.media-item:last-child',
          scale: [0, 1],
          opacity: [0, 1],
          duration: 600,
          easing: 'easeOutElastic(1, .6)'
        });
      }, 100);

      toast({
        title: "업로드 완료! ✨",
        description: `${mediaFiles.length}개 파일이 추가되었습니다.`,
      });
    } catch (error) {
      toast({
        title: "업로드 실패",
        description: "파일 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const removeFile = (id: string) => {
    const newFiles = files.filter(file => file.id !== id);
    setFiles(newFiles);
    onFilesChange(newFiles);

    toast({
      title: "파일 제거됨",
      description: "선택한 파일이 제거되었습니다.",
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [files]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: 'image' | 'video' | 'gif') => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'gif':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-all duration-300 cursor-pointer bondee-card ${
          dragOver 
            ? 'border-purple-400 bg-purple-50 scale-105' 
            : 'border-purple-200 hover:border-purple-300'
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={openFileDialog}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center sparkle-effect ${dragOver ? 'animate-bounce-3d' : 'floating-3d'}`}>
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                미디어 파일 업로드 📸
              </h3>
              <p className="text-muted-foreground text-sm">
                이미지, GIF, 비디오를 드래그 앤 드롭하거나 클릭하여 업로드하세요
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                최대 {maxFiles}개 파일, 파일당 {maxFileSize}MB 이하
              </p>
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="outline" className="border-purple-200 text-purple-600">
                <FileImage className="w-3 h-3 mr-1" />
                이미지
              </Badge>
              <Badge variant="outline" className="border-pink-200 text-pink-600">
                <Sparkles className="w-3 h-3 mr-1" />
                GIF
              </Badge>
              <Badge variant="outline" className="border-purple-200 text-purple-600">
                <Video className="w-3 h-3 mr-1" />
                비디오
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Uploaded Files Preview */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            업로드된 파일 ({files.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {files.map((mediaFile) => (
              <Card key={mediaFile.id} className="media-item bondee-card relative overflow-hidden group">
                <CardContent className="p-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {mediaFile.type === 'video' ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={mediaFile.preview} 
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={mediaFile.preview} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* File type badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-1 left-1 text-xs bg-white/80 backdrop-blur-sm"
                    >
                      {getFileIcon(mediaFile.type)}
                      {mediaFile.type.toUpperCase()}
                    </Badge>
                    
                    {/* Remove button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(mediaFile.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {/* File info */}
                  <div className="mt-2 text-xs text-muted-foreground truncate">
                    {mediaFile.file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(mediaFile.file.size / 1024 / 1024).toFixed(1)} MB
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}