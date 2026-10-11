<script>
  import { goto } from '$app/navigation';
  
  function start() {
    // No browser/localStorage checks — handled in /intro
    goto('/intro');
  }
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
</svelte:head>

<div style="
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f4c430 0%, #e6b800 50%, #b8860b 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: max(2rem, env(safe-area-inset-top, 2rem)) 1.5rem max(3rem, env(safe-area-inset-bottom, 3rem));
  box-sizing: border-box;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
">
  <h1 style="
    font-size: clamp(6rem, 20vw, 14rem);
    line-height: 1;
    font-weight: 900;
    color: #ffd700;
    text-shadow: 0 20px 70px rgba(0,0,0,0.5);
    margin: 0 0 1.2rem;
    letter-spacing: -0.04em;
    text-align: center;
  ">
    DeepSetPoint
  </h1>

  <p style="
    font-size: clamp(1.4rem, 4.5vw, 2.2rem);
    color: white;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
    margin: 0 0 2.5rem;
    text-align: center;
    line-height: 1.35;
  ">
    The 18 Second DSP-Shift<br>
    Your daily emotional anchor
  </p>

  <button
    on:click={start}
    style="
      font-size: clamp(1.2rem, 4vw, 1.6rem);
      font-weight: 700;
      color: #1a1a1a;
      background: #ffd700;
      padding: 0.7rem 2rem;
      border-radius: 2rem;
      cursor: pointer;
      user-select: none;
      transition: all 0.25s cubic-bezier(0.17, 0.67, 0.88, 1.01);
      box-shadow: 0 8px 30px rgba(0,0,0,0.25);
      max-width: 90%;
      text-align: center;
      display: inline-block;
      min-height: 3.2rem;
      border: none;
    "
  >
    Start Experience
  </button>
</div>

<style>
  :global(html), :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    touch-action: manipulation;
  }
  button:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 35px rgba(0,0,0,0.35);
  }
  button:active {
    transform: translateY(0) scale(0.98);
  }
</style>