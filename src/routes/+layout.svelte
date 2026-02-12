<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  onMount(() => {
    if (browser) {
      // ONLY redirect when landing on homepage AND intro not seen
      if ($page.url.pathname === '/' && !localStorage.getItem('introSeen')) {
        goto('/intro');
      }
    }
  });
</script>

<slot />


