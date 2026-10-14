<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let lang = $page.url.searchParams.get('lang') || 'en';
  let emotion = $page.url.searchParams.get('emotion') || 'Peace';
  let isTransferring = false;
  let isComplete = false;
  let progress = 0;

  const translations = {
    en: { back: 'Back', transferTitle: 'DSP 18s Transfer', transferBtn: 'DSP NOW', mirrorTitle: 'DSP 18s Mirror Shift', mirrorBtn: 'DSP MIRROR', complete: 'COMPLETE', setpointSet: 'Complete! Your setpoint is set.', great: 'GREAT ', forLonger: 'For longer DSP-Shifts, please push HERE' },
    de: { back: 'Zurück', transferTitle: 'DSP 18s Transfer', transferBtn: 'DSP JETZT', mirrorTitle: 'DSP 18s Spiegel Shift', mirrorBtn: 'DSP SPIEGEL', complete: 'FERTIG', setpointSet: 'Fertig! Dein Setpoint ist gesetzt.', great: 'TOLL ✨', forLonger: 'Für längere DSP-Shifts, bitte HIER drücken' },
    fr: { back: 'Retour', transferTitle: 'Transfert DSP 18s', transferBtn: 'DSP MAINTENANT', mirrorTitle: 'Shift Miroir DSP 18s', mirrorBtn: 'DSP MIROIR', complete: 'TERMINÉ', setpointSet: 'Terminé ! Votre point de réglage est défini.', great: 'SUPERBE ✨', forLonger: 'Pour des shifts DSP plus longs, veuillez appuyer ICI' }
  };

  $: t = translations[lang] || translations.en;

  function startTransfer() {
    if (isTransferring || isComplete) return;
    isTransferring = true;
    progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        clearInterval(interval);
        isTransferring = false;
        isComplete = true;
      }
    }, 100); // Simuliert 18 Sekunden
  }

  function goToDuration() {
    goto(`/duration?lang=${lang}&emotion=${emotion}`);
  }
  
  function goBack() {
    goto('/emotions?lang=' + lang);
  }

</script>

<svelte:head>
  <title>DSP {emotion}</title>
</svelte:head>

