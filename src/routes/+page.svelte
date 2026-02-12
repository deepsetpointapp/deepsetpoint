<script>
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';
  import { browser } from '$app/environment';

  let showIntro = false;
  let video = null;
  let isSkipped = false;
  let hasPlayed = false;

  async function startExperience() {
    showIntro = true;
    await tick();
    
    if (browser && video && !hasPlayed) {
      video.muted = false;
      video.volume = 1.0;
      
      try {
        await video.play();
        hasPlayed = true;
      } catch (err) {
        console.warn('Autoplay with sound failed:', err);
        video.muted = true;
        video.play().catch(() => setTimeout(() => completeIntro(), 1500));
      }
    }
  }

  function handleSkip() {
    isSkipped = true;
    if (video) video.pause();
    completeIntro();
  }

  function handleVideoEnd() {
    if (!isSkipped) completeIntro();
  }

  async function completeIntro() {
    try {
      await goto('/home');
    } catch (err) {
      console.error('Navigation to /home failed:', err);
      await goto('/emotions?lang=en');
    }
  }
</script>

<svelte:head>
  <title>DeepSetpoint</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover"/>
</svelte:head>

{#if !showIntro}
  <div style="min-height:100vh; background:linear-gradient(135deg,#f4c430 0%,#e6b800 50%,#b8860b 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.5rem; position:relative; overflow:hidden;">
    <div style="text-align:center; max-width:500px; z-index:10;">
      <!-- ✅ PERFECT FIX: OPTIMAL LETTER SPACING (0.05em) -->
      <h1 style="font-size:clamp(2.5rem, 7.5vw, 3.2rem); letter-spacing:0.05em; font-weight:900; color:#ffd700; text-shadow:0 4px 12px rgba(0,0,0,0.35); margin-bottom:1rem; line-height:1.1;">DeepSetpoint</h1>
      <p style="font-size:clamp(1.4rem, 4.5vw, 1.9rem); color:white; text-shadow:0 3px 8px rgba(0,0,0,0.25); margin-bottom:2.5rem; line-height:1.4;">
        The 18 Second DSP-Shift<br>Your daily emotional anchor
      </p>
      <button on:click={startExperience} style="padding:0.45rem 1rem; background:linear-gradient(135deg,#ffd700,#ffaa00); color:#1a1a1a; border:none; border-radius:1.2rem; font-size:clamp(1.1rem, 3.5vw, 1.4rem); font-weight:800; cursor:pointer; box-shadow:0 6px 20px rgba(255,215,0,0.5); transition:all 0.25s ease; max-width:14rem; width:auto; min-height:2.8rem;">
        Start Experience
      </button>
    </div>
  </div>
{:else}
  <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:10000; background:#000; overflow:hidden; display:flex; justify-content:center; align-items:center;">
    <video bind:this={video} on:ended={handleVideoEnd} style="width:100%; height:100%; object-fit:cover; display:block;" playsinline disablepictureinpicture controlsList="nodownload nofullscreen noremoteplayback">
      <source src="/intro.mp4" type="video/mp4">
      <source src="/intro.webm" type="video/webm">
    </video>
    <button on:click={handleSkip} style="position:absolute; bottom:1.5rem; right:1.5rem; padding:0.25rem 0.5rem; background:rgba(0,0,0,0.7); color:white; border:none; border-radius:0.6rem; font-size:0.85rem; min-height:2rem; z-index:10001; transition:all 0.25s ease; backdrop-filter:blur(10px); box-shadow:0 2px 6px rgba(0,0,0,0.25); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:10rem !important; width:auto;" aria-label="Skip intro">
      SKIP
    </button>
  </div>
{/if}

<style>
  button:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 25px rgba(255,215,0,0.65) !important; }
  button:active { transform: translateY(1px) scale(0.98); }
  :global(html), :global(body) { margin:0!important; padding:0!important; overflow:hidden!important; width:100vw!important; height:100vh!important; }
  video::-webkit-media-controls, video::-moz-media-controls, video::-ms-media-controls, video::media-controls { display: none !important; }
</style>