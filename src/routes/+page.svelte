<script>
  import { goto } from '$app/navigation';

  function startExperience() {
    goto('/intro');
  }
</script>

<svelte:head>
  <title>DeepSetPoint - The 18 Second DSP-Shift</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
</svelte:head>

<div class="container">
  <div class="content">
    
    <!-- LOGO: Now using the real SVG file from /public -->
    <!-- Spec: 96x96, centered, 24px margin to title -->
    <div class="logo-wrapper">
      <img src="/DSP-Logo.svg" alt="DeepSetPoint Logo" class="logo-img" />
    </div>

    <!-- TITEL: 56/60, 700, ink (#1B1405) -->
    <h1 class="title">DeepSetPoint</h1>
    
    <!-- UNTERTITEL: 28/36, 600, ink -->
    <p class="subtitle">The 18 Second DSP-Shift</p>
    
    <!-- TAGLINE: 20/28, 500, ink-700 -->
    <p class="tagline">Your daily emotional anchor</p>

    <!-- BUTTON: Height 72, min-width 320, padding 0 40, Radius 999 -->
    <button class="btn-start" on:click={startExperience}>
      <span>Start Experience</span>
      <!-- Arrow Icon -->
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#FBD95A" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

  </div>
</div>

<style>
  :root {
    --gold-300: #FBD95A;
    --gold-400: #F5C518;
    --gold-600: #DDA10C;
    --ink-900: #1B1405;
    --ink-700: #4A3708;
    --font-main: 'Inter', 'Roboto', system-ui, sans-serif;
  }

  .container {
    min-height: 100dvh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* Background: Gradient + Glow as per PDF */
    background: 
      radial-gradient(ellipse 60% 55% at 50% 42%, rgba(255, 244, 190, 0.55), transparent 70%),
      linear-gradient(150deg, var(--gold-300), var(--gold-400) 42%, var(--gold-600));
    background-attachment: fixed;
    overflow: hidden;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 560px;
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    margin-top: -20px; /* Slightly above center visually */
  }

  .logo-wrapper {
    width: 96px;
    height: 96px;
    margin-bottom: 24px;
    flex-shrink: 0;
    /* Optional: Add a subtle drop shadow to the logo itself if needed, 
       but the SVG already has contrast */
    filter: drop-shadow(0 4px 6px rgba(27, 20, 5, 0.15));
  }

  .logo-img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }

  .title {
    font-size: 56px;
    line-height: 60px;
    font-weight: 700;
    color: var(--ink-900);
    margin: 0 0 12px 0;
    text-align: center;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 28px;
    line-height: 36px;
    font-weight: 600;
    color: var(--ink-900);
    margin: 0 0 8px 0;
    text-align: center;
  }

  .tagline {
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    color: var(--ink-700);
    margin: 0 0 48px 0;
    text-align: center;
  }

  .btn-start {
    height: 72px;
    min-width: 320px;
    padding: 0 40px;
    border-radius: 999px;
    border: none;
    background: var(--ink-900);
    color: var(--gold-300);
    font: 600 20px/1 var(--font-main);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow: 0 16px 40px rgba(27, 20, 5, 0.28);
    transition: transform 0.1s, background 0.16s, box-shadow 0.16s;
    width: auto;
  }

  .btn-start:hover {
    background: #2B2008;
    transform: translateY(-2px);
    box-shadow: 0 20px 50px rgba(27, 20, 5, 0.35);
  }

  .btn-start:active {
    transform: scale(0.98);
  }

  @media (max-width: 640px) {
    .title {
      font-size: 40px;
      line-height: 44px;
    }
    .subtitle {
      font-size: 22px;
      line-height: 28px;
    }
    .btn-start {
      width: calc(100% - 48px);
      max-width: 360px;
      height: 64px;
    }
  }
</style>