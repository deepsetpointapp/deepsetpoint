<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onDestroy, onMount, tick } from 'svelte';
  
  let lang = $page.url.searchParams.get('lang') || 'en';
  let selectedEmotion = null;
  
  const emotions = {
    en: ['Happy 😊', 'Peace 🕊️', 'Love ❤️', 'Strong 💪', 'Focus 🎯', 'Joy 😄', 'Calm 😌', 'Energy ⚡', 'Gratitude 🙏', 'Clarity 💎', 'Rest 🌙', 'Bliss 😇', 'Inspired 💡', 'Connected 🌐', 'Passionate 🔥', 'Confident 😎', 'Free 🦅', 'Compassionate 🤲'],
    fr: ['Heureux 😊', 'Paix 🕊️', 'Amour ❤️', 'Fort 💪', 'Concentration 🎯', 'Joie 😄', 'Calme 😌', 'Énergie ⚡', 'Gratitude 🙏', 'Clarté 💎', 'Repos 🌙', 'Béatitude 😇', 'Inspiré 💡', 'Connecté 🌐', 'Passionné 🔥', 'Confiant 😎', 'Libre 🦅', 'Compatissant 🤲'],
    de: ['Glücklich 😊', 'Frieden 🕊️', 'Liebe ❤️', 'Stark 💪', 'Fokus 🎯', 'Freude 😄', 'Ruhe 😌', 'Energie ⚡', 'Dankbarkeit 🙏', 'Klarheit 💎', 'Ruhe 🌙', 'Glückseligkeit 😇', 'Inspiriert 💡', 'Verbunden 🌐', 'Leidenschaftlich 🔥', 'Selbstbewusst 😎', 'Frei 🦅', 'Mitfühlend 🤲'],
    pt: ['Feliz 😊', 'Paz 🕊️', 'Amor ❤️', 'Forte 💪', 'Foco 🎯', 'Alegria 😄', 'Calmo 😌', 'Energia ⚡', 'Gratidão 🙏', 'Clareza 💎', 'Descanso 🌙', 'Felicidade 😇', 'Inspirado 💡', 'Conectado 🌐', 'Apaixonado 🔥', 'Confidente 😎', 'Livre 🦅', 'Compassivo 🤲'],
    es: ['Feliz 😊', 'Paz 🕊️', 'Amor ❤️', 'Fuerte 💪', 'Enfoque 🎯', 'Alegría 😄', 'Calmo 😌', 'Energía ⚡', 'Gratitud 🙏', 'Claridad 💎', 'Descanso 🌙', 'Dicha 😇', 'Inspirado 💡', 'Conectado 🌐', 'Apasionado 🔥', 'Seguro 😎', 'Libre 🦅', 'Compasivo 🤲'],
    it: ['Felice 😊', 'Pace 🕊️', 'Amore ❤️', 'Forte 💪', 'Concentrazione 🎯', 'Gioia 😄', 'Calmo 😌', 'Energia ⚡', 'Gratitudine 🙏', 'Chiarezza 💎', 'Riposo 🌙', 'Beatitudine 😇', 'Ispirato 💡', 'Connesso 🌐', 'Appassionato 🔥', 'Sicuro 😎', 'Libero 🦅', 'Compassionevole 🤲']
  };
  
  const translations = {
    en: { back: '← Back', title: 'Choose Your Emotion', confirmation: 'You chose {emotion} — Good! Are you ready for your shift?', transfer: '→ DSP 18s Transfer' },
    fr: { back: '← Retour', title: 'Choisissez Votre Émotion', confirmation: 'Vous avez choisi {emotion} — Bien ! Êtes-vous prêt pour votre changement ?', transfer: '→ Transfert DSP 18s' },
    de: { back: '← Zurück', title: 'Wähle Deine Emotion', confirmation: 'Du hast {emotion} gewählt — Gut! Bist du bereit für deine Veränderung?', transfer: '→ DSP 18s Transfer' },
    pt: { back: '← Voltar', title: 'Escolha Sua Emoção', confirmation: 'Você escolheu {emotion} — Bom! Está pronto para sua transformação?', transfer: '→ Transferência DSP 18s' },
    es: { back: '← Volver', title: 'Elige Tu Emoción', confirmation: 'Elegiste {emotion} — ¡Bien! ¿Estás listo para tu cambio?', transfer: '→ Transferencia DSP 18s' },
    it: { back: '← Indietro', title: 'Scegli La Tua Emozione', confirmation: 'Hai scelto {emotion} — Bene! Sei pronto per il tuo cambiamento?', transfer: '→ Trasferimento DSP 18s' }
  };
  
  $: t = translations[lang] || translations.en;
  $: emotionList = emotions[lang] || emotions.en;
  
  function selectEmotion(emotion) {
    selectedEmotion = emotion;
    setTimeout(() => {
      if (selectedEmotion === emotion) {
        const emotionText = emotion.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
        goto(`/dsp?lang=${lang}&emotion=${encodeURIComponent(emotionText)}`);
      }
    }, 2000);
  }
  
  function confirmTransfer() {
    if (selectedEmotion) {
      const emotionText = selectedEmotion.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
      goto(`/dsp?lang=${lang}&emotion=${encodeURIComponent(emotionText)}`);
    }
  }
  
  function goBack() {
    if (selectedEmotion) selectedEmotion = null;
    else goto(`/`);
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
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover"/>
</svelte:head>

<!-- ✅ FIXED LAYOUT CONTAINER -->
<div style="min-height:100vh; height:100%; background:linear-gradient(135deg, #f4c430 0%, #e6b800 50%, #b8860b 100%);color:white;font-family:-apple-system,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;position:relative;overflow:hidden;">
  <!-- ✅ TINY BACK BUTTON (FIXED POSITIONING) -->
  <button 
    on:click={goBack}
    style="position:fixed; top:0.5rem; left:0.5rem; padding:0.25rem 0.5rem; font-size:0.85rem; min-height:2rem; background:rgba(0,0,0,0.6); color:white; border:none; border-radius:0.6rem; z-index:10000; max-width:10rem !important; width:auto; box-shadow:0 2px 6px rgba(0,0,0,0.25); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
  >
    {t.back}
  </button>
  
  <!-- ✅ FIXED HEIGHT CONTAINER (PREVENTS SHIFT) -->
  <div style="max-width:540px; width:100%; margin:0 auto; min-height:600px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
    <!-- Floating duration orb -->
    {#if !selectedEmotion}
      <div style="position:relative; width:100%; height:120px; margin-bottom:2.5rem; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:100%; height:100%; background:radial-gradient(circle, rgba(255,215,0,0.35) 0%, rgba(255,215,0,0) 70%); border-radius:50%; filter:blur(20px); z-index:-1; animation:pulse 4s infinite;"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:90px; height:90px; background:linear-gradient(135deg,#ffd700,#ffed4a); border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 30px rgba(255,215,0,0.65), inset 0 4px 15px rgba(255,255,255,0.4); z-index:5; border:3px solid rgba(255,255,255,0.3)">
          <div style="font-size:2.8rem; font-weight:900; background:linear-gradient(135deg,#1a1a1a,#4a3a00); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">
            {selectedEmotion}
          </div>
        </div>
        <div style="position:absolute; top:calc(50% + 55px); left:50%; transform:translateX(-50%); font-size:1.15rem; font-weight:600; opacity:0.9; color:white; text-shadow:0 2px 6px rgba(0,0,0,0.3)">{t.minutes}</div>
      </div>
    {/if}
    
    <div style="text-align:center; max-width:95%; width:100%; padding:0 1rem;">
      <h1 style="font-size:clamp(1.8rem, 5vw, 2.2rem); font-weight:800; margin-bottom:1.5rem; text-shadow:0 3px 10px rgba(0,0,0,0.25); color:#ffd700; line-height:1.3">{t.title}</h1>
      
      <!-- Responsive grid layout -->
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(150px,1fr)); gap:0.9rem; justify-content:center; width:100%; max-width:600px; margin:0 auto;">
        {#each emotionList as emotion}
          <button 
            on:click={() => selectEmotion(emotion)}
            style="padding:0.7rem 0.6rem; background:rgba(255,255,255,0.12); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.25); color:white; border-radius:1rem; font-size:clamp(0.85rem, 2.8vw, 1rem); font-weight:600; cursor:pointer; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.15); transition:all 0.2s ease; min-height:3.2rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis"
          >
            {emotion}
          </button>
        {/each}
      </div>
    </div>
    
    {#if selectedEmotion}
      <div style="text-align:center; max-width:95%; width:100%; padding:0 1.5rem; margin-top:2rem;">
        <h1 style="font-size:clamp(1.9rem, 5.5vw, 2.4rem); font-weight:800; margin:1.2rem 0 1.8rem; text-shadow:0 3px 12px rgba(0,0,0,0.3); color:#ffd700; line-height:1.35">
          {t.confirmation.replace('{emotion}', selectedEmotion)}
        </h1>
        <button 
          on:click={confirmTransfer}
          style="padding:0.9rem 1.8rem; background:linear-gradient(135deg,#4ade80,#22c55e); color:white; border:none; border-radius:1.4rem; font-size:clamp(1.1rem, 3.5vw, 1.4rem); font-weight:700; cursor:pointer; box-shadow:0 6px 20px rgba(74,222,128,0.45); transition:all 0.2s ease; min-height:3.4rem; max-width:250px; width:auto;"
        >
          {t.transfer}
        </button>
        <p style="margin-top:1.4rem; font-size:clamp(0.9rem, 2.6vw, 1.1rem); opacity:0.85; line-height:1.55">
          Transfer begins in 2 seconds...
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.7; }
    50% { transform: translateY(-20px) translateX(15px); opacity: 1; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%,-50%) scale(1.08); opacity: 0.85; }
  }
  
  button:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 15px rgba(0,0,0,0.25) !important;
  }
  button:active {
    transform: translateY(1px) scale(0.98);
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