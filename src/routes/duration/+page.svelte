<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onDestroy, onMount, tick } from 'svelte';
  
  let lang = $page.url.searchParams.get('lang') || 'en';
  let emotion = $page.url.searchParams.get('emotion') || '';
  
  const translations = {
    en: {
      back: '← Back',
      title: '✨ 18s DSP-SHIFT DONE! ✨',
      durations: ['15 Minutes ✨', '30 Minutes ⭐', '60 Minutes 🌿', '90 Minutes 🌸', 'Custom Duration ⏱️']
    },
    fr: {
      back: '← Retour',
      title: '✨ DSP-SHIFT 18s TERMINÉ ! ✨',
      durations: ['15 Minutes ✨', '30 Minutes ⭐', '60 Minutes 🌿', '90 Minutes 🌸', 'Durée Personnalisée ⏱️']
    },
    de: {
      back: '← Zurück',
      title: '✨ 18s DSP-SHIFT ERLEDIGT! ✨',
      durations: ['15 Minuten ✨', '30 Minuten ⭐', '60 Minuten 🌿', '90 Minuten 🌸', 'Benutzerdefinierte Dauer ⏱️']
    },
    pt: {
      back: '← Voltar',
      title: '✨ DSP-SHIFT 18s CONCLUÍDO! ✨',
      durations: ['15 Minutos ✨', '30 Minutos ⭐', '60 Minutos 🌿', '90 Minutos 🌸', 'Duração Personalizada ⏱️']
    }
  };

  $: t = translations[lang] || translations.en;

  function goBack() {
    goto(`/dsp?lang=${lang}&emotion=${encodeURIComponent(emotion)}`);
  }

  function selectDuration(duration, index) {
    if (index === 4) {
      goto(`/duration/custom-video?lang=${lang}&emotion=${encodeURIComponent(emotion)}`);
    } else {
      const minutes = duration.split(' ')[0];
      goto(`/duration/${minutes}?lang=${lang}&emotion=${encodeURIComponent(emotion)}`);
    }
  }
  
  // ✅ CRITICAL FIX: PREVENT LAYOUT DISPLACEMENT
  onMount(async () => {
    await tick(); // Wait for DOM to render
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100); // Double reset
  });
</script>

<svelte:head>
  <title>{t.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
</svelte:head>

<!-- ✅ FIXED LAYOUT CONTAINER -->
<div style="min-height:100vh; height:100%; background: linear-gradient(135deg, #f4c430 0%, #e6b800 50%, #b8860b 100%); padding:1.5rem; font-family: -apple-system, sans-serif; text-align:center; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;">
  <!-- ✅ TINY BACK BUTTON (FIXED POSITIONING) -->
  <button 
    on:click={goBack}
    style="position:fixed; top:0.5rem; left:0.5rem; padding:0.25rem 0.5rem; font-size:0.85rem; min-height:2rem; background:rgba(0,0,0,0.6); color:white; border:none; border-radius:0.6rem; z-index:10000; max-width:10rem !important; width:auto; box-shadow:0 2px 6px rgba(0,0,0,0.25); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
  >
    {t.back}
  </button>
  
  <!-- ✅ FIXED HEIGHT CONTAINER (PREVENTS SHIFT) -->
  <div style="max-width:300px; width:100%; margin:0 auto; min-height:300px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
    <h1 style="font-size:var(--text-base); color:#ffd700; font-weight:700; margin-bottom:0.8rem; text-align:center;">
      {t.title}
    </h1>
    
    <div style="display:flex; flex-direction:column; gap:0.8rem; width:100%;">
      {#each t.durations as duration, index}
        <button 
          on:click={() => selectDuration(duration, index)}
          style="padding:0.4rem 0.8rem; font-size:var(--text-sm); font-weight:600; min-height:2.4rem; max-width:200px; width:auto; background:{index === 4 ? 'linear-gradient(135deg,#4a00e0,#8e2de2)' : 'linear-gradient(135deg,#ffd700,#ffaa00)'}; color:white; border:none; border-radius:1.2rem; box-shadow:0 4px 15px rgba(0,0,0,0.2); cursor:pointer; transition:all 0.2s; {index === 4 ? 'max-width:180px;' : ''}"
        >
          {duration}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  button:hover:not(:disabled) {
    transform: translateY(-1px) scale(1.03);
    box-shadow: 0 8px 25px rgba(0,0,0,0.35) !important;
  }
  button:active {
    transform: translateY(0.5px) scale(0.98);
  }
  
  :global(html, body) {
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    width: 100vw !important;
    height: 100vh !important;
  }
  
  /* PREVENT BROWSER SCROLL RESTORATION */
  :global(body) {
    scroll-behavior: auto !important;
  }
</style>