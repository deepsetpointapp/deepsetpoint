<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';

  let lang = $page.url.searchParams.get('lang') || 'fr';
  let emotion = $page.url.searchParams.get('emotion') || 'Amour';
  let isPlaying = false;
  let isComplete = false;
  let progress = 0;
  let audioElement;
  let mirrorAudioElement;
  let progressInterval;

  const translations = {
    fr: { 
      back: 'Retour', 
      transferTitle: 'Transfert DSP 18s', 
      transferBtn: 'DSP MAINTENANT', 
      mirrorTitle: 'Shift Miroir DSP 18s', 
      mirrorBtn: 'DSP MIROIR', 
      complete: 'TERMINÉ', 
      setpointSet: 'Terminé ! Votre setpoint est défini.', 
      great: 'GÉNIAL ✨', 
      forLonger: 'Pour des DSP-Shifts plus longs, appuyez ICI' 
    },
    en: { 
      back: 'Back', 
      transferTitle: 'DSP 18s Transfer', 
      transferBtn: 'DSP NOW', 
      mirrorTitle: 'DSP 18s Mirror Shift', 
      mirrorBtn: 'DSP MIRROR', 
      complete: 'COMPLETE', 
      setpointSet: 'Complete! Your setpoint is set.', 
      great: 'GREAT ✨', 
      forLonger: 'For longer DSP-Shifts, please push HERE' 
    },
    de: { 
      back: 'Zurück', 
      transferTitle: 'DSP 18s Transfer', 
      transferBtn: 'DSP JETZT', 
      mirrorTitle: 'DSP 18s Spiegel Shift', 
      mirrorBtn: 'DSP SPIEGEL', 
      complete: 'FERTIG', 
      setpointSet: 'Fertig! Dein Setpoint ist gesetzt.', 
      great: 'TOLL ✨', 
      forLonger: 'Für längere DSP-Shifts, bitte HIER drücken' 
    },
    es: { 
      back: 'Volver', 
      transferTitle: 'Transferencia DSP 18s', 
      transferBtn: 'DSP AHORA', 
      mirrorTitle: 'Shift Espejo DSP 18s', 
      mirrorBtn: 'DSP ESPEJO', 
      complete: 'COMPLETO', 
      setpointSet: '¡Completo! Tu punto de ajuste está establecido.', 
      great: 'GENIAL ', 
      forLonger: 'Para shifts DSP más largos, presiona AQUÍ' 
    },
    it: { 
      back: 'Indietro', 
      transferTitle: 'Trasferimento DSP 18s', 
      transferBtn: 'DSP ORA', 
      mirrorTitle: 'Shift Specchio DSP 18s', 
      mirrorBtn: 'DSP SPECCHIO', 
      complete: 'COMPLETO', 
      setpointSet: 'Completo! Il tuo setpoint è impostato.', 
      great: 'OTTIMO ✨', 
      forLonger: 'Per shifts DSP più lunghi, premi QUI' 
    },
    pt: { 
      back: 'Voltar', 
      transferTitle: 'Transferência DSP 18s', 
      transferBtn: 'DSP AGORA', 
      mirrorTitle: 'Shift Espelho DSP 18s', 
      mirrorBtn: 'DSP ESPELHO', 
      complete: 'COMPLETO', 
      setpointSet: 'Completo! Seu setpoint está definido.', 
      great: 'ÓTIMO ✨', 
      forLonger: 'Para shifts DSP mais longos, pressione AQUI' 
    }
  };

  $: t = translations[lang] || translations.fr;

  // Audio file paths
  const audioPath = `/${lang}-complete.mp3`;
  const mirrorAudioPath = `/${lang}-mirror.mp3`;

  function playAudio() {
    if (audioElement) {
      isPlaying = true;
      isComplete = false;
      progress = 0;
      
      audioElement.play().catch(err => {
        console.error('Audio playback error:', err);
        alert('Error playing audio. Please check if the audio file exists.');
        isPlaying = false;
      });
      
      // Update progress
      progressInterval = setInterval(() => {
        if (audioElement && audioElement.duration) {
          progress = (audioElement.currentTime / audioElement.duration) * 100;
        }
      }, 100);
    }
  }

  function playMirrorAudio() {
    if (mirrorAudioElement) {
      // Reset main audio state if playing
      if (isPlaying && audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      
      isPlaying = true;
      isComplete = false;
      progress = 0;
      
      mirrorAudioElement.play().catch(err => {
        console.error('Mirror audio playback error:', err);
        alert('Error playing mirror audio. Please check if the audio file exists.');
        isPlaying = false;
      });
      
      progressInterval = setInterval(() => {
        if (mirrorAudioElement && mirrorAudioElement.duration) {
          progress = (mirrorAudioElement.currentTime / mirrorAudioElement.duration) * 100;
        }
      }, 100);
    }
  }

  function handleAudioEnd() {
    isPlaying = false;
    isComplete = true;
    progress = 100;
    if (progressInterval) clearInterval(progressInterval);
  }

  function goToDuration() {
    goto(`/duration?lang=${lang}&emotion=${emotion}`);
  }
  
  function goBack() {
    // Reset everything when going back
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    if (mirrorAudioElement) {
      mirrorAudioElement.pause();
      mirrorAudioElement.currentTime = 0;
    }
    isPlaying = false;
    isComplete = false;
    progress = 0;
    if (progressInterval) clearInterval(progressInterval);
    goto('/emotions?lang=' + lang);
  }

  onMount(() => {
    // Preload audio files
    if (audioElement) {
      audioElement.load();
    }
    if (mirrorAudioElement) {
      mirrorAudioElement.load();
    }
    
    // Cleanup on unmount
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  });

  onDestroy(() => {
    if (progressInterval) clearInterval(progressInterval);
  });
</script>

<svelte:head>
  <title>{emotion} - DSP</title>
</svelte:head>

<div class="container">
  <!-- Hidden audio elements -->
  <audio 
    bind:this={audioElement} 
    src={audioPath}
    on:ended={handleAudioEnd}
    on:error={(e) => console.error('Audio error:', e)}
  ></audio>
  
  <audio 
    bind:this={mirrorAudioElement} 
    src={mirrorAudioPath}
    on:ended={handleAudioEnd}
    on:error={(e) => console.error('Mirror audio error:', e)}
  ></audio>

  <!-- Back Button with transparency -->
  <button class="btn-back" on:click={goBack}>
    <span>←</span>
    <span>{t.back}</span>
  </button>

  <!-- Emotion Display - larger and centered -->
  <div class="emotion-display">
    {emotion}
  </div>

  {#if !isComplete}
    <!-- DSP Transfer Button -->
    <div class="action-block">
      <h3>{t.transferTitle}</h3>
      <button 
        class="btn-primary {isPlaying ? 'playing' : ''}" 
        on:click={playAudio}
        disabled={isPlaying}
      >
        {#if isPlaying}
          <span class="spinner"></span>
          <span>{Math.round(progress)}%</span>
        {:else}
          {t.transferBtn}
        {/if}
      </button>
    </div>

    <!-- Mirror Shift Button - always visible -->
    <div class="action-block">
      <h3>{t.mirrorTitle}</h3>
      <button 
        class="btn-secondary"
        on:click={playMirrorAudio}
      >
        {t.mirrorBtn}
      </button>
    </div>
  {:else}
    <!-- Complete State -->
    <div class="complete-state">
      <div class="action-block">
        <h3>{t.transferTitle}</h3>
        <button class="btn-primary complete">
          ✓ {t.complete}
        </button>
        <p class="status-message">{t.setpointSet}</p>
      </div>
      
      <button class="banner-btn" on:click={goToDuration}>
        <span class="banner-title">{t.great}</span>
        <span class="banner-text">{t.forLonger}</span>
      </button>
    </div>
  {/if}
</div>

<style>
  .container {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: radial-gradient(ellipse 60% 55% at 50% 42%, rgba(255, 244, 190, 0.55), transparent 70%), 
                linear-gradient(150deg, #FBD95A, #F5C518 42%, #DDA10C);
    background-attachment: fixed;
    gap: 2rem;
    position: relative;
  }

  /* Back Button with transparency */
  .btn-back {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    height: 3rem;
    padding: 0 1.25rem 0 1rem;
    border-radius: 999px;
    background: rgba(27, 20, 5, 0.65); /* Added transparency */
    color: #FFF8E1;
    font: 600 1rem/1 system-ui, sans-serif;
    border: 1.5px solid rgba(255, 255, 255, 0.45); /* Added border */
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 100;
    transition: transform 0.1s, background 0.16s;
  }
  .btn-back:hover { 
    background: rgba(43, 32, 8, 0.85); 
    transform: translateX(2px); 
  }

  /* Emotion Display - larger and centered */
  .emotion-display {
    font-size: 4rem; /* Increased from 2.5rem */
    font-weight: 700;
    color: #1B1405;
    text-shadow: 0 2px 4px rgba(255,255,255,0.5);
    text-align: center;
    margin-bottom: 1rem;
  }

  .action-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 500px;
  }

  .action-block h3 {
    font-size: 1.4rem; /* Slightly larger */
    font-weight: 600;
    color: #1B1405;
    margin: 0;
    text-align: center;
  }

  /* Primary Button with transparency */
  .btn-primary {
    width: 100%;
    max-width: 400px;
    height: 4rem;
    border-radius: 999px;
    border: none;
    background: rgba(27, 20, 5, 0.9); /* Added transparency */
    color: #FBD95A;
    font: 600 1.25rem/1 system-ui, sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    box-shadow: 0 4px 12px rgba(74, 55, 8, 0.16), 0 1px 2px rgba(74, 55, 8, 0.12);
    transition: transform 0.1s, background 0.16s, box-shadow 0.16s;
  }
  
  .btn-primary:hover:not(:disabled) {
    background: rgba(43, 32, 8, 0.95);
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(27, 20, 5, 0.28);
  }
  
  .btn-primary:disabled { 
    opacity: 0.7; 
    cursor: not-allowed; 
  }

  /* Secondary Button (Mirror) with transparency - ALWAYS VISIBLE */
  .btn-secondary {
    width: 100%;
    max-width: 400px;
    height: 4rem;
    border-radius: 999px;
    border: none;
    background: rgba(139, 92, 246, 0.85); /* Purple with transparency */
    color: white;
    font: 600 1.25rem/1 system-ui, sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    transition: transform 0.1s, background 0.16s, box-shadow 0.16s;
  }
  
  .btn-secondary:hover {
    background: rgba(139, 92, 246, 0.95);
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(139, 92, 246, 0.4);
  }

  .spinner {
    width: 1.2rem;
    height: 1.2rem;
    border: 3px solid rgba(251, 217, 90, 0.3);
    border-radius: 50%;
    border-top-color: #FBD95A;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin { 
    to { transform: rotate(360deg); } 
  }

  .complete-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    text-align: center;
  }

  .status-message {
    font-size: 1.2rem;
    font-weight: 500;
    color: #1B1405;
    margin: 0.5rem 0 0 0;
  }

  .banner-btn {
    width: 100%;
    max-width: 500px;
    padding: 1.5rem;
    border-radius: 1.75rem;
    background: rgba(27, 20, 5, 0.9);
    color: #FFF8E1;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(74, 55, 8, 0.16), 0 1px 2px rgba(74, 55, 8, 0.12);
    transition: transform 0.1s, box-shadow 0.16s;
  }
  
  .banner-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(27, 20, 5, 0.28);
  }
  
  .banner-title { 
    font-size: 1.375rem; 
    font-weight: 700; 
  }
  
  .banner-text { 
    font-size: 1.125rem; 
    font-weight: 500; 
  }

  @media (max-width: 640px) {
    .emotion-display { 
      font-size: 3rem; 
    }
    .btn-back { 
      font-size: 0.9rem; 
      height: 2.75rem; 
    }
    .action-block h3 {
      font-size: 1.2rem;
    }
    .btn-primary, .btn-secondary {
      height: 3.5rem;
      font-size: 1.1rem;
    }
  }
</style>