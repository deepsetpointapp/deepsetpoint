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
      complete: 'COMPLETE', 
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
      great: 'GENIAL ✨',
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

  // Audio file paths - CORRECTED based on actual file structure
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

  <!-- Back Button -->
  <button class="btn-back" on:click={goBack}>
    <span>←</span>
    <span>{t.back}</span>
  </button>

  <!-- Emotion Display -->
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

    <!-- Mirror Shift Button -->
    <div class="action-block">
      <h3>{t.mirrorTitle}</h3>
      <button 
        class="btn-secondary {isPlaying ? 'playing' : ''}" 
        on:click={playMirrorAudio}
        disabled={isPlaying}
      >
        {#if isPlaying}
          <span class="spinner"></span>
          <span>{Math.round(progress)}%</span>
        {:else}
          {t.mirrorBtn}
        {/if}
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
  }

  .btn-back {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    height: 3rem;
    padding: 0 1.25rem 0 1rem;
    border-radius: 999px;
    background: rgba(27, 20, 5, 0.9);
    color: #FFF8E1;
    font: 600 1rem/1 system-ui, sans-serif;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 100;
    transition: transform 0.1s, background 0.16s;
  }
  .btn-back:hover { 
    background: rgba(43, 32, 8, 0.95); 
    transform: translateX(2px); 
  }

  .emotion-display {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1B1405;
    text-shadow: 0 2px 4px rgba(255,255,255,0.5);
  }

  .action-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
  }

  .action-block h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1B1405;
    margin: 0;
    text-align: center;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    height: 4rem;
    border-radius: 999px;
    border: none;
    font: 600 1.25rem/1 system-ui, sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    box-shadow: 0 4px 12px rgba(74, 55, 8, 0.16), 0 1px 2px rgba(74, 55, 8, 0.12);
    transition: transform 0.1s, box-shadow 0.16s;
  }

  .btn-primary {
    background: #1B1405;
    color: #FBD95A;
  }
  
  .btn-secondary {
    background: #8B5CF6;
    color: white;
  }

  .btn-primary:hover:not(:disabled), 
  .btn-secondary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(27, 20, 5, 0.28);
  }
  
  .btn-primary:disabled, .btn-secondary:disabled { 
    opacity: 0.7; 
    cursor: not-allowed; 
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
    background: #1B1405;
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
</style>