<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onDestroy, onMount, tick } from 'svelte'; // ✅ ADDED tick
  
  let lang = $page.url.searchParams.get('lang') || 'en';
  let emotion = $page.url.searchParams.get('emotion') || '';
  
  let audio = null;
  let isPlaying = false;
  let progress = 0;
  let timer = null;
  let duration = 18;

  const translations = {
    en: { back: '← Back', title: 'DSP 18s Transfer', mirror_title: 'DSP 18s Mirror Shift', button: 'DSP NOW', mirror_button: 'DSP MIRROR', complete: 'Complete! Your setpoint is set.', emotion: 'Your emotion: {emotion}', great: 'GREAT 🌟', next: 'For longer DSP-Shifts, please push HERE', phase1: 'INHALE', phase2: 'HOLD', phase3: 'EXHALE', phase4: 'HOLD', phase5: 'DEEP INHALE', phase6: 'INTEGRATE' },
    fr: { back: '← Retour', title: 'DSP 18s Transfert', mirror_title: 'DSP 18s Miroir', button: 'DSP MAINTENANT', mirror_button: 'DSP MIROIR', complete: 'Terminé ! Ton setpoint est fixé.', emotion: 'Ton émotion: {emotion}', great: 'GÉNIAL 🌟', next: 'Pour des DSP-Shifts plus longs, appuie ICI', phase1: 'INSPIRE', phase2: 'RETIENT', phase3: 'EXPIRE', phase4: 'RETIENT', phase5: 'INSPIRE PROFOND', phase6: 'INTÈGRE' },
    de: { back: '← Zurück', title: 'DSP 18s Transfer', mirror_title: 'DSP 18s Spiegel Shift', button: 'DSP JETZT', mirror_button: 'DSP SPIEGEL', complete: 'Fertig! Dein Setpoint ist gesetzt.', emotion: 'Deine Emotion: {emotion}', great: 'TOLL 🌟', next: 'Für längere DSP-Shifts, drücke HIER', phase1: 'EINATMEN', phase2: 'HALTEN', phase3: 'AUSATMEN', phase4: 'HALTEN', phase5: 'TIEF EINATMEN', phase6: 'INTEGRIEREN' },
    pt: { back: '← Voltar', title: 'DSP 18s Transfer', mirror_title: 'DSP 18s Espelho', button: 'DSP AGORA', mirror_button: 'DSP ESPELHO', complete: 'Concluído! Seu setpoint está definido.', emotion: 'Sua emoção: {emotion}', great: 'ÓTIMO 🌟', next: 'Para DSP-Shifts mais longos, clique AQUI', phase1: 'INSPIRAR', phase2: 'SEGURAR', phase3: 'EXPIRAR', phase4: 'SEGURAR', phase5: 'INSPIRAR FUNDO', phase6: 'INTEGRAR' },
    es: { back: '← Volver', title: 'Transferencia DSP 18s', mirror_title: 'DSP 18s Espejo', button: 'DSP AHORA', mirror_button: 'DSP ESPEJO', complete: '¡Completado! Tu setpoint está fijado.', emotion: 'Tu emoción: {emotion}', great: '¡GENIAL 🌟', next: 'Para DSP-Shifts más largos, presiona AQUÍ', phase1: 'INHALAR', phase2: 'RETENER', phase3: 'EXHALAR', phase4: 'RETENER', phase5: 'INHALAR PROFUNDO', phase6: 'INTEGRAR' },
    it: { back: '← Indietro', title: 'Trasferimento DSP 18s', mirror_title: 'DSP 18s Specchio', button: 'DSP ORA', mirror_button: 'DSP SPECCHIO', complete: 'Completato! Il tuo setpoint è impostato.', emotion: 'La tua emozione: {emotion}', great: 'OTTIMO 🌟', next: 'Per DSP-Shifts più lunghi, premi QUI', phase1: 'INSPIRA', phase2: 'TRATTIENI', phase3: 'ESPIRA', phase4: 'TRATTIENI', phase5: 'INSPIRA PROFONDO', phase6: 'INTEGRA' }
  };

  $: t = translations[lang] || translations.en;
  $: emotionText = t.emotion.replace('{emotion}', emotion);
  $: audioSrc = duration === 36 ? `/audio/${lang}-mirror.mp3` : `/audio/${lang}-complete.mp3`;
  $: secondsInPhase = 6 - (progress % 6);
  $: phaseNumber = Math.floor(progress / 6) + 1;
  $: mirrorPhaseColor = getMirrorPhaseColor(progress);

  function getMirrorPhaseColor(p) {
    if (p < 6) return '#64ffc8';
    if (p < 12) return '#ffd700';
    if (p < 18) return '#ff6b6b';
    if (p < 24) return '#a0a0ff';
    if (p < 30) return '#64ffc8';
    return '#ffd700';
  }

  function getMirrorPhaseName(p) {
    if (p < 6) return t.phase1;
    if (p < 12) return t.phase2;
    if (p < 18) return t.phase3;
    if (p < 24) return t.phase4;
    if (p < 30) return t.phase5;
    return t.phase6;
  }

  function goBack() {
    goto(`/emotions?lang=${lang}`);
  }

  function startDSP(durationSeconds = 18) {
    if (isPlaying && duration !== durationSeconds) {
      clearInterval(timer);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      progress = 0;
    }
    
    duration = durationSeconds;
    const newAudioSrc = duration === 36 ? `/audio/${lang}-mirror.mp3` : `/audio/${lang}-complete.mp3`;
    
    if (!audio || audio.src !== newAudioSrc) {
      if (audio) {
        audio.pause();
        audio.src = newAudioSrc;
        audio.load();
      } else {
        audio = new Audio(newAudioSrc);
        audio.preload = 'auto';
      }
    }
    
    isPlaying = true;
    progress = 0;
    
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.warn('Audio autoplay blocked:', err);
    });
    
    timer = setInterval(() => {
      progress += 1;
      if (progress >= duration) {
        clearInterval(timer);
        progress = duration;
        isPlaying = false;
        if (audio) audio.pause();
      }
    }, 1000);
  }

  function goDuration() {
    goto(`/duration?lang=${lang}&emotion=${encodeURIComponent(emotion)}`);
  }

  // ✅ CRITICAL FIX: RESET SCROLL AFTER FULL RENDER (PREVENTS DISPLACEMENT)
  onMount(async () => {
    await tick(); // Wait for DOM to fully render
    window.scrollTo(0, 0);
    // Force scroll reset again after any async content loads
    setTimeout(() => window.scrollTo(0, 0), 100);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
    if (audio) {
      audio.pause();
      audio = null;
    }
  });