<div class="container">
  <!-- VERKLEINERTER BACK BUTTON -->
  <button class="btn-back" on:click={goBack}>
    <span>←</span>
    <span>{t.back}</span>
  </button>

  {#if !isComplete}
    <!-- GROßE, PROMINENTE EMOTION MIT LOGO -->
    <div class="emotion-display">
      <svg class="emotion-logo" viewBox="0 0 1500 1499.999933" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#be67a5b640)"><g mask="url(#ff431643b8)"><g transform="matrix(0.937852, 0, 0, 0.9375, 0.00003335, -0.00002)"><image x="0" y="0" width="1597" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABj0AAAZACAIAAACt2RfYAAAABmJLR0QA/wD/AP+gvaeTAAAgAElEQVR4nOzd+68dx10A8O/M7p7HPfdev5M4TR2T0hYSipoWBAWBTFVRilSkSq2EeLUSfwdqK37kdyRUEBUSP9AghEBI/ICEWx4F2kpQSEtLH06b5mEnsX/yov7u6+vrsXfsHbtH0v9BpZTa2dmZO3POnDlz5sxMBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA...... (use your full base64 string here)"/></g></g></g></svg>
      <span>{emotion}</span>
    </div>

    <div class="button-group">
      <div class="action-block">
        <h3>{t.transferTitle}</h3>
        <button 
          class="btn-primary" 
          on:click={startTransfer} 
          disabled={isTransferring}
        >
          {#if isTransferring}
            <span class="spinner"></span>
          {:else if isComplete}
            ✓ {t.complete}
          {:else}
            {t.transferBtn}
          {/if}
        </button>
      </div>

      <div class="action-block">
        <h3>{t.mirrorTitle}</h3>
        <button class="btn-primary" on:click={() => goto('/duration?lang=' + lang + '&emotion=' + emotion)}>
          {t.mirrorBtn}
        </button>
      </div>
    </div>
  {:else}
    <!-- COMPLETE STATE -->
    <div class="complete-state">
      <div class="action-block">
        <h3>{t.transferTitle}</h3>
        <button class="btn-primary complete">
          ✓ {t.complete}
        </button>
        <p class="status-message">{t.setpointSet}</p>
      </div>
      
      <!-- ANGEPASSTES BANNER NACH PDF -->
      <button class="banner-btn" on:click={goToDuration}>
        <span class="banner-title">{t.great}</span>
        <span class="banner-text">{t.forLonger}</span>
      </button>
    </div>
  {/if}
</div>

<style>
  :root {
    --gold-300: #FBD95A;
    --ink-900: #1B1405;
    --glass: rgba(255, 251, 235, 0.58);
    --shadow-1: 0 4px 12px rgba(74, 55, 8, 0.16), 0 1px 2px rgba(74, 55, 8, 0.12);
  }

  .container {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: radial-gradient(ellipse 60% 55% at 50% 42%, rgba(255, 244, 190, 0.55), transparent 70%), linear-gradient(150deg, var(--gold-300), #F5C518 42%, #DDA10C);
    background-attachment: fixed;
    position: relative;
  }

  /* VERKLEINERTER BACK BUTTON */
  .btn-back {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    height: 3rem; /* Kleiner */
    padding: 0 1.25rem 0 1rem;
    border-radius: 999px;
    background: var(--ink-900);
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
  .btn-back:hover { background: #2B2008; transform: translateX(2px); }

  /* GROßE EMOTION ANZEIGE */
  .emotion-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
    font-size: 3rem; /* Viel größer */
    font-weight: 700;
    color: var(--ink-900);
    text-shadow: 0 2px 4px rgba(255,255,255,0.5);
  }
  .emotion-logo {
    width: 3rem;
    height: 3rem;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 400px;
  }

  .action-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .action-block h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--ink-900);
    margin: 0;
    text-align: center;
  }

  .btn-primary {
    width: 100%;
    height: 4rem;
    border-radius: 999px;
    border: none;
    background: var(--ink-900); /* Dunkles Design */
    color: var(--gold-300);
    font: 600 1.25rem/1 system-ui, sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    box-shadow: var(--shadow-1);
    transition: transform 0.1s, background 0.16s, box-shadow 0.16s;
  }
  .btn-primary:hover:not(:disabled) {
    background: #2B2008;
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(27, 20, 5, 0.28);
  }
  .btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
  
  .btn-primary.complete { background: #2B2008; }

  .spinner {
    width: 1.2rem;
    height: 1.2rem;
    border: 3px solid rgba(251, 217, 90, 0.3);
    border-radius: 50%;
    border-top-color: var(--gold-300);
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .complete-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    text-align: center;
  }

  .status-message {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--ink-900);
    margin: 0.5rem 0 0 0;
  }

  /* ANGEPASSTES BANNER NACH PDF */
  .banner-btn {
    width: 100%;
    max-width: 500px;
    padding: 1.5rem;
    border-radius: 1.75rem;
    background: var(--ink-900); /* Dunkler Hintergrund */
    color: #FFF8E1; /* Helle Schrift */
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    box-shadow: var(--shadow-1);
    transition: transform 0.1s, box-shadow 0.16s;
  }
  .banner-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(27, 20, 5, 0.28);
  }
  .banner-title { font-size: 1.375rem; font-weight: 700; }
  .banner-text { font-size: 1.125rem; font-weight: 500; }

  @media (max-width: 640px) {
    .emotion-display { font-size: 2.5rem; }
    .emotion-logo { width: 2.5rem; height: 2.5rem; }
    .btn-back { font-size: 0.9rem; height: 2.75rem; }
  }
</style>