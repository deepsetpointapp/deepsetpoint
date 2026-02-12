import Hls from 'hls.js';

export function setupHlsVideo(videoElement) {
  if (!videoElement || !videoElement.src?.includes('.m3u8')) return null;
  
  // Safari/iOS: Native HLS support (do nothing)
  if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
    return null;
  }
  
  // Firefox/Chrome without native HLS: Use HLS.js
  if (Hls.isSupported()) {
    const hls = new Hls({ autoStartLoad: true, enableWorker: true });
    hls.loadSource(videoElement.src);
    hls.attachMedia(videoElement);
    
    // Auto-play after manifest loads (with mute compliance)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoElement.play().catch(err => {
        console.warn('HLS autoplay failed (muted fallback):', err);
        videoElement.muted = true;
        videoElement.play().catch(e => console.error('Fallback failed:', e));
      });
    });
    
    return hls;
  }
  
  return null;
}