</script>

<svelte:head>
  <title>{t.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
</svelte:head>

<!-- ✅ FIXED CONTAINER: PREVENTS LAYOUT SHIFT FROM DYNAMIC CONTENT -->
<main style="min-height:100vh; height:100%; background: linear-gradient(135deg, #f4c430 0%, #e6b800 50%, #b8860b 100%); padding:1.5rem; font-family: -apple-system, sans-serif; text-align:center; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;">
  <button 
    on:click={goBack}
    style="position:fixed; top:0.5rem; left:0.5rem; padding:0.25rem 0.5rem; font-size:0.85rem; min-height:2rem; background:rgba(0,0,0,0.6); color:white; border:none; border-radius:0.6rem; z-index:10000; max-width:10rem !important; width:auto; box-shadow:0 2px 6px rgba(0,0,0,0.25); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
  >
    {t.back}
  </button>

  <!-- ✅ FIXED HEIGHT CONTAINER FOR EMOTION NOTICE (PREVENTS SHIFT) -->
  <div style="margin-top:3rem; padding:0.8rem; background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); border-radius:1rem; max-width:24rem; margin:1.5rem auto 0; min-height:3rem; display:flex; align-items:center; justify-content:center;">
    <div style="color:#4ade80; font-size:var(--text-sm); font-weight:700; text-shadow:0 2px 4px rgba(0,0,0,0.2);">
      {emotion}
    </div>
  </div>

  <!-- ✅ FIXED HEIGHT CONTAINER FOR BUTTONS (PREVENTS SHIFT) -->
  <div style="margin-top:1.5rem; max-width:280px; width:100%; margin-left:auto; margin-right:auto; min-height:300px; display:flex; flex-direction:column; justify-content:flex-start;">
    <div style="margin-bottom:1.6rem;">
      <h2 style="font-size:var(--text-base); font-weight:800; color:white; text-shadow:0 2px 4px rgba(0,0,0,0.2); margin-bottom:0.9rem;">
        {t.title}
      </h2>
      
      {#if isPlaying && duration === 18}
        <div style="margin:1rem 0;">
          <div style="width:100%; height:0.6rem; background:rgba(255,255,255,0.25); border-radius:10px; margin:0 auto 0.7rem; overflow:hidden;">
            <div style="height:100%; background:linear-gradient(90deg, #00ff88, #00cc6a); border-radius:10px; width:{(progress/duration)*100}%; transition:width 0.6s ease;"></div>
          </div>
          <div style="color:white; font-size:var(--text-sm); font-weight:700; text-shadow:0 2px 4px rgba(0,0,0,0.3);">
            {String(18 - progress).padStart(2, '0')}
          </div>
        </div>
      {/if}

      <button 
        on:click={() => startDSP(18)}
        disabled={isPlaying && duration === 18}
        style="padding:0.45rem 1rem; background:linear-gradient(45deg,#00ff88,#00cc6a); color:white; border:none; border-radius:1.1rem; font-size:var(--text-sm); font-weight:700; backdrop-filter:blur(12px); box-shadow:0 4px 15px rgba(0,255,136,0.3); cursor:pointer; transition:all .2s ease; max-width:12rem; width:auto; min-height:2.6rem; {isPlaying && duration === 18 ? 'opacity:0.7; cursor:not-allowed;' : ''}"
      >
        {#if isPlaying && duration === 18}
          🟢 LIVE
        {:else if progress === 18 && duration === 18}
          ✅ COMPLETE
        {:else}
          {t.button}
        {/if}
      </button>
    </div>

    <div style="margin-bottom:1.6rem;">
      <h2 style="font-size:var(--text-base); font-weight:800; color:white; text-shadow:0 2px 4px rgba(0,0,0,0.2); margin-bottom:0.9rem;">
        {t.mirror_title}
      </h2>
      
      {#if isPlaying && duration === 36 && progress < 36}
        <div style="margin:1.2rem 0; min-height:60px;">
          <div style="font-size:clamp(1.8rem, 5vw, 2.4rem); font-weight:800; color:{mirrorPhaseColor}; text-shadow:0 3px 8px rgba(0,0,0,0.3); letter-spacing:-0.02em; transition:color 0.3s ease;">
            {getMirrorPhaseName(progress)}
          </div>
        </div>
        
        <div style="font-size:clamp(1.6rem, 4.5vw, 2.2rem); font-weight:800; color:white; text-shadow:0 2px 6px rgba(0,0,0,0.35); margin:0.6rem 0; transition:transform 0.25s ease;">
          <span style="color:{mirrorPhaseColor};">{secondsInPhase.toString().padStart(2, '0')}</span> / 06
        </div>
        
        <div style="width:100%; height:0.6rem; background:rgba(255,255,255,0.2); border-radius:10px; margin:0.8rem auto 0; overflow:hidden;">
          <div style="height:100%; background:{mirrorPhaseColor}; border-radius:10px; width:{(progress/36)*100}%; transition:width 0.6s linear;"></div>
        </div>
        
        <div style="color:rgba(255,255,255,0.85); font-size:var(--text-xs); margin-top:0.4rem;">
          Phase {phaseNumber} of 6
        </div>
      {/if}

      <button 
        on:click={() => startDSP(36)}
        disabled={isPlaying && duration === 36}
        style="padding:0.45rem 1rem; background:linear-gradient(45deg,#8a2be2,#9370db); color:white; border:none; border-radius:1.1rem; font-size:var(--text-sm); font-weight:700; backdrop-filter:blur(12px); box-shadow:0 4px 15px rgba(138,43,226,0.3); cursor:pointer; transition:all .2s ease; max-width:12rem; width:auto; min-height:2.6rem; {isPlaying && duration === 36 ? 'opacity:0.7; cursor:not-allowed;' : ''}"
      >
        {#if isPlaying && duration === 36}
          🟣 LIVE
        {:else if progress === 36 && duration === 36}
          ✅ COMPLETE
        {:else}
          {t.mirror_button}
        {/if}
      </button>
    </div>

    {#if progress === duration && duration > 0}
      <div style="margin-top:1.5rem; color:#4ade80; font-size:var(--text-sm); font-weight:700; margin-bottom:1.8rem; padding:0 0.8rem;">
        {t.complete}
      </div>
      
      <div style="padding:1.2rem; background:rgba(255,255,255,0.1); border-radius:1.6rem; backdrop-filter:blur(10px); max-width:280px; margin:0 auto;">
        <button 
          on:click={goDuration}
          style="background:linear-gradient(135deg, #ffd700, #ffed4a); color:#1a1a1a; border:none; padding:0.7rem 1.6rem; border-radius:1.4rem; font-size:var(--text-sm); font-weight:800; box-shadow:0 8px 25px rgba(255,215,0,0.45); cursor:pointer; transition:all .25s ease; width:100%;"
        >
          <div>{t.great}</div>
          <div style="font-size:var(--text-xs); font-weight:500;">{t.next}</div>
        </button>
      </div>
    {/if}
  </div>
</main>

<style>
  button:hover:not(:disabled) {
    transform: translateY(-1.5px) scale(1.025);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
  }
  button:active {
    transform: translateY(0.5px) scale(0.985);
  }
  
  :global(html, body) {
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important; /* Prevent horizontal scroll */
    width: 100vw !important;
    height: 100vh !important;
  }
  
  /* CRITICAL: PREVENT BROWSER SCROLL RESTORATION */
  :global(body) {
    scroll-behavior: auto !important;
  }
</style>