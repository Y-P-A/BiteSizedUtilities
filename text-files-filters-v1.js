(() => {
  "use strict";

  const escapeMarkup = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  const morse = { a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--" };
  const upside = Object.fromEntries([..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?.,()[]{}"].map((character, index) => [character, [..."ɐqɔpǝƃɥɾʞlɯuodbɹsʇnʌʍxʎz∀ꓭƆ◖Ǝ⅁HIſꓘꓶWNOQᴚSꓕ∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86¡¿˙'()[]{}"][index] || character]));
  const smallCaps = { a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ" };
  const leet = { a: "4", b: "8", e: "3", g: "6", i: "1", l: "1", o: "0", s: "5", t: "7", z: "2" };
  const words = (text) => String(text).trim().split(/\s+/).filter(Boolean);
  const titleCase = (text) => String(text).toLowerCase().replace(/(^|[^\p{L}\p{N}])(\p{L})/gu, (_, prefix, letter) => prefix + letter.toUpperCase());
  const asciiWords = (text) => String(text).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").match(/[A-Za-z0-9]+/g) || [];
  const shuffle = (values) => {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  };
  const unicodeBase64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, Math.min(offset + 0x8000, bytes.length)));
    return btoa(binary);
  };
  const toMorse = (text) => [...String(text).toLowerCase()].map((character) => (character === " " ? "/" : morse[character] || character)).join(" ");
  const pigLatin = (text) => String(text).replace(/\b([A-Za-z]+)\b/g, (word) => {
    const match = word.match(/^([^aeiouAEIOU]*)(.*)$/);
    const converted = match[1] ? `${match[2]}${match[1]}ay` : `${word}way`;
    return /^[A-Z]/.test(word) ? converted[0].toUpperCase() + converted.slice(1).toLowerCase() : converted.toLowerCase();
  });

  const filters = [
    ["upper", "UPPERCASE", "Case", (text) => text.toUpperCase()],
    ["lower", "lowercase", "Case", (text) => text.toLowerCase()],
    ["title", "Title Case", "Case", titleCase],
    ["sentence", "Sentence case", "Case", (text) => text.toLowerCase().replace(/(^|[.!?]\s+)(\p{L})/gu, (_, prefix, letter) => prefix + letter.toUpperCase())],
    ["toggle", "tOGGLE cASE", "Case", (text) => [...text].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join("")],
    ["alternating", "aLtErNaTiNg", "Case", (text) => { let upper = false; return [...text].map((c) => (/\p{L}/u.test(c) ? ((upper = !upper) ? c.toLowerCase() : c.toUpperCase()) : c)).join(""); }],
    ["randomcase", "RaNdOm CaSe", "Case", (text) => [...text].map((c) => (Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase())).join("")],
    ["camel", "camelCase", "Case", (text) => asciiWords(text).map((word, index) => (index ? titleCase(word) : word.toLowerCase())).join("")],
    ["pascal", "PascalCase", "Case", (text) => asciiWords(text).map(titleCase).join("")],
    ["snake", "snake_case", "Case", (text) => asciiWords(text).map((word) => word.toLowerCase()).join("_")],
    ["kebab", "kebab-case", "Case", (text) => asciiWords(text).map((word) => word.toLowerCase()).join("-")],
    ["reverse", "Reverse everything", "Order", (text) => [...text].reverse().join("")],
    ["reversewords", "Reverse each word", "Order", (text) => text.replace(/\S+/g, (word) => [...word].reverse().join(""))],
    ["reverseorder", "Reverse word order", "Order", (text) => words(text).reverse().join(" ")],
    ["reverselines", "Reverse line order", "Order", (text) => text.split(/\r?\n/).reverse().join("\n")],
    ["sortaz", "Sort lines A → Z", "Order", (text) => text.split(/\r?\n/).sort((a, b) => a.localeCompare(b)).join("\n")],
    ["sortza", "Sort lines Z → A", "Order", (text) => text.split(/\r?\n/).sort((a, b) => b.localeCompare(a)).join("\n")],
    ["unique", "Unique lines", "Order", (text) => [...new Set(text.split(/\r?\n/))].join("\n")],
    ["shufflewords", "Shuffle words", "Order", (text) => shuffle(words(text)).join(" ")],
    ["shufflelines", "Shuffle lines", "Order", (text) => shuffle(text.split(/\r?\n/)).join("\n")],
    ["spaces", "Normalize spaces", "Clean", (text) => text.replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim()],
    ["blanklines", "Remove blank lines", "Clean", (text) => text.split(/\r?\n/).filter((line) => line.trim()).join("\n")],
    ["oneline", "Make one line", "Clean", (text) => text.replace(/\s+/g, " ").trim()],
    ["punctuation", "Remove punctuation", "Clean", (text) => text.replace(/[\p{P}\p{S}]/gu, "")],
    ["digits", "Remove numbers", "Clean", (text) => text.replace(/\p{N}/gu, "")],
    ["accents", "Remove accents", "Clean", (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC")],
    ["emoji", "Remove emoji", "Clean", (text) => text.replace(/\p{Extended_Pictographic}/gu, "")],
    ["tabs", "Tabs → spaces", "Clean", (text) => text.replace(/\t/g, "    ")],
    ["numbers", "Add line numbers", "Clean", (text) => text.split(/\r?\n/).map((line, index) => `${index + 1}. ${line}`).join("\n")],
    ["rot13", "ROT13", "Encode", (text) => text.replace(/[A-Za-z]/g, (c) => String.fromCharCode((c <= "Z" ? 65 : 97) + ((c.charCodeAt(0) - (c <= "Z" ? 65 : 97) + 13) % 26)))],
    ["caesar", "Caesar shift", "Encode", (text, options) => text.replace(/[A-Za-z]/g, (c) => { const base = c <= "Z" ? 65 : 97; return String.fromCharCode(base + ((c.charCodeAt(0) - base + options.shift) % 26)); })],
    ["base64", "Base64", "Encode", unicodeBase64],
    ["binary", "Binary bytes", "Encode", (text) => [...new TextEncoder().encode(text)].map((byte) => byte.toString(2).padStart(8, "0")).join(" ")],
    ["hex", "Hex bytes", "Encode", (text) => [...new TextEncoder().encode(text)].map((byte) => byte.toString(16).padStart(2, "0")).join(" ")],
    ["url", "URL encode", "Encode", encodeURIComponent],
    ["entities", "HTML entities", "Encode", escapeMarkup],
    ["morse", "Morse code", "Encode", toMorse],
    ["leet", "L33T SP34K", "Wild", (text) => [...text].map((c) => leet[c.toLowerCase()] || c).join("")],
    ["fullwidth", "Ｆｕｌｌｗｉｄｔｈ", "Wild", (text) => [...text].map((c) => (c === " " ? "　" : c.charCodeAt(0) >= 33 && c.charCodeAt(0) <= 126 ? String.fromCharCode(c.charCodeAt(0) + 0xfee0) : c)).join("")],
    ["circled", "Ⓒⓘⓒⓛⓔⓓ", "Wild", (text) => [...text].map((c) => { const lower = c.toLowerCase(); if (/[a-z]/.test(lower)) return String.fromCodePoint(0x24d0 + lower.charCodeAt(0) - 97); if (/[1-9]/.test(c)) return String.fromCodePoint(0x2460 + Number(c) - 1); return c; }).join("")],
    ["smallcaps", "Sᴍᴀʟ Cᴀs", "Wild", (text) => [...text].map((c) => smallCaps[c.toLowerCase()] || c).join("")],
    ["upside", "Upside down", "Wild", (text) => [...text].reverse().map((c) => upside[c] || c).join("")],
    ["vapor", "V A P O R W A V E", "Wild", (text) => [...text.toUpperCase()].join(" ")],
    ["clap", "👏 Clap 👏 words", "Wild", (text) => words(text).join(" 👏 ")],
    ["piglatin", "Pig Latin", "Wild", pigLatin],
    ["zalgo", "Zalgo chaos", "Wild", (text, options) => { const marks = ["\u0300", "\u0301", "\u0302", "\u0303", "\u0304", "\u0307", "\u0308", "\u0315", "\u031b", "\u0323", "\u0324", "\u0325", "\u0334", "\u0335", "\u0336"]; return [...text].map((c) => (/\s/.test(c) ? c : c + Array.from({ length: options.chaos }, () => marks[Math.floor(Math.random() * marks.length)]).join(""))).join(""); }],
  ].map(([id, label, category, apply]) => ({ id, label, category, apply }));

  function renderTextFilters() {
    const categories = [...new Set(filters.map((filter) => filter.category))];
    return `
      <div class="text-filter-layout">
        <section class="game-panel panel-lilac text-filter-controls">
          <div class="dev-tool-heading"><div><h3>Filter pantry</h3><p class="panel-note">Pick one transformation, or flip on stack mode to chain several into a wonderfully cursed recipe.</p></div><span class="dev-local-badge">${filters.length} FILTERS</span></div>
          <div class="text-filter-category-tabs" role="tablist" aria-label="Text filter categories">
            ${categories.map((category, index) => `<button class="tab-button${index === 0 ? " active" : ""}" data-filter-category="${category}" aria-selected="${index === 0}">${category}</button>`).join("")}
          </div>
          <div class="text-filter-grid" id="textFilterGrid">
            ${filters.map((filter) => `<button class="text-filter-button" data-text-filter="${filter.id}" data-filter-group="${filter.category}"${filter.category === categories[0] ? "" : " hidden"}>${escapeMarkup(filter.label)}</button>`).join("")}
          </div>
          <div class="text-filter-options">
            <label>Caesar shift <strong id="textShiftValue">3</strong><input id="textShift" type="range" min="1" max="25" value="3" /></label>
            <label>Chaos level <strong id="textChaosValue">3</strong><input id="textChaos" type="range" min="1" max="8" value="3" /></label>
            <button class="tab-button" id="textStackMode" aria-pressed="false">STACK MODE: OFF</button>
          </div>
        </section>
        <section class="text-filter-workspace">
          <div class="game-panel panel-teal">
            <div class="dev-tool-heading"><h3>Original text</h3><span class="dev-local-badge" id="textInputStats">0 WORDS</span></div>
            <textarea class="chunky-textarea text-filter-textarea" id="textFilterInput" aria-label="Original text">Bite Sized Utilities makes tiny tools feel wildly delightful!
Try stacking filters for extra chaos.</textarea>
          </div>
          <div class="game-panel text-filter-output-panel">
            <div class="dev-tool-heading"><h3 id="textFilterResultLabel">Choose a filter</h3><span class="dev-local-badge" id="textOutputStats">0 CHARS</span></div>
            <textarea class="chunky-textarea text-filter-textarea" id="textFilterOutput" aria-label="Filtered text" readonly></textarea>
            <div class="button-row dev-action-row">
              <button class="game-button" id="copyFilteredText">COPY</button>
              <button class="game-button game-button-sage" id="useFilteredText">USE AS INPUT</button>
              <button class="game-button game-button-coral" id="undoTextFilter">UNDO</button>
              <button class="game-button game-button-small" id="downloadFilteredText">DOWNLOAD .TXT</button>
            </div>
          </div>
        </section>
      </div>`;
  }

  function initTextFilters(root, api) {
    const input = root.querySelector("#textFilterInput");
    const output = root.querySelector("#textFilterOutput");
    const label = root.querySelector("#textFilterResultLabel");
    const inputStats = root.querySelector("#textInputStats");
    const outputStats = root.querySelector("#textOutputStats");
    const shift = root.querySelector("#textShift");
    const chaos = root.querySelector("#textChaos");
    const stackButton = root.querySelector("#textStackMode");
    const undoButton = root.querySelector("#undoTextFilter");
    let active = filters[0];
    let stackMode = false;
    let history = [];

    const stats = (text) => ({ words: words(text).length, chars: [...text].length, lines: text ? text.split(/\r?\n/).length : 0 });

    function apply(pushHistory = false) {
      const source = stackMode && output.value ? output.value : input.value;
      if (pushHistory) history.push(output.value);
      try {
        output.value = active.apply(source, { shift: Number(shift.value), chaos: Number(chaos.value) });
        label.textContent = active.label;
      } catch (caught) {
        output.value = `Could not apply this filter: ${caught.message}`;
      }
      const sourceStats = stats(input.value);
      const resultStats = stats(output.value);
      inputStats.textContent = `${sourceStats.words} WORDS · ${sourceStats.lines} LINES`;
      outputStats.textContent = `${resultStats.chars} CHARS`;
      undoButton.disabled = history.length === 0;
    }

    root.querySelectorAll("[data-filter-category]").forEach((button) => button.addEventListener("click", () => {
      root.querySelectorAll("[data-filter-category]").forEach((tab) => {
        const selected = tab === button;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
      root.querySelectorAll("[data-filter-group]").forEach((filterButton) => { filterButton.hidden = filterButton.dataset.filterGroup !== button.dataset.filterCategory; });
    }));
    root.querySelectorAll("[data-text-filter]").forEach((button) => button.addEventListener("click", () => {
      active = filters.find((filter) => filter.id === button.dataset.textFilter);
      root.querySelectorAll("[data-text-filter]").forEach((entry) => entry.classList.toggle("active", entry === button));
      apply(true);
    }));
    input.addEventListener("input", () => apply(false));
    [shift, chaos].forEach((range) => range.addEventListener("input", () => {
      root.querySelector("#textShiftValue").textContent = shift.value;
      root.querySelector("#textChaosValue").textContent = chaos.value;
      apply(false);
    }));
    stackButton.addEventListener("click", () => {
      stackMode = !stackMode;
      stackButton.classList.toggle("active", stackMode);
      stackButton.setAttribute("aria-pressed", String(stackMode));
      stackButton.textContent = `STACK MODE: ${stackMode ? "ON" : "OFF"}`;
    });
    root.querySelector("#copyFilteredText").addEventListener("click", () => api.copyGameText(output.value, "Filtered text copied!"));
    root.querySelector("#useFilteredText").addEventListener("click", () => { input.value = output.value; history = []; apply(false); api.showToast("Output moved to input!"); });
    undoButton.addEventListener("click", () => { if (!history.length) return; output.value = history.pop(); outputStats.textContent = `${[...output.value].length} CHARS`; undoButton.disabled = history.length === 0; });
    root.querySelector("#downloadFilteredText").addEventListener("click", () => {
      const url = URL.createObjectURL(new Blob([output.value], { type: "text/plain" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "crazy-filtered-text.txt";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    root.querySelector('[data-text-filter="upper"]').classList.add("active");
    apply(false);
  }

  window.TextFilesTools = { ...window.TextFilesTools, renderTextFilters, initTextFilters };
})();
