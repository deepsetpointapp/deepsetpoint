<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';
  import { setupHlsVideo } from '$lib/hls-player.js';

  let lang = $page.url.searchParams.get('lang') || 'en';
  let emotion = $page.url.searchParams.get('emotion') || '';
  let duration = parseInt($page.url.searchParams.get('duration')) || 15;
  
  let videoEl = null;
  let countdown = `${duration.toString().padStart(2, '0')}:00`;
  let countdownInterval = null;
  let fadeTimer = null;
  let endTimer = null;
  let hlsInstance = null;
  
  const translations = {
    en: { back: '← Back', title: '{duration} Minutes Meditation ⏱️' },
    fr: { back: '← Retour', title: '{duration} Minutes Méditation ⏱️' },
    de: { back: '← Zurück', title: '{duration} Minuten Meditation ⏱️' },
    pt: { back: '← Voltar', title: '{duration} Minutos Meditação ⏱️' },
    es: { back: '← Volver', title: '{duration} Minutos Meditación ⏱️' },
    it: { back: '← Indietro', title: '{duration} Minuti Meditazione ⏱️' }
  };
  
  let t = translations[lang] || translations.en;
  $: title = t.title.replace('{duration}', duration);
  
  function goBack() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (fadeTimer) clearTimeout(fadeTimer);
    if (endTimer) clearTimeout(endTimer);
    if (videoEl) videoEl.pause();
    goto(`/duration/custom-video?lang=${lang}&emotion=${encodeURIComponent(emotion)}`);
  }
  
  function handleVideoEnd() {
    goBack();
  }
  
  function handleCanPlay() {
    setTimeout(() => {
      if (videoEl) {
        videoEl.muted = false;
        videoEl.volume = 1;
      }
    }, 1000);
    
    let remaining = duration * 60;
    countdownInterval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        countdown = '00:00';
        return;
      }
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      countdown = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
    
    const fadeStartTime = Math.max(0, (duration * 60 - 30) * 1000);
    fadeTimer = setTimeout(() => {
      if (!videoEl) return;
      const fadeDuration = 30000;
      const startVolume = videoEl.volume;
      const startOpacity = 1;
      const startTime = Date.now();
      const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / fadeDuration, 1);
        if (videoEl) {
          videoEl.volume = startVolume * (1 - progress);
        }
        const container = document.querySelector('.video-container');
        if (container) {
          container.style.opacity = (startOpacity * (1 - progress)).toString();
        }
        if (progress >= 1) {
          clearInterval(fadeInterval);
        }
      }, 50);
    }, fadeStartTime);
    
    endTimer = setTimeout(() => {
      goBack();
    }, duration * 60 * 1000);
  }
  
  onMount(() => {
    if (videoEl) {
      hlsInstance = setupHlsVideo(videoEl);
      if (!hlsInstance) {
        videoEl.play().catch(err => console.error('Autoplay failed:', err));
      }
    }
  });
  
  onDestroy(() => {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    if (countdownInterval) clearInterval(countdownInterval);
    if (fadeTimer) clearTimeout(fadeTimer);
    if (endTimer) clearTimeout(endTimer);
    if (videoEl) videoEl.pause();
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover"/>
</svelte:head>

<div class="video-container" style="position:fixed;top:0;left:0;width:100vw;height:100dvh;z-index:9999;background:black;overflow:hidden;margin:0;padding:0;opacity:1;transition:opacity 1s ease">
  <video 
    bind:this={videoEl}
    src="https://customer-b3ykgf0wdbmm63pk.cloudflarestream.com/4c0d8714d59acb935639e4ddab88245e/manifest/video.m3u8"
    muted
    autoplay
    playsinline
    loop
    disablepictureinpicture
    controlsList="nodownload nofullscreen noremoteplayback"
    on:ended={handleVideoEnd}
    on:canplay={handleCanPlay}
    style="position:absolute;top:-10px;left:-10px;right:-10px;bottom:-10px;width:calc(100% + 20px);height:calc(100% + 20px);object-fit:fill;display:block;z-index:9998;margin:0;padding:0;border:0;outline:0;pointer-events:none"
  ></video>
  
  <button 
    on:click={goBack}
    style="position:fixed; top:0.5rem; left:0.5rem; padding:0.25rem 0.5rem; font-size:0.85rem; min-height:2rem; background:rgba(0,0,0,0.6); color:white; border:none; border-radius:0.6rem; z-index:10000; max-width:10rem !important; width:auto; box-shadow:0 2px 6px rgba(0,0,0,0.25); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
  >
    {t.back}
  </button>
  
  <div style="position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:white;padding:0.5rem 1.5rem;border-radius:1.5rem;font-size:1.25rem;font-weight:700;backdrop-filter:blur(8px);z-index:9999;box-shadow:0 4px 15px rgba(0,0,0,0.4)">
    {countdown}
  </div>
</div>

<style>
  button:hover { 
    background:rgba(255,255,255,0.2); 
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
  }
  button:active { 
    transform: scale(0.95);
    background:rgba(255,255,255,0.3) !important;
  }
  video::-webkit-media-controls, 
  video::-moz-media-controls, 
  video::-ms-media-controls, 
  video::media-controls { 
    display:none!important 
  }
  :global(html), :global(body) { 
    margin:0!important;
    padding:0!important;
    overflow:hidden!important;
    width:100vw!important;
    height:100dvh!important;
  }
  :global(*) {
    margin:0!important;
    padding:0!important;
  }
</style>