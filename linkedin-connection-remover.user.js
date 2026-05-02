// ==UserScript==
// @name         LinkedIn Connection Remover
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Hover the 3-dot (More actions) button on a LinkedIn connection and press D to auto-remove them.
// @author       Sajjad
// @match        https://www.linkedin.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  document.addEventListener('mousemove', (e) => {
    window._mouseX = e.clientX;
    window._mouseY = e.clientY;
  });

  document.addEventListener('keydown', async (e) => {
    if (e.key !== 'd' && e.key !== 'D') return;

    const el = document.elementFromPoint(window._mouseX || 0, window._mouseY || 0);
    if (!el) { console.warn('[LHR] Nothing under cursor'); return; }

    const moreBtn = el.closest('button[aria-label*="More actions"], button[aria-label*="more actions"]');
    if (!moreBtn) { console.warn('[LHR] Not hovering a 3-dot button'); return; }

    console.log('[LHR] Clicking 3-dot for:', moreBtn.getAttribute('aria-label'));
    moreBtn.click();
    await sleep(700);

    // Step 1: Click the menuitem div in the dropdown
    let menuItem = null;
    for (const item of document.querySelectorAll('div[role="menuitem"]')) {
      if (item.innerText?.toLowerCase().includes('remove connection')) {
        menuItem = item; break;
      }
    }
    if (!menuItem) { console.warn('[LHR] Remove connection menuitem not found'); return; }

    console.log('[LHR] Clicking Remove connection menu item');
    menuItem.click();
    await sleep(700);

    // Step 2: Click the confirm button in the dialog
    let confirmBtn = null;
    for (const btn of document.querySelectorAll('button')) {
      const text = btn.innerText?.trim().toLowerCase();
      if (text === 'remove connection') {
        confirmBtn = btn; break;
      }
    }
    if (!confirmBtn) { console.warn('[LHR] Confirm button not found'); return; }

    console.log('[LHR] Confirming removal');
    confirmBtn.click();
    console.log('[LHR] ✓ Done! Connection removed.');
  });

})();
