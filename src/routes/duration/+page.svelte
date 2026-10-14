<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let lang = $page.url.searchParams.get('lang') || 'en';
  let emotion = $page.url.searchParams.get('emotion') || 'Peace';

  const translations = {
    en: { back: 'Back', title: '✨ 18s DSP-SHIFT DONE! ', custom: 'Custom Duration ️' },
    de: { back: 'Zurück', title: '✨ 18s DSP-SHIFT GESCHAFFT! ✨', custom: 'Eigene Dauer ⏱️' },
    fr: { back: 'Retour', title: '✨ SHIFT DSP 18s TERMINÉ ! ✨', custom: 'Durée personnalisée ⏱️' }
  };
  $: t = translations[lang] || translations.en;

  const durations = [
    { value: 15, label: '15 Minutes', icon: '✨' },
    { value: 30, label: '30 Minutes', icon: '⭐' },
    { value: 60, label: '60 Minutes', icon: '🌿' },
    { value: 90, label: '90 Minutes', icon: '🌸' }
  ];

  function selectDuration(min) {
    goto(`/duration/${min}?lang=${lang}&emotion=${emotion}`);
  }
  
  function goBack() {
     goto('/emotions?lang=' + lang);
  }
</script>

<svelte:head><title>Choose Duration</title></svelte:head>

<div class="container">
  <button class="btn-back" on:click={goBack}><span>←</span><span>{t.back}</span></button>
  
  <h1 class="main-title">{t.title}</h1>

  <div class="button-list">
    {#each durations as d}
      <button class="btn-duration" on:click={() => selectDuration(d.value)}>
        <span>{d.label}</span>
        <span style="margin-left: 0.5rem;">{d.icon}</span>
      </button>
    {/each}
    <button class="btn-custom" on:click={() => goto('/duration/custom-video?lang=' + lang + '&emotion=' + emotion)}>
      {t.custom}
    </button>
  </div>
</div>

<style>
  :root { --ink-900: #1B1405; --gold-300: #FBD95A; --glass: rgba(255, 251, 235, 0.58); --shadow-1: 0 4px 12px rgba(74, 55, 8, 0.16), 0 1px 2px rgba(74, 55, 8, 0.12); }
  .container { min-height: 100dvh; display: flex; flex-direction: column; align-items: center; padding: 3rem 2rem; background: radial-gradient(ellipse 60% 55% at 50% 42%, rgba(255, 244, 190, 0.55), transparent 70%), linear-gradient(150deg, var(--gold-300), #F5C518 42%, #DDA10C); background-attachment: fixed; position: relative; }
  .btn-back { position: absolute; top: 1.5rem; left: 1.5rem; height: 3rem; padding: 0 1.25rem 0 1rem; border-radius: 999px; background: var(--ink-900); color: #FFF8E1; font: 600 1rem/1 system-ui, sans-serif; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; z-index: 100; transition: transform 0.1s, background 0.16s; }
  .btn-back:hover { background: #2B2008; transform: translateX(2px); }
  .main-title { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; color: var(--ink-900); text-align: center; margin: 4rem 0 3rem; text-shadow: 0 2px 4px rgba(255,255,255,0.5); }
  .button-list { display: flex; flex-direction: column; gap: 1.25rem; width: 100%; max-width: 540px; }
  .btn-duration, .btn-custom { width: 100%; height: 5.25rem; border-radius: 1.5rem; border: none; font: 600 1.5rem/1 system-ui, sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; box-shadow: var(--shadow-1); transition: transform 0.1s, box-shadow 0.16s; }
  .btn-duration { background: var(--glass); color: var(--ink-900); }
  .btn-duration:hover { background: rgba(255, 251, 235, 0.86); transform: translateY(-2px); box-shadow: 0 16px 40px rgba(74, 55, 8, 0.28); }
  .btn-custom { background: var(--ink-900); color: var(--gold-300); }
  .btn-custom:hover { background: #2B2008; transform: translateY(-2px); box-shadow: 0 16px 40px rgba(27, 20, 5, 0.28); }
  @media (max-width: 640px) { .btn-back { font-size: 0.9rem; height: 2.75rem; } .btn-duration, .btn-custom { height: 4.5rem; font-size: 1.25rem; } }
</style>