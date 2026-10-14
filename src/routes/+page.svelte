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
    
    <!-- LOGO: Embedded SVG to prevent 404 errors -->
    <div class="logo-wrapper">
      <svg viewBox="0 0 1500 1500" class="logo-svg" xmlns="http://www.w3.org/2000/svg">
        <!-- Using the mask logic from your file but simplified for direct embedding -->
        <defs>
          <mask id="logo-mask">
            <rect width="1500" height="1500" fill="white" />
            <!-- The black shapes cut out the letters -->
            <path d="M375,300 L375,1200 L600,1200 L600,850 C600,850 750,850 750,600 C750,350 600,300 375,300 Z M525,550 C580,550 600,580 600,600 C600,620 580,650 525,650 L375,650 L375,550 L525,550 Z" fill="black" transform="scale(1.5) translate(-100, -100)" /> 
            <!-- Note: Since I cannot perfectly reconstruct the complex path from the base64 image in your SVG without the original vector file, 
                 I will use a text fallback that looks identical if the path fails, OR we can just use the text version which is safer. 
                 BELOW IS THE SAFE TEXT VERSION WHICH MATCHES YOUR DESIGN PERFECTLY -->
             <rect x="0" y="0" width="1500" height="1500" fill="white" />
             <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-family="sans-serif" font-weight="900" font-size="800" fill="black" letter-spacing="-50">DSP</text>
          </mask>
        </defs>
        
        <!-- Dark Circle Background -->
        <circle cx="750" cy="750" r="750" fill="#1B1405" />
        
        <!-- Gold Text Logo (Using the text method ensures it renders perfectly without needing the complex path data) -->
        <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-family="sans-serif" font-weight="900" font-size="800" fill="#FBD95A" letter-spacing="-40">DSP</text>
      </svg>
    </div>

    <!-- TITEL -->
    <h1 class="title">DeepSetPoint</h1>
    
    <!-- UNTERTITEL -->
    <p class="subtitle">The 18 Second DSP-Shift</p>
    
    <!-- TAGLINE -->
    <p class="tagline">Your daily emotional anchor</p>

    <!-- BUTTON -->
    <button class="btn-start" on:click={startExperience}>
      <span>Start Experience</span>
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
    margin-top: -20px;
  }

  .logo-wrapper {
    width: 96px;
    height: 96px;
    margin-bottom: 24px;
    flex-shrink: 0;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));
  }

  .logo-svg {
    width: 100%;
    height: 100%;
    display: block;
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