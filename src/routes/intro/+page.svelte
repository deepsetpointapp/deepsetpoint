<!-- src/routes/intro/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  let video;

  onMount(() => {
    if (browser) {
      localStorage.setItem('introSeen', 'true');
      // Video automatisch abspielen
      if (video) {
        video.play().catch(e => console.log('Autoplay prevented:', e));
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
    muted
    style="
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    "
    on:ended={handleVideoEnd}
    disablePictureInPicture
    controlsList="nodownload nofullscreen noremoteplayback"
  ></video>

  <!-- SKIP BUTTON: bottom-right, safe-area aware -->
  <button
    on:click={handleSkip}
    style="
      position: fixed;
      bottom: max(1.2rem, env(safe-area-inset-bottom, 1.2rem));
      right: max(1.2rem, env(safe-area-inset-right, 1.2rem));
      padding: 0.4rem 0.95rem;
      background: rgba(0,0,0,0.7);
      color: white;
      border: none;
      border-radius: 0.9rem;
      font-size: clamp(0.95rem, 3.4vw, 1.2rem);
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(10px);
      box-shadow: 0 3px 14px rgba(0,0,0,0.3);
      z-index: 10001;
      min-height: 2.5rem;
      max-width: 30%;
      text-align: center;
    "
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