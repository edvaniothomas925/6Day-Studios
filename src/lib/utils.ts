import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDirectLink(url: string): string {
  if (!url) return '';
  
  // Google Drive
  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }
  
  // YouTube (standard to embed)
  if (url.includes('youtube.com/watch?v=')) {
    const id = url.split('v=')[1]?.split('&')[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtube.com/shorts/')) {
    const id = url.split('shorts/')[1]?.split('?')[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }

  // SoundCloud
  if (url.includes('soundcloud.com')) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23d4af37&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
  }

  return url;
}

export function getYoutubeThumbnail(url: string): string {
  if (!url) return '';
  
  let videoId = '';
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('embed/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/shorts/')) {
    videoId = url.split('shorts/')[1]?.split('?')[0];
  }

  if (videoId) {
    return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  }
  
  return '';
}

export function getYoutubeThumbnailFallback(url: string): string {
  if (!url) return '';
  
  let videoId = '';
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('embed/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/shorts/')) {
    videoId = url.split('shorts/')[1]?.split('?')[0];
  }

  if (videoId) {
    // Usando hqdefault como fallback mais seguro que maxresdefault
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }
  
  return '';
}

export function isValidMediaUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    const supportedHosts = [
      'youtube.com',
      'youtu.be',
      'soundcloud.com',
      'drive.google.com',
      'dropbox.com'
    ];

    const isSupportedHost = supportedHosts.some(host => hostname.includes(host));
    const isDirectFile = /\.(mp4|mp3|wav|mov|webm)$/i.test(url);

    return isSupportedHost || isDirectFile;
  } catch (e) {
    return false;
  }
}
