<!-- src/routes/intro/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  let video;

  onMount(() => {
    if (browser) {
      localStorage.setItem('introSeen', 'true');
      // Video automatisch abspielen (mit Ton!)
      if (video) {
        video.play().catch(e => {
          console.log('Autoplay with audio failed:', e);
          // Fallback: wenn Autoplay mit Ton blockiert wird, dann stumm
          video.muted = true;
          video.play();
        });
      }
    }
  });

  function handleVideoEnd() {
    goto('/home');
  }

  function handleSkip() {
    goto('/home');
  }
</script>

<div style="
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 10000;
  overflow: hidden;
">
  <video
    bind:this={video}
    src="/intro.mp4"
    playsinline
    style="
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    "
    on:ended={handleVideoEnd}
    disablePictureInPicture
    controlsList="nodownload nofullscreen noremoteplayback"
  ></video>

  <!-- SKIP BUTTON: Klein, unten rechts -->
  <button
    on:click={handleSkip}
    style="
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 0.5rem 1.5rem;
      background: rgba(255,255,255,0.9);
      color: #000;
      border: none;
      border-radius: 2rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 10001;
      transition: all 0.2s;
    "
    on:mouseenter={(e) => e.target.style.transform = 'scale(1.05)'}
    on:mouseleave={(e) => e.target.style.transform = 'scale(1)'}
    aria-label="Skip intro"
  >
    SKIP
  </button>
</div>

<style>
  video::-webkit-media-controls { display: none !important; }
  :global(html), :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>