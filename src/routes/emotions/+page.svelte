<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onDestroy, onMount, tick } from 'svelte';
  
  let lang = $page.url.searchParams.get('lang') || 'fr'; // Default zu FR wie im PDF
  let selectedEmotion = null;
  let isConfirming = false;
  let countdown = 2;
  let countdownInterval;

  // Emotionen Daten (Beibehalten wie bei dir)
  const emotionsMap = {
    en: [
      { id: 'happy', label: 'Happy', emoji: '😊' },
      { id: 'peace', label: 'Peace', emoji: '🕊️' },
      { id: 'love', label: 'Love', emoji: '❤️' },
      { id: 'strong', label: 'Strong', emoji: '💪' },
      { id: 'focus', label: 'Focus', emoji: '' },
      { id: 'joy', label: 'Joy', emoji: '😄' },
      { id: 'calm', label: 'Calm', emoji: '😌' },
      { id: 'energy', label: 'Energy', emoji: '⚡' },
      { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
      { id: 'clarity', label: 'Clarity', emoji: '💎' },
      { id: 'rest', label: 'Rest', emoji: '' },
      { id: 'bliss', label: 'Bliss', emoji: '😇' },
      { id: 'inspired', label: 'Inspired', emoji: '💡' },
      { id: 'connected', label: 'Connected', emoji: '🌐' },
      { id: 'passionate', label: 'Passionate', emoji: '🔥' },
      { id: 'confident', label: 'Confident', emoji: '😎' },
      { id: 'free', label: 'Free', emoji: '🦅' },
      { id: 'compassionate', label: 'Compassionate', emoji: '🤲' }
    ],
    fr: [
      { id: 'heureux', label: 'Heureux', emoji: '😊' },
      { id: 'paix', label: 'Paix', emoji: '🕊️' },
      { id: 'amour', label: 'Amour', emoji: '❤️' },
      { id: 'fort', label: 'Fort', emoji: '💪' },
      { id: 'concentration', label: 'Concentration', emoji: '' },
      { id: 'joie', label: 'Joie', emoji: '😄' },
      { id: 'calme', label: 'Calme', emoji: '😌' },
      { id: 'energie', label: 'Énergie', emoji: '⚡' },
      { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
      { id: 'clarte', label: 'Clarté', emoji: '💎' },
      { id: 'repos', label: 'Repos', emoji: '🌙' },
      { id: 'beatitude', label: 'Béatitude', emoji: '😇' },
      { id: 'inspire', label: 'Inspiré', emoji: '💡' },
      { id: 'connecte', label: 'Connecté', emoji: '🌐' },
      { id: 'passionne', label: 'Passionné', emoji: '🔥' },
      { id: 'confiant', label: 'Confiant', emoji: '😎' },
      { id: 'libre', label: 'Libre', emoji: '🦅' },
      { id: 'compatissant', label: 'Compatissant', emoji: '🤲' }
    ],
    de: [
      { id: 'glucklich', label: 'Glücklich', emoji: '😊' },
      { id: 'frieden', label: 'Frieden', emoji: '️' },
      { id: 'liebe', label: 'Liebe', emoji: '❤️' },
      { id: 'stark', label: 'Stark', emoji: '💪' },
      { id: 'fokus', label: 'Fokus', emoji: '🎯' },
      { id: 'freude', label: 'Freude', emoji: '😄' },
      { id: 'ruhe', label: 'Ruhe', emoji: '😌' },
      { id: 'energie', label: 'Energie', emoji: '⚡' },
      { id: 'dankbarkeit', label: 'Dankbarkeit', emoji: '🙏' },
      { id: 'klarheit', label: 'Klarheit', emoji: '💎' },
      { id: 'rast', label: 'Rast', emoji: '' },
      { id: 'gluckseligkeit', label: 'Glückseligkeit', emoji: '😇' },
      { id: 'inspiriert', label: 'Inspiriert', emoji: '💡' },
      { id: 'verbunden', label: 'Verbunden', emoji: '🌐' },
      { id: 'leidenschaftlich', label: 'Leidenschaftlich', emoji: '🔥' },
      { id: 'selbstbewusst', label: 'Selbstbewusst', emoji: '😎' },
      { id: 'frei', label: 'Frei', emoji: '🦅' },
      { id: 'mitfuhlend', label: 'Mitfühlend', emoji: '🤲' }
    ],
    pt: [
      { id: 'feliz', label: 'Feliz', emoji: '😊' },
      { id: 'paz', label: 'Paz', emoji: '🕊️' },
      { id: 'amor', label: 'Amor', emoji: '❤️' },
      { id: 'forte', label: 'Forte', emoji: '💪' },
      { id: 'foco', label: 'Foco', emoji: '🎯' },
      { id: 'alegria', label: 'Alegria', emoji: '😄' },
      { id: 'calmo', label: 'Calmo', emoji: '😌' },
      { id: 'energia', label: 'Energia', emoji: '⚡' },
      { id: 'gratidao', label: 'Gratidão', emoji: '🙏' },
      { id: 'clareza', label: 'Clareza', emoji: '💎' },
      { id: 'descanso', label: 'Descanso', emoji: '🌙' },
      { id: 'felicidade', label: 'Felicidade', emoji: '😇' },
      { id: 'inspirado', label: 'Inspirado', emoji: '💡' },
      { id: 'conectado', label: 'Conectado', emoji: '🌐' },
      { id: 'apaixonado', label: 'Apaixonado', emoji: '🔥' },
      { id: 'confidente', label: 'Confidente', emoji: '😎' },
      { id: 'livre', label: 'Livre', emoji: '🦅' },
      { id: 'compassivo', label: 'Compassivo', emoji: '🤲' }
    ],
    es: [
      { id: 'feliz', label: 'Feliz', emoji: '😊' },
      { id: 'paz', label: 'Paz', emoji: '🕊️' },
      { id: 'amor', label: 'Amor', emoji: '❤️' },
      { id: 'fuerte', label: 'Fuerte', emoji: '💪' },
      { id: 'enfoque', label: 'Enfoque', emoji: '🎯' },
      { id: 'alegria', label: 'Alegría', emoji: '😄' },
      { id: 'calmo', label: 'Calmo', emoji: '😌' },
      { id: 'energia', label: 'Energía', emoji: '⚡' },
      { id: 'gratitud', label: 'Gratitud', emoji: '🙏' },
      { id: 'claridad', label: 'Claridad', emoji: '💎' },
      { id: 'descanso', label: 'Descanso', emoji: '🌙' },
      { id: 'dicha', label: 'Dicha', emoji: '😇' },
      { id: 'inspirado', label: 'Inspirado', emoji: '💡' },
      { id: 'conectado', label: 'Conectado', emoji: '🌐' },
      { id: 'apasionado', label: 'Apasionado', emoji: '🔥' },
      { id: 'seguro', label: 'Seguro', emoji: '😎' },
      { id: 'libre', label: 'Libre', emoji: '🦅' },
      { id: 'compasivo', label: 'Compasivo', emoji: '🤲' }
    ],
    it: [
      { id: 'felice', label: 'Felice', emoji: '😊' },
      { id: 'pace', label: 'Pace', emoji: '🕊️' },
      { id: 'amore', label: 'Amore', emoji: '❤️' },
      { id: 'forte', label: 'Forte', emoji: '💪' },
      { id: 'concentrazione', label: 'Concentrazione', emoji: '🎯' },
      { id: 'gioia', label: 'Gioia', emoji: '😄' },
      { id: 'calmo', label: 'Calmo', emoji: '😌' },
      { id: 'energia', label: 'Energia', emoji: '' },
      { id: 'gratitudine', label: 'Gratitudine', emoji: '🙏' },
      { id: 'chiarezza', label: 'Chiarezza', emoji: '💎' },
      { id: 'riposo', label: 'Riposo', emoji: '🌙' },
      { id: 'beatitudine', label: 'Beatitudine', emoji: '😇' },
      { id: 'ispirato', label: 'Ispirato', emoji: '💡' },
      { id: 'connesso', label: 'Connesso', emoji: '🌐' },
      { id: 'appassionato', label: 'Appassionato', emoji: '🔥' },
      { id: 'sicuro', label: 'Sicuro', emoji: '😎' },
      { id: 'libero', label: 'Libero', emoji: '🦅' },
      { id: 'compassionevole', label: 'Compassionevole', emoji: '🤲' }
    ]
  };

  // Texte (Angepasst an PDF: "vous" statt "du", Annuler hinzugefügt)
  const translations = {
    en: { 
      back: '← Back', 
      title: 'Choose your emotion', 
      confirmTitle: 'You chose {emotion} {emoji}', 
      confirmSub: 'Good! Are you ready for your shift?', 
      transfer: 'DSP Transfer 18 s', 
      cancel: 'Cancel',
      countdown: 'Starting in {count} s...'
    },
    fr: { 
      back: '← Retour', 
      title: 'Choisissez votre émotion', 
      confirmTitle: 'Vous avez choisi {emotion} {emoji}', 
      confirmSub: 'Bien ! Êtes-vous prêt pour votre changement ?', 
      transfer: 'Transfert DSP 18 s', 
      cancel: 'Annuler',
      countdown: 'Démarrage dans {count} s...'
    },
    de: { 
      back: '← Zurück', 
      title: 'Wähle deine Emotion', 
      confirmTitle: 'Du hast {emotion} {emoji} gewählt', 
      confirmSub: 'Gut! Bist du bereit für deine Veränderung?', 
      transfer: 'DSP Transfer 18 s', 
      cancel: 'Abbrechen',
      countdown: 'Start in {count} s...'
    },
    pt: { 
      back: '← Voltar', 
      title: 'Escolha sua emoção', 
      confirmTitle: 'Você escolheu {emotion} {emoji}', 
      confirmSub: 'Bom! Está pronto para sua transformação?', 
      transfer: 'Transferência DSP 18 s', 
      cancel: 'Cancelar',
      countdown: 'Iniciando em {count} s...'
    },
    es: { 
      back: '← Volver', 
      title: 'Elige tu emoción', 
      confirmTitle: 'Elegiste {emotion} {emoji}', 
      confirmSub: '¡Bien! ¿Estás listo para tu cambio?', 
      transfer: 'Transferencia DSP 18 s', 
      cancel: 'Cancelar',
      countdown: 'Iniciando en {count} s...'
    },
    it: { 
      back: '← Indietro', 
      title: 'Scegli la tua emozione', 
      confirmTitle: 'Hai scelto {emotion} {emoji}', 
      confirmSub: 'Bene! Sei pronto per il tuo cambiamento?', 
      transfer: 'Trasferimento DSP 18 s', 
      cancel: 'Annulla',
      countdown: 'Avvio tra {count} s...'
    }
  };

  $: t = translations[lang] || translations.fr;
  $: emotionList = emotionsMap[lang] || emotionsMap.fr;
  
  function selectEmotion(emotionObj) {
    if (isConfirming) return;
    
    selectedEmotion = emotionObj;
    isConfirming = true;
    countdown = 2;

    // Countdown starten
    if (countdownInterval) clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        navigateToDSP();
      }
    }, 1000);
  }

  function navigateToDSP() {
    if (!selectedEmotion) return;
    goto(`/dsp?lang=${lang}&emotion=${encodeURIComponent(selectedEmotion.label)}`);
  }
  
  function cancelSelection() {
    if (countdownInterval) clearInterval(countdownInterval);
    isConfirming = false;
    countdown = 2;
    // selectedEmotion bleibt erhalten, damit man nicht neu klicken muss, 
    // aber der Prozess stoppt. Oder ganz resetten wenn gewünscht:
    // selectedEmotion = null; 
  }

  function goBack() {
    if (countdownInterval) clearInterval(countdownInterval);
    goto('/home');
  }
  
  onDestroy(() => {
    if (countdownInterval) clearInterval(countdownInterval);
  });
