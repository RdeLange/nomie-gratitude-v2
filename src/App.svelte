<script lang="ts">
  import { onMount } from 'svelte';
  import { promptForDay, recentDays } from './prompts';
  import { paletteFrom, glassFrom, tintTextFrom, dangerTextFrom, type Palette, type Glass } from './palette';
  import { t, setLanguage, currentLanguage } from './i18n/index.svelte';
  import { onPrefsChange } from './prefs-live';

  // Nomie passes the colours and text size of the app. The defaults only show when the plugin is opened outside Nomie.
  let plugin: any;
  let view = $state<'modal' | 'widget'>('modal');
  let today = $state(new Date());
  let palette = $state<Palette>(paletteFrom(undefined));
  let glass = $state<Glass>(glassFrom(undefined));
  let tintText = $state(tintTextFrom(undefined));
  let dangerText = $state(dangerTextFrom(undefined));
  let scale = $state(1);

  const prompt = $derived(promptForDay(today));
  const days = $derived(recentDays(today));

  const applyNomieValues = () => {
    if (!plugin?.prefs) return;
    palette = paletteFrom(plugin.prefs);
    setLanguage(plugin.prefs?.language);
    glass = glassFrom(plugin.prefs);
    tintText = tintTextFrom(plugin.prefs);
    dangerText = dangerTextFrom(plugin.prefs);
    scale = plugin.prefs.fontScale || 1;
    today = new Date();
  };

  const writeDown = (text: string) => plugin.openNoteEditor(`${t('gratefulFor', { text })}\n`);

  onMount(() => {
    plugin = new NomiePlugin({
      name: 'Nomie Gratitude',
      emoji: '🙏',
      description: 'A gratitude prompt every day. Tap a prompt to write it down in Nomie.',
      uses: ['openNoteEditor'],
      version: '2.0',
      addToCaptureMenu: false,
      addToMoreMenu: true,
      addToWidgets: true,
    });
    onPrefsChange(plugin, () => applyNomieValues());
  plugin.onRegistered(() => applyNomieValues());
    plugin.onWidget(() => {
      view = 'widget';
      applyNomieValues();
    });
    plugin.onUIOpened(() => {
      view = 'modal';
      applyNomieValues();
    });
  });
</script>

<div class="card" class:widget={view === 'widget'} style="--page: {palette.page}; --card: {palette.card}; --text: {palette.text}; --muted: {palette.textSecondary}; --line: {palette.separator}; --tint: {palette.tint}; --tint-text: {tintText}; --glass-fill: {glass.fill}; --glass-edge: {glass.edge}; --glass-blur: {glass.blur}; --glass-shadow: {glass.shadow}; --on-tint: {palette.onTint}; --scale: {scale};">
  {#if view === 'widget'}
    <button class="prompt-button" onclick={() => writeDown(prompt)}>
      <span class="emoji" aria-hidden="true">🙏</span>
      <span>{prompt}</span>
    </button>
  {:else}
    <header class="top"><h1>{t('title')}</h1></header>
    <p class="muted">{t('today')}</p>
    <section class="panel">
      <p class="big">{prompt}</p>
      <button class="primary" onclick={() => writeDown(prompt)}>{t('writeDown')}</button>
    </section>

    <h2>{t('lastSeven')}</h2>
    <section class="panel list">
      {#each days as day (day.date.toDateString())}
        <button class="row" onclick={() => writeDown(day.prompt)}>
          <span class="day">{day.date.toLocaleDateString(currentLanguage(), { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          <span>{day.prompt}</span>
        </button>
      {/each}
    </section>
  {/if}
</div>

<style>
  /* the app's text: its iOS font stack (PLG-LF-07) */
  :global(body) { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif; -webkit-font-smoothing: antialiased; --ios-font-rounded: ui-rounded, -apple-system, system-ui, sans-serif; }
  /* the header is a Liquid Glass bar (D-glass): it stays at the top and the content scrolls under it */
  .top { position: sticky; top: 0; z-index: 2; margin: -16px -16px 8px; padding: 16px 16px 10px; background: var(--glass-fill); -webkit-backdrop-filter: var(--glass-blur); backdrop-filter: var(--glass-blur); border-bottom: 1px solid var(--glass-edge); }
  .card { box-sizing: border-box; min-height: 100vh; padding: 16px; background: var(--page); color: var(--text); font-size: calc(17px * var(--scale)); line-height: 1.4; }
  .card.widget { min-height: 0; padding: 12px; font-size: calc(15px * var(--scale)); }
  h1 { margin: 0 0 4px; font-size: calc(28px * var(--scale)); font-weight: 700; }
  h2 { margin: 24px 0 8px; font-size: calc(13px * var(--scale)); font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
  .muted { margin: 0; color: var(--muted); }
  .panel { padding: 16px; border-radius: 16px; background: var(--card); }
  .big { margin: 0 0 16px; font-size: calc(22px * var(--scale)); font-weight: 600; }
  .primary { display: block; width: 100%; padding: 12px; border: 0; border-radius: 12px; background: var(--tint); color: var(--on-tint); font: inherit; font-weight: 600; cursor: pointer; }
  .list { padding: 4px 16px; }
  .row { display: block; width: 100%; padding: 10px 0; border: 0; border-top: 1px solid var(--line); background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
  .row:first-child { border-top: 0; }
  .day { display: block; font-size: calc(13px * var(--scale)); color: var(--muted); }
  .prompt-button { display: flex; align-items: center; gap: 12px; width: 100%; padding: 0; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
  .emoji { font-size: calc(26px * var(--scale)); }
</style>
