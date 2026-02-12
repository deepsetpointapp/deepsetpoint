<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, tick } from 'svelte';
  
  let lang = $page.url.searchParams.get('lang') || 'en';
  let userSelectedLang = '';
  
  const translations = {
    en: { title: '🧘‍♂️ DeepSetpoint', subtitle: 'The 18 Second DSP-Shift', description: 'Your daily emotional anchor', choose: 'Choose Your Language' },
    fr: { title: '🧘‍♂️ DeepSetpoint', subtitle: 'Le Décalage DSP de 18 Secondes', description: 'Votre ancre émotionnelle quotidienne', choose: 'Choisissez Votre Langue' },
    de: { title: '🧘‍♂️ DeepSetpoint', subtitle: 'Der 18-Sekunden DSP-Wechsel', description: 'Ihr täglicher emotionaler Anker', choose: 'Wählen Sie Ihre Sprache' },
    pt: { title: '🧘‍♂️ DeepSetpoint', subtitle: 'O Deslocamento DSP de 18 Segundos', description: 'Sua âncora emocional diária', choose: 'Escolha Sua Língua' },
    es: { title: '🧘‍♂️ DeepSetpoint', subtitle: 'El Cambio DSP de 18 Segundos', description: 'Tu ancla emocional diaria', choose: 'Elige Tu Idioma' },
    it: { title: '🧘‍♂️ DeepSetpoint', subtitle: 'Il Cambio DSP di 18 Secondi', description: "Il tuo ancora emotiva quotidiana", choose: 'Scegli La Tua Lingua' }
  };

  $: t = translations[lang] || translations.en;
  
  const languages = [
    { code: 'en', label: '🇬🇧', name: 'English' },
    { code: 'fr', label: '🇫🇷', name: 'Français' },
    { code: 'de', label: '🇩🇪', name: 'Deutsch' },
    { code: 'pt', label: '🇵🇹', name: 'Português' },
    { code: 'es', label: '🇪🇸', name: 'Español' },
    { code: 'it', label: '🇮🇹', name: 'Italiano' }
  ];

  function selectLanguage(code) {
    userSelectedLang = code;
    lang = code;
  }
  
  onMount(async () => {
    await tick();
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100);
  });
</script>

<svelte:head>
  <title>{t.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
</svelte:head>

<main style="min-height:100vh; height:100%; background: linear-gradient(135deg, #f4c430 0%, #e6b800 50%, #b8860b 100%); padding:1.5rem; font-family: -apple-system, sans-serif; text-align:center; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;">
  <div style="max-width:500px; width:100%; margin:0 auto; min-height:500px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
    <div style="text-align:center; margin-bottom:1.5rem;">
      <h1 style="font-size:clamp(2.2rem, 6vw, 2.8rem); font-weight:900; color:white; text-shadow:0 4px 8px rgba(0,0,0,0.3); margin-top:0; line-height:1.2;">{t.title}</h1>
      <h2 style="font-size:clamp(1.4rem, 4.5vw, 1.8rem); font-weight:700; color:rgba(255,255,255,0.95); margin-bottom:0.8rem; line-height:1.3;">{t.subtitle}</h2>
      <p style="font-size:clamp(1.2rem, 4vw, 1.5rem); color:rgba(255,255,255,0.9); margin:0; line-height:1.4;">{t.description}</p>
    </div>
    <div style="text-align:center; margin-bottom:1.5rem;">
      <h3 style="color:white; font-size:clamp(1.5rem, 4.2vw, 2rem); font-weight:700; margin-bottom:1.5rem; text-shadow:0 3px 8px rgba(0,0,0,0.2);">{t.choose}</h3>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1.1rem; width:100%; max-width:420px; margin-bottom:1.8rem;">
      {#each languages as language}
        <button on:click={() => selectLanguage(language.code)} class:selected={userSelectedLang === language.code} style="padding:0.9rem 0.5rem; border-radius:1.1rem; background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.25); color:white; font-weight:600; font-size:0.95rem; cursor:pointer; transition:all .25s ease; box-shadow:0 4px 12px rgba(0,0,0,0.18); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.4rem; min-height:5.2rem;">
          <span style="font-size:2rem;">{language.label}</span>
          <span style="font-size:0.85rem;">{language.name}</span>
        </button>
      {/each}
    </div>
    {#if userSelectedLang}
      <div style="text-align:center; padding:1rem; width:100%;">
        <div style="margin-bottom:1rem; color:#4ade80; font-size:clamp(1.1rem, 3.5vw, 1.3rem); font-weight:700; display:flex; align-items:center; justify-content:center; gap:0.5rem;">
          <span>✓</span>
          <span>{languages.find(l => l.code === userSelectedLang)?.name}</span>
          <span>{languages.find(l => l.code === userSelectedLang)?.label}</span>
        </div>
        <a href="/emotions?lang={userSelectedLang}" style="background:linear-gradient(135deg, #4ade80, #22c55e); color:white; padding:0.9rem 1.8rem; border-radius:1.4rem; text-decoration:none; font-weight:700; font-size:clamp(1.1rem, 3.8vw, 1.3rem); box-shadow:0 8px 20px rgba(74,222,128,0.45); display:inline-block; transition:all 0.25s ease; min-width:200px;">
          {userSelectedLang === 'fr' ? 'Choisis Ton Émotion' : userSelectedLang === 'de' ? 'Wähle Deine Emotion' : userSelectedLang === 'pt' ? 'Escolha Sua Emoção' : userSelectedLang === 'es' ? 'Elige Tu Emoción' : userSelectedLang === 'it' ? 'Scegli La Tua Emozione' : 'Choose Your Emotion'}
        </a>
      </div>
    {/if}
  </div>
</main>

<style>
  button:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 6px 18px rgba(0,0,0,0.25) !important; }
  button.selected, button.selected:hover { background: linear-gradient(135deg, #4ade80, #22c55e) !important; border-color: #4ade80 !important; box-shadow: 0 10px 24px rgba(74,222,128,0.55) !important; transform: translateY(-3px) scale(1.06) !important; }
  a:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(74,222,128,0.6) !important; }
  :global(html, body) { margin: 0 !important; padding: 0 !important; overflow: hidden !important; width: 100vw !important; height: 100vh !important; }
  :global(body) { scroll-behavior: auto !important; }
</style>