</script>

<svelte:head>
  <title>{t.title}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover"/>
</svelte:head>

<!-- Hauptcontainer mit neuem Background -->
<div class="container">
  
  <!-- Back Button -->
  <button class="btn-back" on:click={goBack}>
    <span>←</span>
    <span>{t.back.replace('← ', '')}</span>
  </button>

  <!-- Content Wrapper -->
  <div class="content-wrapper">
    
    <!-- Decorative Orb (Nur sichtbar wenn keine Auswahl) -->
    {#if !isConfirming}
      <div class="orb" aria-hidden="true"></div>
    {/if}
    
    <!-- Title -->
    <h1 class="title">{t.title}</h1>

    <!-- Grid Layout (6 Spalten Desktop, bricht runter auf 3 dann 2) -->
    <div class="emotion-grid">
      {#each emotionList as emotion (emotion.id)}
        <button
          class="emotion-tile {selectedEmotion?.id === emotion.id ? 'selected' : ''} {isConfirming && selectedEmotion?.id !== emotion.id ? 'dimmed' : ''}"
          on:click={() => selectEmotion(emotion)}
          disabled={isConfirming}
          aria-pressed={selectedEmotion?.id === emotion.id}
        >
          <span class="emoji">{emotion.emoji}</span>
          <span class="label">{emotion.label}</span>
          
          {#if selectedEmotion?.id === emotion.id}
            <span class="check-badge">✓</span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Confirmation Area (FIXED HEIGHT - Verhindert Springen!) -->
    <!-- Dieser Bereich ist IMMER da, nur unsichtbar wenn nicht bestätigt -->
    <div class="confirmation-area" style="visibility: {isConfirming ? 'visible' : 'hidden'}; opacity: {isConfirming ? 1 : 0};">
      {#if selectedEmotion}
        <p class="confirm-title">
          {t.confirmTitle.replace('{emotion}', selectedEmotion.label).replace('{emoji}', selectedEmotion.emoji)}
        </p>
        <p class="confirm-subtitle">{t.confirmSub}</p>
        
        <div class="action-row">
          <button class="btn-primary confirm-btn" style="position: relative; overflow: hidden;">
            <!-- Fortschritts-Füllung -->
            <div class="progress-fill" style="width: {((2 - countdown) / 2) * 100}%"></div>
            <span class="btn-text">{t.transfer}</span>
          </button>
          
          <button class="btn-ghost" on:click={cancelSelection}>{t.cancel}</button>
        </div>
        
        <p class="countdown-text" aria-live="polite">
          {t.countdown.replace('{count}', countdown)}
        </p>
      {/if}
    </div>

  </div>
</div>

<style>
  /* --- DESIGN TOKENS AUS DEM PDF --- */
  :root {
    --gold-200: #FFF0A8;
    --gold-300: #FBD95A;
    --gold-400: #F5C518;
    --gold-500: #E9B10F;
    --gold-600: #DDA10C;
    --ink-900: #1B1405;
    --ink-700: #4A3708;
    --cream-50: #FFF8E1;
    --glass: rgba(255, 251, 235, 0.58);
    --glass-strong: rgba(255, 251, 235, 0.86);
    --shadow-1: 0 4px 12px rgba(74, 55, 8, 0.16), 0 1px 2px rgba(74, 55, 8, 0.12);
    --shadow-2: 0 16px 40px rgba(74, 55, 8, 0.28);
    --font-main: 'Inter', 'Roboto', system-ui, sans-serif;
  }

  .container {
    position: relative;
    width: 100%;
    min-height: 100dvh;
    display: flex;
    justify-content: center;
    padding-top: 40px;
    box-sizing: border-box;
    /* Neuer Hintergrund aus PDF Seite 2 */
    background: 
      radial-gradient(ellipse 60% 55% at 50% 42%, rgba(255, 244, 190, 0.55), transparent 70%),
      linear-gradient(150deg, var(--gold-300), var(--gold-400) 42%, var(--gold-600));
    background-attachment: fixed;
  }

  .content-wrapper {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px;
  }

  /* Orb Decoration */
  .orb {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, var(--gold-200), var(--gold-300));
    box-shadow: 0 0 48px rgba(255, 240, 170, 0.85);
    margin-bottom: 16px;
    transition: opacity 0.3s ease;
  }

  /* Typography */
  .title {
    font-size: 40px;
    line-height: 48px;
    font-weight: 700;
    color: var(--ink-900); /* Dunkler Text! */
    margin: 16px 0 32px 0;
    text-align: center;
    letter-spacing: -0.02em;
  }

  /* Grid System */
  .emotion-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr); /* Desktop: 6 Spalten */
    gap: 12px;
    width: 100%;
    max-width: 1092px;
    margin-bottom: 0; /* Kein Margin, da Confirmation-Area darunter fix ist */
  }

  /* Emotion Tiles */
  .emotion-tile {
    height: 80px;
    border-radius: 24px;
    background: var(--glass);
    border: 1px solid rgba(255, 255, 255, 0.4);
    display: flex;
    flex-direction: row; 
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.14s ease-out;
    position: relative;
    padding: 0 8px;
    color: var(--ink-900); /* Dunkler Text */
  }

  .emotion-tile:hover:not(:disabled) {
    background: var(--glass-strong);
    transform: translateY(-2px);
    box-shadow: var(--shadow-2);
  }

  .emotion-tile.selected {
    background: var(--ink-900);
    color: var(--gold-300);
    border-color: var(--ink-900);
    transform: scale(1.03);
    z-index: 10;
  }

  .emotion-tile.dimmed {
    opacity: 0.7;
    transform: scale(0.98);
  }

  .emoji {
    font-size: 28px;
    line-height: 1;
  }

  .label {
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
    white-space: nowrap;
  }

  .check-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 22px;
    height: 22px;
    background: var(--gold-300);
    color: var(--ink-900);
    border-radius: 50%;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  /* Confirmation Area (Fixed Height to prevent jump) */
  .confirmation-area {
    height: 180px; /* Feste Höhe reservieren (PDF sagt ~160px+) */
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    transition: opacity 0.2s ease;
    text-align: center;
    margin-top: 20px;
  }

  .confirm-title {
    font-size: 24px;
    line-height: 32px;
    font-weight: 700;
    color: var(--ink-900);
    margin: 0 0 4px 0;
  }

  .confirm-subtitle {
    font-size: 18px;
    line-height: 26px;
    font-weight: 500;
    color: var(--ink-700);
    margin: 0 0 24px 0;
  }

  .action-row {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 8px;
    position: relative;
    z-index: 20;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-primary {
    height: 64px;
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
    transition: transform 0.1s, background 0.16s, box-shadow 0.16s;
    box-shadow: var(--shadow-1);
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .btn-primary:hover {
    background: #2B2008;
    transform: translateY(-2px);
    box-shadow: var(--shadow-2);
  }

  .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(251, 217, 90, 0.22);
    z-index: -1;
    transition: width 1s linear;
  }

  .btn-ghost {
    height: 64px;
    padding: 0 32px;
    border-radius: 999px;
    background: transparent;
    border: 2px solid var(--ink-900);
    color: var(--ink-900);
    font: 600 20px/1 var(--font-main);
    cursor: pointer;
    transition: background 0.16s;
  }

  .btn-ghost:hover {
    background: var(--glass-strong);
  }

  .countdown-text {
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
    color: var(--ink-700);
    margin: 0;
  }

  .btn-back {
    position: absolute;
    top: 24px;
    left: 24px;
    height: 60px;
    padding: 0 24px 0 20px;
    border-radius: 999px;
    background: var(--ink-900);
    color: var(--cream-50);
    font: 600 18px/1 var(--font-main);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 100;
    transition: transform 0.1s, background 0.16s;
  }

  .btn-back:hover {
    background: #2B2008;
    transform: translateX(2px);
  }

  /* Responsive Breakpoints */
  @media (max-width: 1100px) {
    .emotion-grid {
      grid-template-columns: repeat(3, 1fr); /* Tablet: 3 Spalten */
    }
  }

  @media (max-width: 640px) {
    .emotion-grid {
      grid-template-columns: repeat(2, 1fr); /* Mobile: 2 Spalten */
      gap: 10px;
    }
    
    .emotion-tile {
      height: 72px;
    }
    
    .label {
      font-size: 16px;
    }

    .title {
      font-size: 32px;
      line-height: 40px;
    }

    .action-row {
      flex-direction: column;
      width: 100%;
    }

    .btn-primary, .btn-ghost {
      width: 100%;
    }
    
    .btn-back {
      padding: 0 16px;
      font-size: 16px;
    }
    
    .btn-back span:last-child {
      display: none; /* Nur Pfeil auf sehr kleinen Screens */
    }
  }
</style>