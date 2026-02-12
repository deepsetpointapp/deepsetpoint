<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  let lang = $page.url.searchParams.get('lang') || 'en';
  let emotion = $page.url.searchParams.get('emotion') || '';

  const translations = {
    en: { 
      back: '← Back to Duration Selection',
      title: 'Custom Duration ⏱️',
      description: 'Choose your own DSP-Shift duration'
    },
    fr: { 
      back: '← Retour à la Sélection de Durée',
      title: 'Durée Personnalisée ⏱️',
      description: 'Choisissez votre propre durée de DSP-Shift'
    },
    de: { 
      back: '← Zurück zur Dauer-Auswahl',
      title: 'Benutzerdefinierte Dauer ⏱️',
      description: 'Wählen Sie Ihre eigene DSP-Shift-Dauer'
    },
    pt: { 
      back: '← Voltar à Seleção de Duração',
      title: 'Duração Personalizada ⏱️',
      description: 'Escolha sua própria duração de DSP-Shift'
    },
    es: { 
      back: '← Volver a la Selección de Duración',
      title: 'Duración Personalizada ⏱️',
      description: 'Elige tu propia duración de DSP-Shift'
    },
    it: { 
      back: '← Torna alla Selezione della Durata',
      title: 'Durata Personalizzata ⏱️',
      description: 'Scegli la tua durata DSP-Shift'
    }
  };

  $: t = translations[lang] || translations.en;

  function goBack() {
    goto(`/duration?lang=${lang}&emotion=${encodeURIComponent(emotion)}`);
  }
</script>

<svelte:head>
  <title>{t.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<main style="min-height:100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding:1.5rem; font-family: -apple-system, sans-serif; text-align:center; position:relative;">
  <button on:click={goBack} style="position:absolute; top:1.5rem; left:1.5rem; padding:0.6rem 1.2rem; background:rgba(255,255,255,0.2); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.3); color:white; border-radius:0.75rem; font-size:1.1rem; font-weight:600; cursor:pointer; transition:all .3s ease; box-shadow:0 3px 10px rgba(0,0,0,0.2);">
    {t.back}
  </button>

  <div style="margin-top:5rem; max-width:30rem; margin:5rem auto 0;">
    <h1 style="font-size:3rem; font-weight:900; color:#ffd700; text-shadow:0 4px 12px rgba(255,215,0,0.5); margin-bottom:1.5rem;">
      {t.title}
    </h1>
    <p style="font-size:1.5rem; color:white; opacity:0.9; margin-bottom:2rem;">
      {t.description}
    </p>
    
    <div style="background:rgba(255,255,255,0.1); backdrop-filter:blur(10px); padding:2rem; border-radius:1.5rem;">
      <p style="font-size:1.3rem; color:white; opacity:0.85; margin-bottom:1rem;">
        Coming soon — personalized duration settings
      </p>
      <button 
        on:click={goBack}
        style="padding:1rem 2rem; background:linear-gradient(135deg,#ffd700,#ffed4a); color:#333; border:none; border-radius:1rem; font-size:1.3rem; font-weight:700; cursor:pointer; box-shadow:0 6px 20px rgba(255,25,0,0.4); transition:all .3s ease;"
      >
        ← Back to Durations
      </button>
    </div>
  </div>
</main>

<style>
  button:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 25px rgba(255,215,0,0.5) !important;
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
</style>