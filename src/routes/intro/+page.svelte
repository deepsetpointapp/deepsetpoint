<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  onMount(() => {
    if (browser) {
      // IMMEDIATELY REDIRECT STRAY /intro REQUESTS TO ROOT
      goto('/');
    }
  });
</script>

<!-- Optional: invisible redirect page -->
<div style="display:none">Redirecting...</div>