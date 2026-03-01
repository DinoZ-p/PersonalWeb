/*!
 * Dino Jr. Chat Widget
 * Uses the existing .avatar-wrap in the sidebar as the chat trigger.
 */

(function () {
  'use strict';

  /* =========================================================================
   * CONFIGURATION — change BACKEND_URL before deploying
   * ========================================================================= */
  var BACKEND_URL = 'https://web-production-4f6b.up.railway.app';
  var AVATAR_URL  = 'dinoAvatar.jpeg';         // ← used in the panel header

  /* =========================================================================
   * CONSTANTS
   * ========================================================================= */
  var GREETING =
    "Hey!! I\u2019m Dino Jr. \uD83E\uDD95 " +
    "I\u2019m the AI version of Dino \u2014 ask me anything you want to know about him. " +
    "Projects, background, interests, or what he\u2019s been up to. What\u2019s on your mind?";

  var BUBBLE_TEXT    = 'Chat with me! \uD83E\uDD95';
  var BUBBLE_SHOW_MS = 1000;
  var BUBBLE_HIDE_MS = 6500;

  /* =========================================================================
   * STATE
   * ========================================================================= */
  var isOpen              = false;
  var isLoading           = false;
  var greetingShown       = false;
  var conversationHistory = [];

  var $trigger, $bubble, $panel, $messages, $input, $send;

  /* =========================================================================
   * INIT
   * ========================================================================= */
  function init() {
    // Find the existing sidebar avatar
    var avatarWrap = document.querySelector('.avatar-wrap');
    if (!avatarWrap) {
      console.warn('[Dino Jr.] .avatar-wrap not found — widget disabled.');
      return;
    }

    $trigger = avatarWrap;
    $trigger.classList.add('djr-trigger-active');
    $trigger.setAttribute('role', 'button');
    $trigger.setAttribute('tabindex', '0');
    $trigger.setAttribute('aria-label', 'Chat with Dino Jr.');

    // Build speech bubble and panel, append to body
    $bubble = make('div', BUBBLE_TEXT, { id: 'djr-bubble' });
    $panel  = buildPanel();
    document.body.appendChild($bubble);
    document.body.appendChild($panel);

    bindEvents();

    // Show bubble after delay, auto-hide
    positionBubble();
    setTimeout(showBubble, BUBBLE_SHOW_MS);
    setTimeout(function () { if (!isOpen) hideBubble(); }, BUBBLE_HIDE_MS);

    // Reposition if window resizes
    window.addEventListener('resize', positionBubble);
  }

  /* =========================================================================
   * DOM
   * ========================================================================= */
  function buildPanel() {
    var panel = make('div', null, {
      id:           'djr-panel',
      role:         'dialog',
      'aria-label': 'Dino Jr. chat',
    });

    // Header
    var header  = make('div', null, { className: 'djr-header' });
    var hLeft   = make('div', null, { className: 'djr-header-left' });
    var hAvatar = make('img',  null, { className: 'djr-header-avatar', src: AVATAR_URL, alt: '' });
    var hInfo   = make('div');
    var hName   = make('div', 'Dino Jr.',        { className: 'djr-header-name' });
    var hSub    = make('div', 'AI version of Dino', { className: 'djr-header-sub' });
    hInfo.appendChild(hName);
    hInfo.appendChild(hSub);
    hLeft.appendChild(hAvatar);
    hLeft.appendChild(hInfo);

    var closeBtn = make('button', '\u00D7', {
      className:    'djr-close',
      'aria-label': 'Close chat',
    });

    header.appendChild(hLeft);
    header.appendChild(closeBtn);

    // Messages
    $messages = make('div', null, {
      className:   'djr-messages',
      role:        'log',
      'aria-live': 'polite',
    });

    // Input area
    var inputArea = make('div', null, { className: 'djr-input-area' });
    $input = make('textarea', null, {
      className:    'djr-input',
      placeholder:  'Ask me anything\u2026',
      rows:         '1',
      'aria-label': 'Your message',
    });
    $send = make('button', null, {
      className:    'djr-send',
      'aria-label': 'Send',
    });
    $send.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="22" y1="2" x2="11" y2="13"/>' +
      '<polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

    inputArea.appendChild($input);
    inputArea.appendChild($send);

    panel.appendChild(header);
    panel.appendChild($messages);
    panel.appendChild(inputArea);

    panel._close = closeBtn;
    return panel;
  }

  /* =========================================================================
   * BUBBLE POSITIONING
   * ========================================================================= */
  function positionBubble() {
    var rect     = $trigger.getBoundingClientRect();
    var isMobile = window.innerWidth <= 680;

    if (isMobile) {
      // Below the avatar, centered
      $bubble.style.top    = (rect.bottom + 10) + 'px';
      $bubble.style.left   = (rect.left + rect.width / 2 - 80) + 'px';
    } else {
      // To the right of the avatar
      $bubble.style.top    = (rect.top + rect.height / 2 - 18) + 'px';
      $bubble.style.left   = (rect.right + 14) + 'px';
    }
  }

  /* =========================================================================
   * EVENTS
   * ========================================================================= */
  function bindEvents() {
    $trigger.addEventListener('click', toggle);
    $trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
    $panel._close.addEventListener('click', closePanel);

    // Bubble hover
    $trigger.addEventListener('mouseenter', showBubble);
    $trigger.addEventListener('mouseleave', function () { if (!isOpen) hideBubble(); });

    // Send
    $send.addEventListener('click', sendMessage);
    $input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Auto-resize textarea
    $input.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 90) + 'px';
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (isOpen && !$panel.contains(e.target) && !$trigger.contains(e.target)) closePanel();
    });

    // Escape to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closePanel();
    });
  }

  /* =========================================================================
   * OPEN / CLOSE
   * ========================================================================= */
  function toggle() { isOpen ? closePanel() : openPanel(); }

  function openPanel() {
    isOpen = true;
    $panel.classList.add('djr-open');
    hideBubble();

    if (!greetingShown) {
      greetingShown = true;
      setTimeout(function () { appendMsg('assistant', GREETING); }, 280);
    }

    setTimeout(function () { $input.focus(); }, 320);
  }

  function closePanel() {
    isOpen = false;
    $panel.classList.remove('djr-open');
  }

  /* =========================================================================
   * BUBBLE
   * ========================================================================= */
  function showBubble() { $bubble.classList.add('djr-visible'); }
  function hideBubble()  { $bubble.classList.remove('djr-visible'); }

  /* =========================================================================
   * MESSAGES
   * ========================================================================= */
  function appendMsg(role, text) {
    var row    = make('div', null, { className: 'djr-msg-row djr-' + role });
    var bubble = make('div', text, { className: 'djr-msg-bubble' });
    row.appendChild(bubble);
    $messages.appendChild(row);
    $messages.scrollTop = $messages.scrollHeight;
  }

  function showTyping() {
    var row    = make('div', null, { className: 'djr-msg-row djr-assistant', id: 'djr-typing' });
    var bubble = make('div', null, { className: 'djr-msg-bubble' });
    bubble.innerHTML = '<div class="djr-dots"><span></span><span></span><span></span></div>';
    row.appendChild(bubble);
    $messages.appendChild(row);
    $messages.scrollTop = $messages.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById('djr-typing');
    if (t) t.remove();
  }

  /* =========================================================================
   * SEND
   * ========================================================================= */
  function sendMessage() {
    var text = $input.value.trim();
    if (!text || isLoading) return;

    $input.value = '';
    $input.style.height = 'auto';
    setLoading(true);

    appendMsg('user', text);
    conversationHistory.push({ role: 'user', content: text });
    showTyping();

    fetch(BACKEND_URL + '/chat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        message:              text,
        conversation_history: conversationHistory.slice(-20),
      }),
    })
      .then(function (res) {
        hideTyping();
        if (res.status === 429) {
          appendMsg('assistant', "Sending a lot! Give it a minute and I'll be back \uD83D\uDE04");
          setLoading(false);
          return null;
        }
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data) return;
        appendMsg('assistant', data.reply);
        conversationHistory.push({ role: 'assistant', content: data.reply });
        setLoading(false);
      })
      .catch(function () {
        hideTyping();
        appendMsg('assistant', "Dino Jr. is taking a nap \uD83D\uDE34 Try again in a moment!");
        setLoading(false);
      });
  }

  function setLoading(val) {
    isLoading       = val;
    $send.disabled  = val;
    $input.disabled = val;
    if (!val) $input.focus();
  }

  /* =========================================================================
   * UTILITY
   * ========================================================================= */
  function make(tag, text, attrs) {
    var el = document.createElement(tag);
    if (text) el.textContent = text;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') el.className = attrs[k];
        else el.setAttribute(k, attrs[k]);
      });
    }
    return el;
  }

  /* =========================================================================
   * BOOT
   * ========================================================================= */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
