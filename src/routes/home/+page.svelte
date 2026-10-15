<script>
  import { goto } from '$app/navigation';

  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'pt', flag: '🇵🇹', name: 'Português' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'it', flag: '🇮🇹', name: 'Italiano' }
  ];

  let selectedLang = null;

  function selectLanguage(code) {
    selectedLang = code;
    setTimeout(() => {
      goto(`/emotions?lang=${code}`);
    }, 300);
  }
</script>

<svelte:head>
  <title>DeepSetPoint - Choose Language</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
</svelte:head>

<div class="container">
  <div class="content">
    <!-- GROßES DSP LOGO -->
    <div class="logo-container">
      <svg class="logo-svg" viewBox="0 0 1500 1499.999933" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="logoClip"><circle cx="750" cy="750" r="750"/></clipPath>
        </defs>
        <g clip-path="url(#logoClip)">
          <rect width="1500" height="1500" fill="#1B1405"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-family="sans-serif" font-weight="900" font-size="520" fill="#FBD95A" letter-spacing="-20">DSP</text>
        </g>
      </svg>
    </div>

    <h1 class="title">DeepSetpoint</h1>
    <h2 class="subtitle">The 18 Second DSP-Shift</h2>
    <p class="tagline">Your daily emotional anchor</p>
    
    <h3 class="section-title">Choose Your Language</h3>
    
    <div class="lang-grid">
      {#each languages as lang}
        <button
          class="lang-btn {selectedLang === lang.code ? 'selected' : ''}"
          on:click={() => selectLanguage(lang.code)}
        >
          <span class="flag">{lang.flag}</span>
          <span class="name">{lang.name}</span>
        </button>
      {/each}
    </div>

    {#if selectedLang}
      <div class="confirmation">
        <p>✓ {languages.find(l => l.code === selectedLang).name} {languages.find(l => l.code === selectedLang).flag}</p>
        <button class="next-btn">Choose Your Emotion</button>
      </div>
    {/if}
  </div>
</div>

<style>
  /* BLAUER RAND ENTFERNEN - WICHTIG! */
  :global(html), :global(body) {
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    width: 100vw !important;
    height: 100dvh !important;
    background: transparent !important;
  }

  .container {
    min-height: 100dvh;
    width: 100vw;
    overflow: hidden;
    background: radial-gradient(ellipse 60% 55% at 50% 42%, rgba(255, 244, 190, 0.55), transparent 70%), 
                linear-gradient(150deg, #FBD95A, #F5C518 42%, #DDA10C);
    background-attachment: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    box-sizing: border-box;
  }

  .content {
    max-width: 800px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  /* GROßES LOGO - RESPONSIVE */
  .logo-container {
    width: 200px;
    height: 200px;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 8px 24px rgba(27, 20, 5, 0.4));
  }

  .logo-svg {
    width: 100%;
    height: 100%;
  }

  .title {
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    font-weight: 700;
    color: white;
    margin: 0;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .subtitle {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 600;
    color: white;
    margin: 0;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .tagline {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    font-weight: 500;
    color: rgba(255,255,255,0.95);
    margin: 0 0 2rem 0;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .section-title {
    font-size: clamp(1.5rem, 3.5vw, 1.75rem);
    font-weight: 600;
    color: white;
    margin: 1rem 0 1.5rem 0;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .lang-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(140px, 1fr));
    gap: 1.25rem;
    width: 100%;
    max-width: 600px;
  }

  .lang-btn {
    height: 96px;
    border-radius: 24px;
    background: rgba(255, 251, 235, 0.58);
    border: 1.5px solid rgba(255,255,255,0.7);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.14s ease;
    box-shadow: 0 4px 12px rgba(74, 55, 8, 0.16);
  }

  .lang-btn:hover {
    background: rgba(255, 251, 235, 0.86);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(74, 55, 8, 0.28);
  }

  .lang-btn.selected {
    background: #1B1405;
    color: #FBD95A;
    border-color: #1B1405;
  }

  .flag {
    font-size: 2rem;
  }

  .name {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .confirmation {
    margin-top: 2rem;
    text-align: center;
    animation: fadeIn 0.3s ease;
  }

  .confirmation p {
    font-size: 1.2rem;
    color: white;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .next-btn {
    height: 64px;
    padding: 0 3rem;
    border-radius: 999px;
    border: none;
    background: #10B981;
    color: white;
    font: 600 1.25rem/1 system-ui;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
    transition: all 0.16s;
  }

  .next-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.5);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    .logo-container {
      width: 150px;
      height: 150px;
    }
    .lang-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .lang-btn {
      height: 80px;
    }
  }
</style>