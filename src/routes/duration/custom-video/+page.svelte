<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, tick, onDestroy } from 'svelte';
  let lang = $page.url.searchParams.get('lang') || 'en';
  let emotion = $page.url.searchParams.get('emotion') || '';
  let isDragging = false;
  let isBrowser = false;
  let sliderRef = null;
  
  const translations = {
    en: { back: '← Back', title: 'Custom Duration', set: 'Set Your Perfect Duration', minutes: 'Minutes', start: 'Begin Shift' },
    fr: { back: '← Retour', title: 'Durée Personnalisée', set: 'Définissez Votre Durée Idéale', minutes: 'Minutes', start: 'Commencer le Shift' },
    de: { back: '← Zurück', title: 'Benutzerdefinierte Dauer', set: 'Stellen Sie Ihre Perfekte Dauer Ein', minutes: 'Minuten', start: 'Shift Beginnen' },
    pt: { back: '← Voltar', title: 'Duração Personalizada', set: 'Defina Sua Duração Perfeita', minutes: 'Minutos', start: 'Iniciar Shift' },
    es: { back: '← Volver', title: 'Duración Personalizada', set: 'Establezca Su Duración Perfecta', minutes: 'Minutos', start: 'Iniciar Shift' },
    it: { back: '← Indietro', title: 'Durata Personalizzata', set: 'Imposta La Tua Durata Perfetta', minutes: 'Minuti', start: 'Avvia Shift' }
  };
  let selectedDuration = 15;
  $: gradientProgress = (selectedDuration / 120) * 100;
  $: t = translations[lang] || translations.en;
  
  function startVideo() {
    goto(`/duration/custom-play?lang=${lang}&emotion=${encodeURIComponent(emotion)}&duration=${selectedDuration}`);
  }
  function goBack() {
    goto(`/duration?lang=${lang}&emotion=${encodeURIComponent(emotion)}`);
  }
  function handleSliderChange(event) {
    selectedDuration = parseInt(event.target.value);
  }
  function handleDragStart() {
    isDragging = true;
    if (isBrowser) {
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }
  }
  function handleDragEnd() {
    isDragging = false;
    if (isBrowser) {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }
  onMount(async () => {
    isBrowser = true;
    selectedDuration = 15;
    await tick();
    
    // ✅ CRITICAL: FORCE LAYOUT RECALCULATION
    if (sliderRef) {
      sliderRef.value = '15';
      sliderRef.setAttribute('autocomplete', 'off');
      // Force reflow to fix responsive proportions
      sliderRef.style.display = 'none';
      await tick();
      sliderRef.style.display = '';
    }
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100);
  });
  onDestroy(() => {
    selectedDuration = 15;
    if (isBrowser) {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
</script>

<svelte:head>
  <title>{t.title}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover"/>
</svelte:head>

<div style="min-height:100vh; height:100%; background:linear-gradient(135deg,#f4c430 0%,#e6b800 50%,#b8860b 100%); padding:1.5rem; color:white; font-family:-apple-system,sans-serif; position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;">
  <button 
    on:click={goBack}
    style="position:fixed; top:0.5rem; left:0.5rem; padding:0.25rem 0.5rem; font-size:0.85rem !important; min-height:2rem; background:rgba(0,0,0,0.6); color:white; border:none; border-radius:0.6rem; z-index:10000; max-width:10rem !important; width:auto; box-shadow:0 2px 6px rgba(0,0,0,0.25); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
  >
    {t.back}
  </button>
  
  <div style="max-width:540px; width:100%; margin:0 auto; min-height:750px; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; position:relative; z-index:10; padding-top:1.5rem;">
    <div style="position:relative; width:100%; height:120px; margin-bottom:2rem; display:flex; align-items:center; justify-content:center;">
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:100%; height:100%; background:radial-gradient(circle, rgba(255,215,0,0.35) 0%, rgba(255,215,0,0) 70%); border-radius:50%; filter:blur(20px); z-index:-1; animation:pulse 4s infinite;"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:90px; height:90px; background:linear-gradient(135deg,#ffd700,#ffed4a); border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 30px rgba(255,215,0,0.65), inset 0 4px 15px rgba(255,255,255,0.4); z-index:5; border:3px solid rgba(255,255,255,0.3)">
        <div style="font-size:2.8rem !important; font-weight:900 !important; line-height:1 !important; background:linear-gradient(135deg,#1a1a1a,#4a3a00); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">
          {selectedDuration}
        </div>
      </div>
      <div style="position:absolute; top:calc(50% + 55px); left:50%; transform:translateX(-50%); font-size:1.15rem !important; font-weight:600 !important; opacity:0.9; color:white; text-shadow:0 2px 6px rgba(0,0,0,0.3); white-space:nowrap;">{t.minutes}</div>
    </div>
    
    <!-- ✅ FIXED PROPORTIONS CONTAINER -->
    <div style="background:rgba(255,255,255,0.12); backdrop-filter:blur(20px); border-radius:32px; padding:2.5rem; box-shadow:0 12px 40px rgba(0,0,0,0.35), 0 0 30px rgba(255,215,0,0.15); border:1px solid rgba(255,255,255,0.22); position:relative; overflow:hidden; width:100%; max-width:500px; min-height:380px;">
      <div style="position:absolute; top:0; left:0; right:0; bottom:0; background:linear-gradient(120deg, rgba(255,215,0,0.06) 0%, rgba(230,184,0,0.08) 100%); z-index:-1"></div>
      
      <h1 style="font-size:2.4rem !important; font-weight:800 !important; margin-bottom:1.2rem; text-shadow:0 4px 12px rgba(0,0,0,0.3); background:linear-gradient(135deg,#ffd700,#ffffff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.03em; text-align:center; line-height:1.2 !important">{t.title}</h1>
      <p style="font-size:1.35rem !important; margin-bottom:2.2rem; opacity:0.92; line-height:1.4 !important; color:rgba(255,255,255,0.95); text-align:center">{t.set}</p>
      
      <!-- ✅ FIXED PROPORTIONS SLIDER CONTAINER -->
      <div style="background:rgba(0,0,0,0.18); backdrop-filter:blur(16px); border-radius:28px; padding:2rem; margin-bottom:2rem; position:relative; border:1px solid rgba(255,255,255,0.18); box-shadow:inset 0 4px 12px rgba(255,255,255,0.1), inset 0 -4px 12px rgba(0,0,0,0.2); min-height:120px; width:100%; max-width:450px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; font-weight:600 !important; font-size:1.1rem !important; opacity:0.9; color:#fff; line-height:1 !important">
          <span>1 min</span>
          <span>120 min</span>
        </div>
        
        <div style="position:relative; height:16px; width:100%; margin-bottom:1.2rem">
          <div style="position:absolute; top:50%; transform:translateY(-50%); height:6px; width:100%; background:linear-gradient(90deg,#ffd700 0%,#ffaa00 {gradientProgress}%,#b8860b {gradientProgress}%,#8b6f00 100%); border-radius:3px; overflow:hidden">
            <div style="position:absolute; top:0; left:0; height:100%; width:{gradientProgress}%; background:linear-gradient(90deg,rgba(255,255,255,0.4) 0%,rgba(255,255,255,0) 100%); opacity:0.7"></div>
          </div>
          
          <div style="position:absolute; top:-30px; left:calc({gradientProgress}% - 40px); transform:translateX(0); background:linear-gradient(135deg,#ffd700,#ffed4a); color:#1a1a1a; border-radius:16px; padding:0.35rem 0.9rem; font-weight:800 !important; font-size:1.25rem !important; box-shadow:0 5px 18px rgba(200,150,0,0.45); white-space:nowrap; transition:left 0.1s cubic-bezier(0.34,1.56,0.64,1); min-width:80px; line-height:1 !important">
            {selectedDuration} min
          </div>
        </div>
        
        <input 
          bind:this={sliderRef}
          type="range" 
          min="1" 
          max="120" 
          step="1" 
          bind:value={selectedDuration}
          on:input={handleSliderChange}
          on:mousedown={handleDragStart}
          on:mouseup={handleDragEnd}
          on:touchstart={handleDragStart}
          on:touchend={handleDragEnd}
          autocomplete="off"
          style="width:100%; height:36px; appearance:none; background:transparent; position:relative; z-index:10; cursor:grab"
        />
        
        <style>
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffd700, #ffed4a);
            border: 4px solid rgba(255,255,255,0.92);
            box-shadow: 0 4px 18px rgba(200,150,0,0.5), 0 0 0 4px rgba(230,184,0,0.3), inset 0 3px 10px rgba(255,255,255,0.5);
            cursor: grab;
            transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
            position: relative;
            z-index: 20;
          }
          input[type="range"]::-moz-range-thumb {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffd700, #ffed4a);
            border: 4px solid rgba(255,255,255,0.92);
            box-shadow: 0 4px 18px rgba(200,150,0,0.5), 0 0 0 4px rgba(230,184,0,0.3), inset 0 3px 10px rgba(255,255,255,0.5);
            cursor: grab;
            transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
            position: relative;
            z-index: 20;
          }
          input[type="range"]::-webkit-slider-thumb:active,
          input[type="range"]::-moz-range-thumb:active {
            cursor: grabbing;
            transform: scale(1.1);
            box-shadow: 0 6px 22px rgba(200,150,0,0.6), 0 0 0 6px rgba(230,184,0,0.4), inset 0 3px 10px rgba(255,255,255,0.6);
          }
          input[type="range"]::-webkit-slider-runnable-track,
          input[type="range"]::-moz-range-track {
            height: 6px;
            border-radius: 3px;
            background: transparent;
            cursor: grab;
          }
        </style>
      </div>
      
      <button 
        on:click={startVideo}
        style="width:100%; padding:1.6rem; background:linear-gradient(135deg, rgba(255,215,0,0.95), rgba(230,184,0,0.9)); color:#1a1a1a; border:none; border-radius:22px; font-size:1.65rem !important; font-weight:800 !important; cursor:pointer; box-shadow:0 9px 32px rgba(200,150,0,0.55), 0 0 22px rgba(255,215,0,0.2); transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1); position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; gap:0.7rem; margin-top:0.5rem; line-height:1 !important"
      >
        <span style="position:relative; z-index:2; display:flex; align-items:center; gap:0.5rem">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform:translateX(-2px)">
            <path d="M5 3l14 9-14 9V3z" fill="currentColor" stroke="none"/>
          </svg>
          <span>{t.start}</span>
        </span>
        <div style="position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent); transition:left 0.7s ease" class="button-glow"></div>
      </button>
    </div>
  </div>
</div>

<style>
  @keyframes pulse {
    0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%,-50%) scale(1.08); opacity: 0.85; }
  }
  
  button:hover { 
    transform: translateY(-2px) scale(1.015); 
    box-shadow: 0 11px 38px rgba(200,150,0,0.62), 0 0 28px rgba(255,215,0,0.23) !important;
  }
  button:active { 
    transform: translateY(1px) scale(0.992); 
    box-shadow: 0 7px 23px rgba(200,150,0,0.48), 0 0 18px rgba(255,215,0,0.18) !important;
  }
  button:hover .button-glow {
    left: 100%;
  }
  
  :global(html), :global(body) {
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    width: 100vw !important;
    height: 100vh !important;
  }
  
  :global(body) {
    scroll-behavior: auto !important;
  }
  
  @media (max-width:640px) {
    div[style*="padding:1.5rem"] { padding:1.2rem !important; }
    h1 { font-size:2.15rem !important; }
    p { font-size:1.25rem !important; }
    div[style*="padding:2.5rem"] { padding:2rem !important; }
    div[style*="padding:2rem"] { padding:1.6rem !important; }
    button[style*="padding:1.6rem"] { padding:1.45rem !important; font-size:1.5rem !important; }
    div[style*="font-size:2.8rem"] { font-size:2.4rem !important; }
    div[style*="width:90px;height:90px"] { width:75px !important; height:75px !important; }
    /* ✅ FIXED PROPORTIONS FOR MOBILE */
    div[style*="min-height:380px"] { min-height:350px !important; }
    div[style*="max-width:500px"] { max-width:95% !important; }
  }
  @media (max-width:480px) {
    div[style*="padding:1.5rem"] { padding:1rem !important; }
    h1 { font-size:1.95rem !important; }
    p { font-size:1.15rem !important; }
    div[style*="padding:2.5rem"] { padding:1.7rem !important; }
    div[style*="padding:2rem"] { padding:1.4rem !important; }
    button[style*="padding:1.6rem"] { padding:1.35rem !important; font-size:1.4rem !important; }
    div[style*="font-size:2.8rem"] { font-size:2.1rem !important; }
    div[style*="width:90px;height:90px"] { width:70px !important; height:70px !important; }
    div[style*="min-height:750px"] { min-height:700px !important; }
    div[style*="font-size:1.25rem"] { font-size:1.15rem !important; }
    /* ✅ FIXED PROPORTIONS FOR SMALL MOBILE */
    div[style*="min-height:380px"] { min-height:330px !important; }
    div[style*="max-width:500px"] { max-width:92% !important; }
  }
</style>