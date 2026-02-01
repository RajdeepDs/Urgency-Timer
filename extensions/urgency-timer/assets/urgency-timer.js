/*!
 * Urgency Timer – Storefront Script (FINAL)
 * Product timer: CSS Grid
 * Top/Bottom bar: Flex
 * Fully aligned with storefront CSS
 */

(() => {
  const DEBUG = true;
  const DEFAULT_ENDPOINT =
    "https://collaboration-mile-bra-minutes.trycloudflare.com/public/timers";

  const STATE = {
    timers: [],
    fetchPromise: null,
  };

  const log = (...a) => DEBUG && console.log("[UrgencyTimer]", ...a);

  const ready = fn =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn);

  const getEndpoint = () =>
    window.URGENCY_TIMER_ENDPOINT || DEFAULT_ENDPOINT;

  /* ================= Context ================= */

  function detectContext() {
    const root = document.querySelector(".urgency-timer-root");
    return {
      shop: root?.dataset?.shopDomain || window.Shopify?.shop || "",
      productId: root?.dataset?.productId || "",
      pageUrl: location.href,
    };
  }

  /* ================= Fetch ================= */

  function fetchTimersOnce(ctx) {
    if (STATE.fetchPromise) return STATE.fetchPromise;

    const params = new URLSearchParams(ctx).toString();
    const url = `${getEndpoint()}?${params}`;

    STATE.fetchPromise = fetch(url)
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(d => (STATE.timers = d?.timers || []))
      .catch(e => {
        log("Fetch error", e);
        STATE.timers = [];
      });

    return STATE.fetchPromise;
  }

  /* ================= Time utils ================= */

  const pad = n => (n < 10 ? "0" + n : String(n));

  function formatDHMS(sec) {
    sec = Math.max(0, sec);
    return {
      days: Math.floor(sec / 86400),
      hours: Math.floor((sec % 86400) / 3600),
      minutes: Math.floor((sec % 3600) / 60),
      seconds: sec % 60,
    };
  }

  function remainingSeconds(timer) {
    if (timer.timerType === "fixed") {
      const key = `utimer_fixed_${timer.id}`;
      const ttl = (timer.fixedMinutes || 0) * 60;
      const now = Math.floor(Date.now() / 1000);
      const start = Number(localStorage.getItem(key) || now);
      localStorage.setItem(key, start);
      return Math.max(0, ttl - (now - start));
    }

    if (timer.endDate) {
      return Math.floor((new Date(timer.endDate).getTime() - Date.now()) / 1000);
    }

    return 0;
  }

  /* ================= DOM helpers ================= */

  const el = (t, c, txt) => {
    const e = document.createElement(t);
    if (c) e.className = c;
    if (txt) e.textContent = txt;
    return e;
  };

  /* =====================================================
     PRODUCT TIMER (GRID)
  ===================================================== */

  function renderProductTimer(timer) {
    const c = el("div", "utimer-container");
    const dc = timer.designConfig || {};

    // Apply container styles
    if (dc.backgroundColor) {
      c.style.backgroundColor = dc.backgroundColor;
    }
    if (dc.textColor) {
      c.style.color = dc.textColor;
    }
    if (dc.borderRadius != null) {
      c.style.borderRadius = `${dc.borderRadius}px`;
    }
    if (dc.borderSize != null && dc.borderColor) {
      c.style.border = `${dc.borderSize}px solid ${dc.borderColor}`;
    }
    if (dc.paddingTop != null) {
      c.style.paddingTop = `${dc.paddingTop}px`;
    }
    if (dc.paddingBottom != null) {
      c.style.paddingBottom = `${dc.paddingBottom}px`;
    }
    if (dc.paddingLeft != null) {
      c.style.paddingLeft = `${dc.paddingLeft}px`;
    }
    if (dc.paddingRight != null) {
      c.style.paddingRight = `${dc.paddingRight}px`;
    }
    if (dc.marginTop != null) {
      c.style.marginTop = `${dc.marginTop}px`;
    }
    if (dc.marginBottom != null) {
      c.style.marginBottom = `${dc.marginBottom}px`;
    }
    if (dc.marginLeft != null) {
      c.style.marginLeft = `${dc.marginLeft}px`;
    }
    if (dc.marginRight != null) {
      c.style.marginRight = `${dc.marginRight}px`;
    }
    if (dc.maxWidth != null) {
      c.style.maxWidth = `${dc.maxWidth}px`;
    }
    if (dc.textAlign) {
      c.style.textAlign = dc.textAlign;
    }
    if (dc.fontFamily) {
      c.style.fontFamily = dc.fontFamily;
    }

    const title = el("div", "utimer-title", timer.title);

    // Apply title styles
    if (dc.titleSize != null) {
      title.style.fontSize = `${dc.titleSize}px`;
    }
    if (dc.titleColor) {
      title.style.color = dc.titleColor;
    }
    if (dc.titleWeight != null) {
      title.style.fontWeight = String(dc.titleWeight);
    }
    if (dc.titleLineHeight != null) {
      title.style.lineHeight = `${dc.titleLineHeight}px`;
    }
    if (dc.titleLetterSpacing != null) {
      title.style.letterSpacing = `${dc.titleLetterSpacing}px`;
    }

    const sub = el("div", "utimer-sub", timer.subheading);

    // Apply subheading styles
    if (dc.subheadingSize != null) {
      sub.style.fontSize = `${dc.subheadingSize}px`;
    }
    if (dc.subheadingColor) {
      sub.style.color = dc.subheadingColor;
    }
    if (dc.subheadingWeight != null) {
      sub.style.fontWeight = String(dc.subheadingWeight);
    }
    if (dc.subheadingLineHeight != null) {
      sub.style.lineHeight = `${dc.subheadingLineHeight}px`;
    }
    if (dc.subheadingLetterSpacing != null) {
      sub.style.letterSpacing = `${dc.subheadingLetterSpacing}px`;
    }

    const countdown = el("div", "utimer-countdown");

    const units = ["days", "hours", "minutes", "seconds"];
    const labels = [
      timer.daysLabel || "Days",
      timer.hoursLabel || "Hrs",
      timer.minutesLabel || "Mins",
      timer.secondsLabel || "Secs",
    ];

    const values = {};

    units.forEach((u, i) => {
      const n = el("span", "utimer-number", "00");

      // Apply timer number styles
      if (dc.timerSize != null) {
        n.style.fontSize = `${dc.timerSize}px`;
      }
      if (dc.timerColor) {
        n.style.color = dc.timerColor;
      }
      if (dc.timerWeight != null) {
        n.style.fontWeight = String(dc.timerWeight);
      }
      if (dc.timerLineHeight != null) {
        n.style.lineHeight = `${dc.timerLineHeight}px`;
      }
      if (dc.timerLetterSpacing != null) {
        n.style.letterSpacing = `${dc.timerLetterSpacing}px`;
      }
      if (dc.timerMinWidthCh != null) {
        n.style.minWidth = `${dc.timerMinWidthCh}ch`;
      }

      countdown.appendChild(n);
      values[u] = n;

      if (i < units.length - 1) {
        const sep = el("span", "utimer-separator", ":");

        // Apply timer color to separators too
        if (dc.timerSize != null) {
          sep.style.fontSize = `${dc.timerSize}px`;
        }
        if (dc.timerColor) {
          sep.style.color = dc.timerColor;
        }
        if (dc.separatorText) {
          sep.textContent = dc.separatorText;
        }

        countdown.appendChild(sep);
      }

      const l = el("span", "utimer-label", labels[i]);
      l.dataset.unit = u;

      // Apply legend styles
      if (dc.legendSize != null) {
        l.style.fontSize = `${dc.legendSize}px`;
      }
      if (dc.legendColor) {
        l.style.color = dc.legendColor;
      }
      if (dc.legendWeight != null) {
        l.style.fontWeight = String(dc.legendWeight);
      }
      if (dc.legendLineHeight != null) {
        l.style.lineHeight = `${dc.legendLineHeight}px`;
      }
      if (dc.legendLetterSpacing != null) {
        l.style.letterSpacing = `${dc.legendLetterSpacing}px`;
      }

      countdown.appendChild(l);
    });

    c.append(title);
    if (timer.subheading) c.append(sub);
    c.append(countdown);

    update();
    const id = setInterval(update, 1000);

    function update() {
      const t = formatDHMS(remainingSeconds(timer));
      units.forEach(u => (values[u].textContent = pad(t[u])));
      if (remainingSeconds(timer) <= 0) clearInterval(id);
    }

    return c;
  }

  /* =====================================================
     BAR TIMER (FLEX)
  ===================================================== */
  function renderBarTimer(timer) {
    const bar = document.createElement("div");
    bar.className = "utimer-bar top";
    bar.dataset.timerId = timer.id;

    const dc = timer.designConfig || {};
    const pos = String(dc.positioning || "top").toLowerCase();
    bar.classList.remove("top", "bottom");
    bar.classList.add(pos.includes("bottom") ? "bottom" : "top");

    if (dc.backgroundColor) {
      bar.style.background = dc.backgroundColor;
    }
    if (dc.textColor) {
      bar.style.color = dc.textColor;
    }
    if (dc.borderRadius != null) {
      bar.style.borderRadius = `${dc.borderRadius}px`;
    }
    if (dc.borderSize != null && dc.borderColor) {
      bar.style.border = `${dc.borderSize}px solid ${dc.borderColor}`;
    }
    if (dc.barZIndex != null) {
      bar.style.zIndex = String(dc.barZIndex);
    }
    if (dc.barTopOffset != null && pos.includes("top")) {
      bar.style.top = `${dc.barTopOffset}px`;
    }
    if (dc.barBottomOffset != null && pos.includes("bottom")) {
      bar.style.bottom = `${dc.barBottomOffset}px`;
    }

    const container = document.createElement("div");
    container.className = "utimer-bar-inner";
    if (dc.barPadding != null) {
      container.style.padding = `${dc.barPadding}px`;
    }
    if (dc.barGap != null) {
      container.style.gap = `${dc.barGap}px`;
    }
    if (dc.barJustifyContent) {
      container.style.justifyContent = dc.barJustifyContent;
    }
    if (dc.barAlignItems) {
      container.style.alignItems = dc.barAlignItems;
    }
    if (dc.fontFamily) {
      container.style.fontFamily = dc.fontFamily;
    }

    // Left text
    const text = document.createElement("span");
    text.className = "utimer-bar-text";
    text.textContent = timer.title || "Hurry up! Sale ends in:";
    if (dc.textTransform) {
      text.style.textTransform = dc.textTransform;
    }

    // Apply title styles to bar text
    if (dc.titleSize != null) {
      text.style.fontSize = `${dc.titleSize}px`;
    }
    if (dc.titleColor) {
      text.style.color = dc.titleColor;
    }
    if (dc.titleWeight != null) {
      text.style.fontWeight = String(dc.titleWeight);
    }
    if (dc.titleLineHeight != null) {
      text.style.lineHeight = `${dc.titleLineHeight}px`;
    }
    if (dc.titleLetterSpacing != null) {
      text.style.letterSpacing = `${dc.titleLetterSpacing}px`;
    }

    // Countdown
    const countdown = document.createElement("span");
    countdown.className = "utimer-bar-countdown";
    if (dc.countdownGap != null) {
      countdown.style.gap = `${dc.countdownGap}px`;
    }

    const units = ["days", "hours", "minutes", "seconds"];
    const values = {};

    units.forEach((u, i) => {
      const num = document.createElement("span");
      num.className = "utimer-bar-number";
      num.textContent = "00";

      // Apply timer styles
      if (dc.timerSize != null) {
        num.style.fontSize = `${dc.timerSize}px`;
      }
      if (dc.timerColor) {
        num.style.color = dc.timerColor;
      }
      if (dc.timerWeight != null) {
        num.style.fontWeight = String(dc.timerWeight);
      }
      if (dc.timerLineHeight != null) {
        num.style.lineHeight = `${dc.timerLineHeight}px`;
      }
      if (dc.timerLetterSpacing != null) {
        num.style.letterSpacing = `${dc.timerLetterSpacing}px`;
      }
      if (dc.timerMinWidthCh != null) {
        num.style.minWidth = `${dc.timerMinWidthCh}ch`;
      }

      countdown.appendChild(num);
      values[u] = num;

      if (i < units.length - 1) {
        const sep = document.createElement("span");
        sep.className = "utimer-bar-separator";
        sep.textContent = ":";

        // Apply timer color to separators
        if (dc.timerSize != null) {
          sep.style.fontSize = `${dc.timerSize}px`;
        }
        if (dc.timerColor) {
          sep.style.color = dc.timerColor;
        }
        if (dc.separatorText) {
          sep.textContent = dc.separatorText;
        }

        countdown.appendChild(sep);
      }
    });

    // CTA
    const cta = document.createElement("a");
    cta.className = "utimer-bar-button";
    cta.textContent = timer.buttonText || "Shop now!";
    cta.href = timer.buttonLink || "#";
    if (dc.buttonTextTransform) {
      cta.style.textTransform = dc.buttonTextTransform;
    }

    // Apply button styles
    if (dc.buttonBackgroundColor) {
      cta.style.backgroundColor = dc.buttonBackgroundColor;
    }
    if (dc.buttonColor) {
      cta.style.color = dc.buttonColor;
    }
    if (dc.buttonFontSize != null) {
      cta.style.fontSize = `${dc.buttonFontSize}px`;
    }
    if (dc.buttonCornerRadius != null) {
      cta.style.borderRadius = `${dc.buttonCornerRadius}px`;
    }
    if (dc.buttonPaddingX != null || dc.buttonPaddingY != null) {
      const px = dc.buttonPaddingX != null ? `${dc.buttonPaddingX}px` : undefined;
      const py = dc.buttonPaddingY != null ? `${dc.buttonPaddingY}px` : undefined;
      if (py) cta.style.paddingTop = py, cta.style.paddingBottom = py;
      if (px) cta.style.paddingLeft = px, cta.style.paddingRight = px;
    }
    if (dc.buttonBorderSize != null && dc.buttonBorderColor) {
      cta.style.border = `${dc.buttonBorderSize}px solid ${dc.buttonBorderColor}`;
    }

    container.append(text, countdown, cta);
    bar.appendChild(container);
    document.body.appendChild(bar);

    function update() {
      const sec = Math.max(
        0,
        Math.floor((new Date(timer.endDate).getTime() - Date.now()) / 1000)
      );
      const d = Math.floor(sec / 86400);
      const h = Math.floor((sec % 86400) / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;

      values.days.textContent = String(d).padStart(2, "0");
      values.hours.textContent = String(h).padStart(2, "0");
      values.minutes.textContent = String(m).padStart(2, "0");
      values.seconds.textContent = String(s).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }


  /* ================= Mount ================= */

  function mount(ctx, timers) {
    document.querySelectorAll(".utimer-bar").forEach(b => b.remove());

    document.querySelectorAll(".urgency-timer-root").forEach(root => {
      const t = timers.find(x => x.type === "product-page");
      if (t) {
        root.innerHTML = "";
        root.appendChild(renderProductTimer(t));
      }
    });

    timers
      .filter(t => t.type === "top-bottom-bar")
      .forEach(renderBarTimer);
  }

  function init() {
    const ctx = detectContext();
    if (!ctx.shop || window.__UTIMER_INIT__) return;
    window.__UTIMER_INIT__ = true;

    fetchTimersOnce(ctx).then(timers => mount(ctx, timers));
  }

  ready(init);
})();
