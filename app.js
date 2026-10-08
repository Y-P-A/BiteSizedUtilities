(() => {
  "use strict";

  const homeScreen = document.querySelector("#homeScreen");
  const homeWall = document.querySelector("#homeWall");
  const homeMascot = document.querySelector("#homeMascot");
  const homeMascotSpeech = document.querySelector("#homeMascotSpeech");
  const mathHomeCupboard = document.querySelector("#mathHomeCupboard");
  const codingHomeCupboard = document.querySelector("#codingHomeCupboard");
  const openMathCupboard = document.querySelector("#openMathCupboard");
  const openCodingCupboard = document.querySelector("#openCodingCupboard");
  const backHomeButton = document.querySelector("#backHome");
  const backHomeCodingButton = document.querySelector("#backHomeCoding");
  const gameWorld = document.querySelector("#gameWorld");
  const codingWorld = document.querySelector("#codingWorld");
  const waffleBackdrop = document.querySelector("#waffleBackdrop");
  const codingWaffleBackdrop = document.querySelector("#codingWaffleBackdrop");
  const waffleMascot = document.querySelector("#waffleMascot");
  const codingMascot = document.querySelector("#codingMascot");
  const mascotSpeech = document.querySelector("#mascotSpeech");
  const codingMascotSpeech = document.querySelector("#codingMascotSpeech");
  const toolOverlay = document.querySelector("#toolOverlay");
  const toolBody = document.querySelector("#toolBody");
  const toolTitle = document.querySelector("#toolTitle");
  const toolCategory = document.querySelector("#toolCategory");
  const toolHeadingIcon = document.querySelector("#toolHeadingIcon");
  const closeToolButton = document.querySelector("#closeTool");
  const overlayCurtain = document.querySelector("#overlayCurtain");
  const toast = document.querySelector("#toast");
  const confettiField = document.querySelector("#confettiField");

  let activeCleanup = [];
  let activeCategoryKey = null;
  let activeToolToken = 0;
  let lastFocusedElement = null;
  let toastTimer = null;
  let drawerClearTimer = null;
  let screenTimer = null;

  const iconMarkup = (name) => `<svg aria-hidden="true"><use href="#icon-${name}"></use></svg>`;

  const tools = {
    calculator: {
      title: "Calculator",
      icon: "calculator",
      color: "#e9947f",
      render: renderCalculator,
      init: initCalculator,
    },
    graph: {
      title: "Graphing Calculator",
      icon: "graph",
      color: "#9ccbc4",
      render: renderGraphingCalculator,
      init: initGraphingCalculator,
    },
    body: {
      title: "Bodily Calculator",
      icon: "body",
      color: "#abc89c",
      render: renderBodyCalculator,
      init: initBodyCalculator,
    },
    fraction: {
      title: "Fraction Calculator",
      icon: "fraction",
      color: "#c4add0",
      render: renderFractionCalculator,
      init: initFractionCalculator,
    },
    percentage: {
      title: "Percentage Calculator",
      icon: "percent",
      color: "#f2c86f",
      render: renderPercentageCalculator,
      init: initPercentageCalculator,
    },
    dice: {
      title: "Dice Roller",
      icon: "dice",
      color: "#9ccbc4",
      render: renderDiceRoller,
      init: initDiceRoller,
    },
    roman: {
      title: "Roman Numeral Calculator",
      icon: "roman",
      color: "#efd39b",
      render: renderRomanCalculator,
      init: initRomanCalculator,
    },
    base: {
      title: "Number Base Converter",
      icon: "base",
      color: "#e9947f",
      render: renderBaseConverter,
      init: initBaseConverter,
    },
    prime: {
      title: "Prime Number Checker",
      icon: "prime",
      color: "#f2c86f",
      render: renderPrimeChecker,
      init: initPrimeChecker,
    },
    sequence: {
      title: "Sequence Playground",
      icon: "sequence",
      color: "#abc89c",
      render: renderSequencePlayground,
      init: initSequencePlayground,
    },
    codehub: {
      title: "CodeHub",
      category: "Coding & Developing",
      categoryKey: "coding",
      icon: "codehub",
      color: "#92c8c1",
      render: renderCodeHub,
      init: initCodeHub,
    },
  };

  const categories = {
    math: {
      homeCupboard: mathHomeCupboard,
      door: openMathCupboard,
      screen: gameWorld,
      mascot: waffleMascot,
      speech: mascotSpeech,
      title: "Math & Numbers — Bite Sized Utilities",
      opening: "Opening Math & Numbers!",
      ready: "Pick a tool!",
    },
    coding: {
      homeCupboard: codingHomeCupboard,
      door: openCodingCupboard,
      screen: codingWorld,
      mascot: codingMascot,
      speech: codingMascotSpeech,
      title: "Coding & Developing — Bite Sized Utilities",
      opening: "Opening Coding & Developing!",
      ready: "CodeHub is ready!",
    },
  };

  function addCleanup(callback) {
    activeCleanup.push(callback);
  }

  function cleanActiveTool() {
    activeCleanup.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.warn("Tool cleanup skipped", error);
      }
    });
    activeCleanup = [];
  }

  function openTool(toolKey, trigger) {
    const tool = tools[toolKey];
    if (!tool) return;

    window.clearTimeout(drawerClearTimer);
    cleanActiveTool();
    const toolToken = ++activeToolToken;
    lastFocusedElement = trigger || document.activeElement;
    activeCategoryKey = tool.categoryKey || "math";
    toolTitle.textContent = tool.title;
    toolCategory.textContent = tool.category || "Math & Numbers";
    toolHeadingIcon.innerHTML = iconMarkup(tool.icon);
    toolHeadingIcon.style.backgroundColor = tool.color;
    toolBody.innerHTML = tool.render();
    toolBody.scrollTop = 0;
    toolOverlay.classList.toggle("codehub-open", toolKey === "codehub");

    toolOverlay.classList.add("open");
    toolOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
    const category = categories[activeCategoryKey];
    if (category) category.speech.textContent = toolKey === "codehub" ? "Let's make something!" : "Math snack time!";

    requestAnimationFrame(() => {
      if (toolToken !== activeToolToken || !toolOverlay.classList.contains("open")) return;
      tool.init(toolBody);
      closeToolButton.focus({ preventScroll: true });
    });
  }

  function closeTool() {
    if (!toolOverlay.classList.contains("open")) return;
    activeToolToken += 1;
    cleanActiveTool();
    toolOverlay.classList.remove("open");
    toolOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
    const category = categories[activeCategoryKey];
    if (category) category.speech.textContent = category.ready;
    drawerClearTimer = window.setTimeout(() => {
      toolBody.innerHTML = "";
      toolOverlay.classList.remove("codehub-open");
    }, 500);
    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus({ preventScroll: true });
    }
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1900);
  }

  function bounceCategoryMascot(categoryKey, message) {
    const category = categories[categoryKey];
    if (!category) return;
    if (message) category.speech.textContent = message;
    category.mascot.classList.remove("bouncing");
    void category.mascot.offsetWidth;
    category.mascot.classList.add("bouncing");
    window.setTimeout(() => category.mascot.classList.remove("bouncing"), 620);
  }

  function bounceHomeMascot(message) {
    if (message) homeMascotSpeech.textContent = message;
    homeMascot.classList.remove("bouncing");
    void homeMascot.offsetWidth;
    homeMascot.classList.add("bouncing");
    window.setTimeout(() => homeMascot.classList.remove("bouncing"), 620);
  }

  function bounceWall() {
    document.body.classList.remove("waffle-wall-bounce");
    void document.body.offsetWidth;
    document.body.classList.add("waffle-wall-bounce");
    window.setTimeout(() => document.body.classList.remove("waffle-wall-bounce"), 560);
  }

  function enterCategory(categoryKey) {
    const category = categories[categoryKey];
    if (!category || category.homeCupboard.classList.contains("open")) return;
    window.clearTimeout(screenTimer);
    category.homeCupboard.classList.add("open");
    category.door.setAttribute("aria-expanded", "true");
    bounceHomeMascot(category.opening);

    screenTimer = window.setTimeout(() => {
      homeScreen.classList.add("screen-leaving");
      screenTimer = window.setTimeout(() => {
        homeScreen.hidden = true;
        homeScreen.classList.remove("screen-leaving");
        homeScreen.setAttribute("aria-hidden", "true");
        category.screen.hidden = false;
        category.screen.setAttribute("aria-hidden", "false");
        category.screen.classList.remove("screen-leaving");
        category.screen.classList.add("screen-arriving");
        activeCategoryKey = categoryKey;
        document.title = category.title;
        window.scrollTo({ top: 0, behavior: "auto" });
        window.setTimeout(() => category.screen.classList.remove("screen-arriving"), 520);
      }, 255);
    }, 680);
  }

  function returnHome() {
    const category = Object.values(categories).find((item) => !item.screen.hidden);
    if (!category) return;
    window.clearTimeout(screenTimer);
    closeTool();
    category.screen.classList.add("screen-leaving");
    screenTimer = window.setTimeout(() => {
      category.screen.hidden = true;
      category.screen.classList.remove("screen-leaving");
      category.screen.setAttribute("aria-hidden", "true");
      Object.values(categories).forEach((item) => {
        item.homeCupboard.classList.remove("open");
        item.door.setAttribute("aria-expanded", "false");
      });
      homeMascotSpeech.textContent = "Two cupboards are ready!";
      homeScreen.hidden = false;
      homeScreen.setAttribute("aria-hidden", "false");
      homeScreen.classList.remove("screen-leaving");
      document.title = "Bite Sized Utilities";
      activeCategoryKey = null;
      window.scrollTo({ top: 0, behavior: "auto" });
      requestAnimationFrame(() => category.door.focus({ preventScroll: true }));
    }, 255);
  }

  homeWall.addEventListener("click", () => {
    bounceWall();
    bounceHomeMascot("Boing! Choose a cupboard!");
  });
  homeMascot.addEventListener("click", () => {
    bounceWall();
    bounceHomeMascot("Math or code? Pick a cupboard!");
  });
  homeMascot.addEventListener("animationend", () => homeMascot.classList.remove("bouncing"));
  openMathCupboard.addEventListener("click", () => enterCategory("math"));
  openCodingCupboard.addEventListener("click", () => enterCategory("coding"));
  backHomeButton.addEventListener("click", returnHome);
  backHomeCodingButton.addEventListener("click", returnHome);

  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => openTool(button.dataset.tool, button));
  });

  waffleBackdrop.addEventListener("click", () => {
    bounceWall();
    bounceCategoryMascot("math", "Boing!");
  });
  codingWaffleBackdrop.addEventListener("click", () => {
    bounceWall();
    bounceCategoryMascot("coding", "Boing!");
  });
  waffleMascot.addEventListener("click", () => {
    bounceWall();
    bounceCategoryMascot("math", "Ready to crunch numbers!");
  });
  codingMascot.addEventListener("click", () => {
    bounceWall();
    bounceCategoryMascot("coding", "Ready to run code!");
  });
  waffleMascot.addEventListener("animationend", () => waffleMascot.classList.remove("bouncing"));
  codingMascot.addEventListener("animationend", () => codingMascot.classList.remove("bouncing"));
  closeToolButton.addEventListener("click", closeTool);
  overlayCurtain.addEventListener("click", closeTool);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (toolOverlay.classList.contains("open")) {
        closeTool();
      } else if (Object.values(categories).some((category) => !category.screen.hidden)) {
        returnHome();
      }
    }
  });

  /* Calculator */
  function renderCalculator() {
    const keys = [
      ["clear", "C", "action"],
      ["sign", "±", "action"],
      ["percent", "%", "action"],
      ["divide", "÷", "operator"],
      ["7", "7", ""],
      ["8", "8", ""],
      ["9", "9", ""],
      ["multiply", "×", "operator"],
      ["4", "4", ""],
      ["5", "5", ""],
      ["6", "6", ""],
      ["subtract", "−", "operator"],
      ["1", "1", ""],
      ["2", "2", ""],
      ["3", "3", ""],
      ["add", "+", "operator"],
      ["0", "0", "zero"],
      ["decimal", ".", ""],
      ["equals", "=", "equals"],
    ];

    return `
      <div class="tool-layout">
        <div class="calculator-shell" aria-label="Calculator keypad">
          <div class="calc-display" aria-live="polite">
            <span class="calc-expression" id="calcExpression">Ready</span>
            <output class="calc-value" id="calcValue">0</output>
          </div>
          <div class="calc-keypad">
            ${keys
              .map(
                ([key, label, type]) => `
                  <button class="calc-key ${type ? `calc-key-${type}` : ""}" data-calc-key="${key}">${label}</button>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  function initCalculator(root) {
    const display = root.querySelector("#calcValue");
    const expression = root.querySelector("#calcExpression");
    let current = "0";
    let stored = null;
    let operator = null;
    let waitingForOperand = false;

    const symbols = {
      add: "+",
      subtract: "−",
      multiply: "×",
      divide: "÷",
    };

    function formatNumber(value) {
      if (!Number.isFinite(value)) return "Error";
      const rounded = Number.parseFloat(value.toPrecision(12));
      const plain = String(rounded);
      return plain.length > 14 ? rounded.toExponential(7) : plain;
    }

    function calculate(a, b, operation) {
      if (operation === "add") return a + b;
      if (operation === "subtract") return a - b;
      if (operation === "multiply") return a * b;
      if (operation === "divide") return b === 0 ? Number.NaN : a / b;
      return b;
    }

    function updateDisplay() {
      display.textContent = current;
    }

    function clear() {
      current = "0";
      stored = null;
      operator = null;
      waitingForOperand = false;
      expression.textContent = "Ready";
      updateDisplay();
    }

    function inputDigit(digit) {
      if (current === "Error" || waitingForOperand) {
        current = digit;
        waitingForOperand = false;
      } else if (current === "0") {
        current = digit;
      } else if (current.replace(/[.-]/g, "").length < 12) {
        current += digit;
      }
      updateDisplay();
    }

    function inputDecimal() {
      if (current === "Error" || waitingForOperand) {
        current = "0.";
        waitingForOperand = false;
      } else if (!current.includes(".")) {
        current += ".";
      }
      updateDisplay();
    }

    function chooseOperator(nextOperator) {
      const value = Number(current);
      if (!Number.isFinite(value)) {
        clear();
        return;
      }
      if (operator && stored !== null && !waitingForOperand) {
        const result = calculate(stored, value, operator);
        current = formatNumber(result);
        stored = Number(current);
        if (current === "Error") {
          expression.textContent = "Try a different calculation";
          updateDisplay();
          return;
        }
      } else {
        stored = value;
      }
      operator = nextOperator;
      waitingForOperand = true;
      expression.textContent = `${current} ${symbols[nextOperator]}`;
      updateDisplay();
    }

    function equals() {
      if (!operator || stored === null || current === "Error") return;
      const second = Number(current);
      const first = stored;
      const result = calculate(first, second, operator);
      expression.textContent = `${formatNumber(first)} ${symbols[operator]} ${formatNumber(second)} =`;
      current = formatNumber(result);
      stored = null;
      operator = null;
      waitingForOperand = true;
      if (current === "Error") expression.textContent = "Division by zero needs a rethink";
      updateDisplay();
    }

    function handleKey(key) {
      if (/^\d$/.test(key)) inputDigit(key);
      else if (key === "decimal") inputDecimal();
      else if (["add", "subtract", "multiply", "divide"].includes(key)) chooseOperator(key);
      else if (key === "equals") equals();
      else if (key === "clear") clear();
      else if (key === "sign" && current !== "0" && current !== "Error") {
        current = current.startsWith("-") ? current.slice(1) : `-${current}`;
        updateDisplay();
      } else if (key === "percent" && current !== "Error") {
        current = formatNumber(Number(current) / 100);
        updateDisplay();
      }
    }

    root.querySelectorAll("[data-calc-key]").forEach((button) => {
      button.addEventListener("click", () => handleKey(button.dataset.calcKey));
    });

    const keyMap = {
      "+": "add",
      "-": "subtract",
      "*": "multiply",
      "/": "divide",
      Enter: "equals",
      "=": "equals",
      ".": "decimal",
      "%": "percent",
      Backspace: "backspace",
      Delete: "clear",
    };

    const keyboardHandler = (event) => {
      if (!toolOverlay.classList.contains("open") || toolTitle.textContent !== "Calculator") return;
      const mapped = /^\d$/.test(event.key) ? event.key : keyMap[event.key];
      if (!mapped) return;
      event.preventDefault();
      if (mapped === "backspace") {
        current = current.length > 1 ? current.slice(0, -1) : "0";
        updateDisplay();
      } else {
        handleKey(mapped);
      }
      const pressed = root.querySelector(`[data-calc-key="${mapped}"]`);
      if (pressed) {
        pressed.classList.add("pressed");
        window.setTimeout(() => pressed.classList.remove("pressed"), 100);
      }
    };
    document.addEventListener("keydown", keyboardHandler);
    addCleanup(() => document.removeEventListener("keydown", keyboardHandler));
  }

  /* Graphing calculator */
  function renderGraphingCalculator() {
    return `
      <div class="tool-layout">
        <div class="game-panel panel-teal graph-controls">
          <div class="segmented" role="tablist" aria-label="Graphing views">
            <button class="tab-button active" data-graph-view="graph" role="tab" aria-selected="true">Graph</button>
            <button class="tab-button" data-graph-view="table" role="tab" aria-selected="false">Table</button>
          </div>
          <div class="graph-input-row">
            <strong class="graph-y-label">y =</strong>
            <div class="field-stack">
              <label for="graphExpression">Equation</label>
              <input class="chunky-input" id="graphExpression" value="sin(x)" autocomplete="off" spellcheck="false" />
            </div>
            <button class="game-button game-button-coral" id="drawGraph">DRAW</button>
          </div>
          <div class="button-row" aria-label="Equation presets">
            <button class="game-button game-button-small" data-equation="sin(x)">sin(x)</button>
            <button class="game-button game-button-small" data-equation="x^2/4">x² ÷ 4</button>
            <button class="game-button game-button-small" data-equation="sqrt(abs(x))*2">√|x| × 2</button>
          </div>
          <p class="graph-error" id="graphError" role="status"></p>
          <div class="graph-toolbar">
            <span class="panel-note">Use + − * / ^ and sin, cos, tan, abs, sqrt, log.</span>
            <div class="zoom-control" aria-label="Graph zoom">
              <button class="zoom-button" id="zoomOut" aria-label="Zoom out">−</button>
              <span id="zoomLabel">±10</span>
              <button class="zoom-button" id="zoomIn" aria-label="Zoom in">+</button>
            </div>
          </div>
        </div>
        <div id="graphView">
          <div class="graph-board"><canvas id="graphCanvas" aria-label="Plot of y equals sin x"></canvas></div>
        </div>
        <div id="tableView" hidden>
          <div class="graph-table-wrap">
            <table class="graph-table">
              <thead><tr><th>x</th><th>y</th></tr></thead>
              <tbody id="graphTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function compileMathExpression(source) {
    const tokens = [];
    const text = source.toLowerCase();
    let cursor = 0;

    while (cursor < text.length) {
      const rest = text.slice(cursor);
      const whitespace = rest.match(/^\s+/);
      if (whitespace) {
        cursor += whitespace[0].length;
        continue;
      }
      const number = rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
      if (number) {
        tokens.push({ type: "number", value: Number(number[0]) });
        cursor += number[0].length;
        continue;
      }
      const word = rest.match(/^[a-z]+/);
      if (word) {
        tokens.push({ type: "word", value: word[0] });
        cursor += word[0].length;
        continue;
      }
      const character = rest[0];
      if ("+-*/^()".includes(character)) {
        tokens.push({ type: character, value: character });
        cursor += 1;
        continue;
      }
      throw new Error(`I don't recognize “${character}” yet.`);
    }

    let position = 0;
    const peek = () => tokens[position];
    const take = (type) => {
      const token = tokens[position];
      if (!token || token.type !== type) throw new Error("That equation needs one more piece.");
      position += 1;
      return token;
    };

    function parseExpression() {
      let left = parseTerm();
      while (peek() && (peek().type === "+" || peek().type === "-")) {
        const operation = tokens[position++].type;
        const right = parseTerm();
        const previous = left;
        left = operation === "+" ? (x) => previous(x) + right(x) : (x) => previous(x) - right(x);
      }
      return left;
    }

    function parseTerm() {
      let left = parsePower();
      while (peek() && (peek().type === "*" || peek().type === "/")) {
        const operation = tokens[position++].type;
        const right = parsePower();
        const previous = left;
        left = operation === "*" ? (x) => previous(x) * right(x) : (x) => previous(x) / right(x);
      }
      return left;
    }

    function parsePower() {
      let left = parseUnary();
      if (peek() && peek().type === "^") {
        position += 1;
        const right = parsePower();
        const previous = left;
        left = (x) => Math.pow(previous(x), right(x));
      }
      return left;
    }

    function parseUnary() {
      if (peek() && peek().type === "+") {
        position += 1;
        return parseUnary();
      }
      if (peek() && peek().type === "-") {
        position += 1;
        const value = parseUnary();
        return (x) => -value(x);
      }
      return parsePrimary();
    }

    function parsePrimary() {
      const token = peek();
      if (!token) throw new Error("That equation ends a little too soon.");
      if (token.type === "number") {
        position += 1;
        return () => token.value;
      }
      if (token.type === "(") {
        position += 1;
        const inside = parseExpression();
        take(")");
        return inside;
      }
      if (token.type === "word") {
        position += 1;
        if (token.value === "x") return (x) => x;
        if (token.value === "pi") return () => Math.PI;
        if (token.value === "e") return () => Math.E;
        const functions = {
          sin: Math.sin,
          cos: Math.cos,
          tan: Math.tan,
          abs: Math.abs,
          sqrt: Math.sqrt,
          log: Math.log,
          exp: Math.exp,
        };
        const fn = functions[token.value];
        if (!fn) throw new Error(`“${token.value}” isn't in this graphing cupboard.`);
        take("(");
        const argument = parseExpression();
        take(")");
        return (x) => fn(argument(x));
      }
      throw new Error("Try adding a number or x right there.");
    }

    if (!tokens.length) throw new Error("Pop an equation into the box first.");
    const evaluator = parseExpression();
    if (position !== tokens.length) throw new Error("Check the order of that equation.");
    return evaluator;
  }

  function initGraphingCalculator(root) {
    const canvas = root.querySelector("#graphCanvas");
    const graphExpression = root.querySelector("#graphExpression");
    const graphError = root.querySelector("#graphError");
    const graphView = root.querySelector("#graphView");
    const tableView = root.querySelector("#tableView");
    const tableBody = root.querySelector("#graphTableBody");
    const zoomLabel = root.querySelector("#zoomLabel");
    let range = 10;
    let evaluator = compileMathExpression("sin(x)");

    function evaluate(value) {
      try {
        return evaluator(value);
      } catch {
        return Number.NaN;
      }
    }

    function niceStep() {
      if (range <= 5) return 1;
      if (range <= 12) return 2;
      if (range <= 25) return 5;
      return 10;
    }

    function draw() {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      const context = canvas.getContext("2d");
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const width = bounds.width;
      const height = bounds.height;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#fff3d7";
      context.fillRect(0, 0, width, height);

      const xToPixel = (x) => ((x + range) / (range * 2)) * width;
      const yToPixel = (y) => ((range - y) / (range * 2)) * height;
      const step = niceStep();

      context.lineWidth = 1.5;
      context.strokeStyle = "#d8b98c";
      for (let grid = -range; grid <= range + 0.001; grid += step) {
        context.beginPath();
        context.moveTo(xToPixel(grid), 0);
        context.lineTo(xToPixel(grid), height);
        context.stroke();
        context.beginPath();
        context.moveTo(0, yToPixel(grid));
        context.lineTo(width, yToPixel(grid));
        context.stroke();
      }

      context.lineWidth = 3;
      context.strokeStyle = "#60402e";
      context.beginPath();
      context.moveTo(xToPixel(0), 0);
      context.lineTo(xToPixel(0), height);
      context.moveTo(0, yToPixel(0));
      context.lineTo(width, yToPixel(0));
      context.stroke();

      context.fillStyle = "#76513c";
      context.font = "800 12px Trebuchet MS";
      context.fillText(String(range), width - 28, Math.min(height - 8, yToPixel(0) - 7));
      context.fillText(String(-range), 6, Math.min(height - 8, yToPixel(0) - 7));

      context.lineWidth = 5;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "#c4564c";
      context.beginPath();
      let drawing = false;
      let lastY = null;
      for (let pixel = 0; pixel <= width; pixel += 1.5) {
        const x = (pixel / width) * range * 2 - range;
        const y = evaluate(x);
        const py = yToPixel(y);
        const valid = Number.isFinite(y) && py > -height * 2 && py < height * 3;
        const jumps = lastY !== null && Math.abs(py - lastY) > height * 0.72;
        if (!valid || jumps) {
          drawing = false;
          lastY = valid ? py : null;
          continue;
        }
        if (!drawing) {
          context.moveTo(pixel, py);
          drawing = true;
        } else {
          context.lineTo(pixel, py);
        }
        lastY = py;
      }
      context.stroke();
      updateTable();
    }

    function updateTable() {
      tableBody.innerHTML = "";
      [-3, -2, -1, 0, 1, 2, 3].forEach((x) => {
        const y = evaluate(x);
        const row = document.createElement("tr");
        const xCell = document.createElement("td");
        const yCell = document.createElement("td");
        xCell.textContent = String(x);
        yCell.textContent = Number.isFinite(y) ? String(Number(y.toFixed(5))) : "—";
        row.append(xCell, yCell);
        tableBody.append(row);
      });
    }

    function useExpression(value) {
      try {
        evaluator = compileMathExpression(value);
        graphError.textContent = "";
        canvas.setAttribute("aria-label", `Plot of y equals ${value}`);
        draw();
      } catch (error) {
        graphError.textContent = error.message;
      }
    }

    root.querySelector("#drawGraph").addEventListener("click", () => useExpression(graphExpression.value));
    graphExpression.addEventListener("keydown", (event) => {
      if (event.key === "Enter") useExpression(graphExpression.value);
    });
    root.querySelectorAll("[data-equation]").forEach((button) => {
      button.addEventListener("click", () => {
        graphExpression.value = button.dataset.equation;
        useExpression(button.dataset.equation);
      });
    });
    root.querySelector("#zoomIn").addEventListener("click", () => {
      range = Math.max(3, Math.round(range * 0.7));
      zoomLabel.textContent = `±${range}`;
      draw();
    });
    root.querySelector("#zoomOut").addEventListener("click", () => {
      range = Math.min(50, Math.round(range * 1.45));
      zoomLabel.textContent = `±${range}`;
      draw();
    });
    root.querySelectorAll("[data-graph-view]").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelectorAll("[data-graph-view]").forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        const showingGraph = button.dataset.graphView === "graph";
        graphView.hidden = !showingGraph;
        tableView.hidden = showingGraph;
        if (showingGraph) requestAnimationFrame(draw);
      });
    });

    const observer = new ResizeObserver(() => {
      if (!graphView.hidden) draw();
    });
    observer.observe(canvas);
    addCleanup(() => observer.disconnect());
    requestAnimationFrame(draw);
  }

  /* Bodily calculator */
  function renderBodyCalculator() {
    return `
      <div class="tool-layout">
        <div class="game-panel panel-sage">
          <div class="segmented" role="tablist" aria-label="Body calculation">
            <button class="tab-button active" data-body-mode="bmi" aria-selected="true">BMI</button>
            <button class="tab-button" data-body-mode="bmr" aria-selected="false">Daily Energy</button>
          </div>
        </div>
        <div class="body-board">
          <div class="game-panel panel-sage body-sliders">
            <div class="slider-row">
              <div class="slider-heading"><label for="heightRange">Height</label><output class="slider-bubble" id="heightValue">170 cm</output></div>
              <input class="game-range" id="heightRange" type="range" min="120" max="220" value="170" />
            </div>
            <div class="slider-row">
              <div class="slider-heading"><label for="weightRange">Weight</label><output class="slider-bubble" id="weightValue">70 kg</output></div>
              <input class="game-range" id="weightRange" type="range" min="35" max="180" value="70" />
            </div>
            <div class="slider-row" id="ageRow" hidden>
              <div class="slider-heading"><label for="ageRange">Age</label><output class="slider-bubble" id="ageValue">30 years</output></div>
              <input class="game-range" id="ageRange" type="range" min="12" max="90" value="30" />
            </div>
            <div id="bodyProfile" hidden>
              <span class="field-title">Profile</span>
              <div class="segmented">
                <button class="tab-button active" data-profile="female" aria-selected="true">Female</button>
                <button class="tab-button" data-profile="male" aria-selected="false">Male</button>
              </div>
            </div>
          </div>
          <div class="result-card body-result" id="bodyResult" aria-live="polite">
            <span class="result-kicker" id="bodyResultLabel">Body mass index</span>
            <strong class="result-big" id="bodyResultValue">24.2</strong>
            <span class="result-detail" id="bodyResultDetail">In the common healthy range</span>
            <div class="bmi-scale" id="bmiScale" aria-hidden="true">
              <span class="bmi-segment"></span><span class="bmi-segment active"></span><span class="bmi-segment"></span><span class="bmi-segment"></span>
            </div>
          </div>
        </div>
        <p class="panel-note">Friendly estimates only — bodies are wonderfully individual.</p>
      </div>
    `;
  }

  function initBodyCalculator(root) {
    const height = root.querySelector("#heightRange");
    const weight = root.querySelector("#weightRange");
    const age = root.querySelector("#ageRange");
    const ageRow = root.querySelector("#ageRow");
    const profile = root.querySelector("#bodyProfile");
    const resultLabel = root.querySelector("#bodyResultLabel");
    const resultValue = root.querySelector("#bodyResultValue");
    const resultDetail = root.querySelector("#bodyResultDetail");
    const bmiScale = root.querySelector("#bmiScale");
    let mode = "bmi";
    let sex = "female";

    function update() {
      const h = Number(height.value);
      const w = Number(weight.value);
      const years = Number(age.value);
      root.querySelector("#heightValue").textContent = `${h} cm`;
      root.querySelector("#weightValue").textContent = `${w} kg`;
      root.querySelector("#ageValue").textContent = `${years} years`;

      if (mode === "bmi") {
        const bmi = w / Math.pow(h / 100, 2);
        const groups = [
          { max: 18.5, text: "Below the common healthy range", index: 0 },
          { max: 25, text: "In the common healthy range", index: 1 },
          { max: 30, text: "Above the common healthy range", index: 2 },
          { max: Infinity, text: "Well above the common healthy range", index: 3 },
        ];
        const group = groups.find((item) => bmi < item.max);
        resultLabel.textContent = "Body mass index";
        resultValue.textContent = bmi.toFixed(1);
        resultDetail.textContent = group.text;
        bmiScale.hidden = false;
        bmiScale.querySelectorAll(".bmi-segment").forEach((segment, index) => segment.classList.toggle("active", index === group.index));
      } else {
        const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * years + 5 : 10 * w + 6.25 * h - 5 * years - 161;
        resultLabel.textContent = "Estimated daily resting energy";
        resultValue.textContent = `${Math.max(0, Math.round(bmr)).toLocaleString()}`;
        resultDetail.textContent = "kilocalories per day at rest";
        bmiScale.hidden = true;
      }
    }

    [height, weight, age].forEach((slider) => slider.addEventListener("input", update));
    root.querySelectorAll("[data-body-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        mode = button.dataset.bodyMode;
        root.querySelectorAll("[data-body-mode]").forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        const bmrMode = mode === "bmr";
        ageRow.hidden = !bmrMode;
        profile.hidden = !bmrMode;
        update();
      });
    });
    root.querySelectorAll("[data-profile]").forEach((button) => {
      button.addEventListener("click", () => {
        sex = button.dataset.profile;
        root.querySelectorAll("[data-profile]").forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        update();
      });
    });
    update();
  }

  /* Fraction calculator */
  function renderFractionCalculator() {
    return `
      <div class="tool-layout fraction-workbench">
        <div class="game-panel panel-lilac">
          <div class="fraction-equation">
            <div class="fraction-stack">
              <label class="control-label" for="fractionANum">Fraction A</label>
              <input id="fractionANum" type="number" value="3" aria-label="First numerator" />
              <span class="fraction-line"></span>
              <input id="fractionADen" type="number" value="4" aria-label="First denominator" />
            </div>
            <span class="fraction-op" id="fractionOperator" aria-hidden="true">+</span>
            <div class="fraction-stack">
              <label class="control-label" for="fractionBNum">Fraction B</label>
              <input id="fractionBNum" type="number" value="2" aria-label="Second numerator" />
              <span class="fraction-line"></span>
              <input id="fractionBDen" type="number" value="5" aria-label="Second denominator" />
            </div>
          </div>
          <div class="segmented fraction-ops" style="margin-top: 17px" aria-label="Fraction operation">
            <button class="tab-button active" data-fraction-op="add" aria-selected="true">+</button>
            <button class="tab-button" data-fraction-op="subtract" aria-selected="false">−</button>
            <button class="tab-button" data-fraction-op="multiply" aria-selected="false">×</button>
            <button class="tab-button" data-fraction-op="divide" aria-selected="false">÷</button>
          </div>
        </div>
        <div class="result-card" aria-live="polite">
          <span class="result-kicker">Simplified answer</span>
          <span class="fraction-result-stack" id="fractionResult">
            <strong id="fractionResultNum">23</strong><span class="fraction-line"></span><strong id="fractionResultDen">20</strong>
          </span>
          <span class="result-detail" id="fractionDecimal">1.15</span>
        </div>
      </div>
    `;
  }

  function initFractionCalculator(root) {
    const fields = ["fractionANum", "fractionADen", "fractionBNum", "fractionBDen"].map((id) => root.querySelector(`#${id}`));
    const resultNum = root.querySelector("#fractionResultNum");
    const resultDen = root.querySelector("#fractionResultDen");
    const decimal = root.querySelector("#fractionDecimal");
    const opBadge = root.querySelector("#fractionOperator");
    let operation = "add";
    const symbols = { add: "+", subtract: "−", multiply: "×", divide: "÷" };

    function gcd(a, b) {
      a = a < 0n ? -a : a;
      b = b < 0n ? -b : b;
      while (b !== 0n) [a, b] = [b, a % b];
      return a || 1n;
    }

    function update() {
      try {
        const [a, b, c, d] = fields.map((field) => BigInt(field.value || "0"));
        if (b === 0n || d === 0n) throw new Error("Denominators need to be different from zero.");
        let numerator;
        let denominator;
        if (operation === "add") [numerator, denominator] = [a * d + c * b, b * d];
        if (operation === "subtract") [numerator, denominator] = [a * d - c * b, b * d];
        if (operation === "multiply") [numerator, denominator] = [a * c, b * d];
        if (operation === "divide") {
          if (c === 0n) throw new Error("A fraction with zero on top cannot be a divisor.");
          [numerator, denominator] = [a * d, b * c];
        }
        if (denominator < 0n) {
          numerator = -numerator;
          denominator = -denominator;
        }
        const divisor = gcd(numerator, denominator);
        numerator /= divisor;
        denominator /= divisor;
        resultNum.textContent = numerator.toString();
        resultDen.textContent = denominator.toString();
        const approximate = Number(numerator) / Number(denominator);
        decimal.textContent = Number.isFinite(approximate) ? `Decimal: ${Number(approximate.toFixed(8))}` : "Exact fraction shown";
      } catch (error) {
        resultNum.textContent = "?";
        resultDen.textContent = "?";
        decimal.textContent = error.message || "Use whole numbers in every box.";
      }
    }

    fields.forEach((field) => field.addEventListener("input", update));
    root.querySelectorAll("[data-fraction-op]").forEach((button) => {
      button.addEventListener("click", () => {
        operation = button.dataset.fractionOp;
        opBadge.textContent = symbols[operation];
        root.querySelectorAll("[data-fraction-op]").forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        update();
      });
    });
    update();
  }

  /* Percentage calculator */
  function renderPercentageCalculator() {
    return `
      <div class="tool-layout">
        <div class="game-panel">
          <div class="percent-illustration">
            ${iconMarkup("percent")}
            <div>
              <h3>Pick a percentage recipe</h3>
              <p class="panel-note">Big discounts, small changes, and every percent in between.</p>
            </div>
          </div>
          <div class="segmented" style="margin-top: 15px" role="tablist">
            <button class="tab-button active" data-percent-mode="of" aria-selected="true">% of a number</button>
            <button class="tab-button" data-percent-mode="discount" aria-selected="false">Discount</button>
            <button class="tab-button" data-percent-mode="change" aria-selected="false">% change</button>
          </div>
        </div>
        <div class="game-panel panel-coral percent-fields" id="percentFields"></div>
        <div class="result-card" aria-live="polite">
          <span class="result-kicker" id="percentResultLabel">15% of 80</span>
          <strong class="result-big" id="percentResult">12</strong>
          <span class="result-detail" id="percentResultDetail">That is the percent-sized piece.</span>
        </div>
      </div>
    `;
  }

  function initPercentageCalculator(root) {
    const fieldsPanel = root.querySelector("#percentFields");
    const result = root.querySelector("#percentResult");
    const label = root.querySelector("#percentResultLabel");
    const detail = root.querySelector("#percentResultDetail");
    let mode = "of";

    const modeFields = {
      of: `
        <div class="field-stack"><label for="percentAmount">Percentage</label><input class="chunky-input" id="percentAmount" type="number" value="15" /></div>
        <div class="field-stack"><label for="percentWhole">Whole number</label><input class="chunky-input" id="percentWhole" type="number" value="80" /></div>
        <button class="game-button" id="percentCalculate">FIND THE PIECE</button>
      `,
      discount: `
        <div class="field-stack"><label for="percentPrice">Original price</label><input class="chunky-input" id="percentPrice" type="number" value="120" min="0" /></div>
        <div class="field-stack"><label for="percentDiscount">Discount percentage</label><input class="chunky-input" id="percentDiscount" type="number" value="25" /></div>
        <button class="game-button" id="percentCalculate">APPLY DISCOUNT</button>
      `,
      change: `
        <div class="field-stack"><label for="percentFrom">Starting number</label><input class="chunky-input" id="percentFrom" type="number" value="80" /></div>
        <div class="field-stack"><label for="percentTo">New number</label><input class="chunky-input" id="percentTo" type="number" value="100" /></div>
        <button class="game-button" id="percentCalculate">MEASURE CHANGE</button>
      `,
    };

    const tidy = (value) => (Number.isFinite(value) ? String(Number(value.toFixed(6))) : "—");

    function calculate() {
      if (mode === "of") {
        const percent = Number(root.querySelector("#percentAmount").value);
        const whole = Number(root.querySelector("#percentWhole").value);
        result.textContent = tidy((percent / 100) * whole);
        label.textContent = `${tidy(percent)}% of ${tidy(whole)}`;
        detail.textContent = "That is the percent-sized piece.";
      } else if (mode === "discount") {
        const price = Number(root.querySelector("#percentPrice").value);
        const percent = Number(root.querySelector("#percentDiscount").value);
        const saved = (price * percent) / 100;
        result.textContent = tidy(price - saved);
        label.textContent = "Price after discount";
        detail.textContent = `You save ${tidy(saved)} (${tidy(percent)}%).`;
      } else {
        const from = Number(root.querySelector("#percentFrom").value);
        const to = Number(root.querySelector("#percentTo").value);
        if (from === 0) {
          result.textContent = "—";
          label.textContent = "Starting at zero";
          detail.textContent = "Percent change needs a non-zero starting number.";
          return;
        }
        const change = ((to - from) / Math.abs(from)) * 100;
        result.textContent = `${tidy(Math.abs(change))}%`;
        label.textContent = change >= 0 ? "Percentage increase" : "Percentage decrease";
        detail.textContent = `From ${tidy(from)} to ${tidy(to)}.`;
      }
    }

    function drawFields() {
      fieldsPanel.innerHTML = modeFields[mode];
      fieldsPanel.querySelectorAll("input").forEach((input) => input.addEventListener("input", calculate));
      fieldsPanel.querySelector("#percentCalculate").addEventListener("click", calculate);
      calculate();
    }

    root.querySelectorAll("[data-percent-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        mode = button.dataset.percentMode;
        root.querySelectorAll("[data-percent-mode]").forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        drawFields();
      });
    });
    drawFields();
  }

  /* Dice roller */
  function renderDiceRoller() {
    return `
      <div class="tool-layout dice-layout">
        <div class="game-panel panel-coral dice-stage">
          <div>
            <div class="die-object" id="dieObject" aria-live="polite"><strong class="die-label" id="dieLabel">1</strong></div>
            <button class="game-button" id="rollDice" style="width: 100%; margin-top: 23px">ROLL THE DICE</button>
          </div>
        </div>
        <div class="game-panel panel-teal">
          <h3>Custom faces</h3>
          <div class="face-count-control">
            <button class="step-button" id="removeFace" aria-label="Remove a face">−</button>
            <strong class="face-count"><span id="faceCount">6</span> faces</strong>
            <button class="step-button" id="addFace" aria-label="Add a face">+</button>
          </div>
          <div class="dice-face-editor" id="diceFaceEditor"></div>
          <p class="panel-note">Give every face a number, word, name, or tiny decision.</p>
        </div>
      </div>
    `;
  }

  function initDiceRoller(root) {
    const editor = root.querySelector("#diceFaceEditor");
    const faceCount = root.querySelector("#faceCount");
    const die = root.querySelector("#dieObject");
    const dieLabel = root.querySelector("#dieLabel");
    const rollButton = root.querySelector("#rollDice");
    let faces = ["1", "2", "3", "4", "5", "6"];
    let rollTimer = null;

    function drawEditor() {
      editor.innerHTML = "";
      faces.forEach((face, index) => {
        const label = document.createElement("label");
        label.className = "face-field";
        const number = document.createElement("span");
        number.textContent = String(index + 1);
        const input = document.createElement("input");
        input.value = face;
        input.maxLength = 18;
        input.setAttribute("aria-label", `Face ${index + 1}`);
        input.addEventListener("input", () => {
          faces[index] = input.value || String(index + 1);
        });
        label.append(number, input);
        editor.append(label);
      });
      faceCount.textContent = String(faces.length);
    }

    function randomIndex(max) {
      if (window.crypto && window.crypto.getRandomValues) {
        const value = new Uint32Array(1);
        window.crypto.getRandomValues(value);
        return value[0] % max;
      }
      return Math.floor(Math.random() * max);
    }

    function roll() {
      window.clearTimeout(rollTimer);
      die.classList.remove("rolling");
      void die.offsetWidth;
      die.classList.add("rolling");
      rollButton.disabled = true;
      const flutter = window.setInterval(() => {
        dieLabel.textContent = faces[randomIndex(faces.length)] || "?";
      }, 70);
      rollTimer = window.setTimeout(() => {
        window.clearInterval(flutter);
        const chosen = faces[randomIndex(faces.length)] || "?";
        dieLabel.textContent = chosen;
        die.classList.remove("rolling");
        rollButton.disabled = false;
        showToast(`The dice picked ${chosen}!`);
      }, 640);
      addCleanup(() => window.clearInterval(flutter));
    }

    root.querySelector("#addFace").addEventListener("click", () => {
      if (faces.length >= 20) {
        showToast("Twenty chunky faces fit on this dice.");
        return;
      }
      faces.push(String(faces.length + 1));
      drawEditor();
    });
    root.querySelector("#removeFace").addEventListener("click", () => {
      if (faces.length <= 2) {
        showToast("A dice needs at least two faces.");
        return;
      }
      faces.pop();
      drawEditor();
    });
    rollButton.addEventListener("click", roll);
    addCleanup(() => window.clearTimeout(rollTimer));
    drawEditor();
  }

  /* Roman numeral calculator */
  function renderRomanCalculator() {
    return `
      <div class="tool-layout">
        <div class="roman-parchment">
          <div class="roman-inputs">
            <div class="field-stack"><label for="romanA">Whole number A</label><input class="chunky-input" id="romanA" type="number" min="1" max="3999999" value="12345" /></div>
            <span class="fraction-op" id="romanOpBadge">+</span>
            <div class="field-stack"><label for="romanB">Whole number B</label><input class="chunky-input" id="romanB" type="number" min="1" max="3999999" value="678" /></div>
          </div>
          <div class="segmented fraction-ops" style="margin-top: 16px" aria-label="Roman numeral operation">
            <button class="tab-button active" data-roman-op="add" aria-selected="true">+</button>
            <button class="tab-button" data-roman-op="subtract" aria-selected="false">−</button>
            <button class="tab-button" data-roman-op="multiply" aria-selected="false">×</button>
            <button class="tab-button" data-roman-op="divide" aria-selected="false">÷</button>
          </div>
          <div class="roman-display" aria-live="polite">
            <span class="result-kicker" id="romanDecimal">13,023</span>
            <strong class="roman-number" id="romanResult"></strong>
            <span class="result-detail" id="romanMessage">An overline multiplies a numeral by 1,000.</span>
          </div>
        </div>
      </div>
    `;
  }

  function romanUnder4000(number) {
    if (number === 0) return "";
    const values = [
      [1000, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"],
    ];
    let remaining = number;
    let result = "";
    values.forEach(([value, numeral]) => {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    });
    return result;
  }

  function romanMarkup(number) {
    if (number === 0) return "N";
    const thousands = Math.floor(number / 1000);
    const remainder = number % 1000;
    const high = thousands ? `<span class="vinculum">${romanUnder4000(thousands)}</span>` : "";
    return `${high}${romanUnder4000(remainder)}`;
  }

  function initRomanCalculator(root) {
    const inputA = root.querySelector("#romanA");
    const inputB = root.querySelector("#romanB");
    const result = root.querySelector("#romanResult");
    const decimal = root.querySelector("#romanDecimal");
    const message = root.querySelector("#romanMessage");
    const badge = root.querySelector("#romanOpBadge");
    let operation = "add";
    const symbols = { add: "+", subtract: "−", multiply: "×", divide: "÷" };

    function update() {
      const a = Number(inputA.value);
      const b = Number(inputB.value);
      if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) {
        result.textContent = "?";
        decimal.textContent = "Whole numbers only";
        message.textContent = "Use whole numbers from 1 to 3,999,999.";
        return;
      }
      let answer;
      if (operation === "add") answer = a + b;
      if (operation === "subtract") answer = a - b;
      if (operation === "multiply") answer = a * b;
      if (operation === "divide") {
        if (b === 0 || a % b !== 0) {
          result.textContent = "?";
          decimal.textContent = "No whole-number quotient";
          message.textContent = "Roman numerals in this parchment use whole results.";
          return;
        }
        answer = a / b;
      }
      if (!Number.isInteger(answer) || answer < 1 || answer > 3999999) {
        result.textContent = "?";
        decimal.textContent = "Outside the parchment";
        message.textContent = "The result must stay between 1 and 3,999,999.";
        return;
      }
      result.innerHTML = romanMarkup(answer);
      result.setAttribute("aria-label", `Roman numeral for ${answer}`);
      decimal.textContent = answer.toLocaleString();
      message.textContent = answer >= 4000 ? "The overlined part is multiplied by 1,000." : "Classic Roman numeral notation.";
    }

    [inputA, inputB].forEach((input) => input.addEventListener("input", update));
    root.querySelectorAll("[data-roman-op]").forEach((button) => {
      button.addEventListener("click", () => {
        operation = button.dataset.romanOp;
        badge.textContent = symbols[operation];
        root.querySelectorAll("[data-roman-op]").forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        update();
      });
    });
    update();
  }

  /* Number base converter */
  function renderBaseConverter() {
    return `
      <div class="tool-layout">
        <div class="game-panel panel-coral">
          <span class="field-title">The input is written in</span>
          <div class="segmented base-selector" aria-label="Input number base">
            <button class="tab-button" data-source-base="2">Binary</button>
            <button class="tab-button" data-source-base="8">Octal</button>
            <button class="tab-button" data-source-base="10">Decimal</button>
            <button class="tab-button active" data-source-base="16" aria-selected="true">Hex</button>
            <button class="tab-button" data-source-base="36">Base-36</button>
          </div>
          <div class="field-stack" style="margin-top: 16px">
            <label for="baseInput">Number</label>
            <input class="chunky-input" id="baseInput" value="FF" maxlength="256" autocomplete="off" spellcheck="false" />
          </div>
          <p class="graph-error" id="baseError" role="status"></p>
        </div>
        <div class="base-outputs" id="baseOutputs" aria-live="polite">
          ${[
            [2, "Binary"],
            [8, "Octal"],
            [10, "Decimal"],
            [16, "Hexadecimal"],
            [36, "Base-36"],
          ]
            .map(
              ([base, name]) => `
                <button class="base-output" data-output-base="${base}" aria-label="Use ${name} result as the input">
                  <span class="base-output-label">${name} · base ${base}</span>
                  <strong class="base-output-value" id="baseOutput${base}">—</strong>
                </button>
              `,
            )
            .join("")}
        </div>
        <p class="panel-note">Tap any result card to make it the new input.</p>
      </div>
    `;
  }

  function parseBigIntInBase(raw, base) {
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let text = raw.trim().toUpperCase();
    if (!text) throw new Error("Give this converter a number to carry.");
    let negative = false;
    if (text.startsWith("-")) {
      negative = true;
      text = text.slice(1);
    }
    if (!text) throw new Error("A minus sign needs a number beside it.");
    let value = 0n;
    for (const character of text) {
      const digit = alphabet.indexOf(character);
      if (digit < 0 || digit >= base) throw new Error(`“${character}” is not a base-${base} digit.`);
      value = value * BigInt(base) + BigInt(digit);
    }
    return negative ? -value : value;
  }

  function initBaseConverter(root) {
    const input = root.querySelector("#baseInput");
    const error = root.querySelector("#baseError");
    const bases = [2, 8, 10, 16, 36];
    let sourceBase = 16;

    function update() {
      try {
        const value = parseBigIntInBase(input.value, sourceBase);
        error.textContent = "";
        bases.forEach((base) => {
          root.querySelector(`#baseOutput${base}`).textContent = value.toString(base).toUpperCase();
        });
      } catch (caught) {
        error.textContent = caught.message;
        bases.forEach((base) => {
          root.querySelector(`#baseOutput${base}`).textContent = "—";
        });
      }
    }

    root.querySelectorAll("[data-source-base]").forEach((button) => {
      button.addEventListener("click", () => {
        let value = null;
        try {
          value = parseBigIntInBase(input.value, sourceBase);
        } catch {
          value = null;
        }
        sourceBase = Number(button.dataset.sourceBase);
        root.querySelectorAll("[data-source-base]").forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        if (value !== null) input.value = value.toString(sourceBase).toUpperCase();
        update();
      });
    });
    root.querySelectorAll("[data-output-base]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextBase = Number(button.dataset.outputBase);
        const value = button.querySelector(".base-output-value").textContent;
        if (value === "—") return;
        sourceBase = nextBase;
        input.value = value;
        root.querySelectorAll("[data-source-base]").forEach((tab) => {
          const active = Number(tab.dataset.sourceBase) === sourceBase;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        update();
        showToast(`Now reading base ${sourceBase}.`);
      });
    });
    input.addEventListener("input", update);
    update();
  }

  /* Prime checker */
  function renderPrimeChecker() {
    return `
      <div class="tool-layout prime-stage">
        <div class="game-panel panel-teal" style="width: min(100%, 570px)">
          <div class="field-stack">
            <label for="primeInput">Whole number</label>
            <input class="chunky-input" id="primeInput" inputmode="numeric" value="97" maxlength="20" />
          </div>
          <button class="game-button game-button-coral" id="checkPrime" style="width: 100%; margin-top: 14px">CHECK THIS NUMBER</button>
          <p class="panel-note">Checks whole numbers through 18,446,744,073,709,551,615.</p>
        </div>
        <div class="number-card" id="numberCard" aria-live="polite">
          <div>
            <strong class="prime-number" id="primeNumber">97</strong>
            <span class="prime-face" id="primeFace">•ᴗ•</span>
            <div class="prime-message" id="primeMessage">Ready for a prime check!</div>
          </div>
        </div>
      </div>
    `;
  }

  function modularPower(base, exponent, modulus) {
    let result = 1n;
    let factor = base % modulus;
    let power = exponent;
    while (power > 0n) {
      if (power & 1n) result = (result * factor) % modulus;
      factor = (factor * factor) % modulus;
      power >>= 1n;
    }
    return result;
  }

  function isPrimeBigInt(number) {
    if (number < 2n) return false;
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
    if (smallPrimes.includes(number)) return true;
    if (smallPrimes.some((prime) => number % prime === 0n)) return false;

    let oddPart = number - 1n;
    let twos = 0n;
    while (oddPart % 2n === 0n) {
      oddPart /= 2n;
      twos += 1n;
    }
    const witnesses = [2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n];
    for (const witness of witnesses) {
      const base = witness % number;
      if (base === 0n) continue;
      let value = modularPower(base, oddPart, number);
      if (value === 1n || value === number - 1n) continue;
      let passed = false;
      for (let round = 1n; round < twos; round += 1n) {
        value = (value * value) % number;
        if (value === number - 1n) {
          passed = true;
          break;
        }
      }
      if (!passed) return false;
    }
    return true;
  }

  function celebratePrime() {
    confettiField.innerHTML = "";
    for (let index = 0; index < 24; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${4 + Math.random() * 92}%`;
      piece.style.animationDelay = `${Math.random() * 0.28}s`;
      piece.style.animationDuration = `${1.15 + Math.random() * 0.65}s`;
      confettiField.append(piece);
    }
    window.setTimeout(() => {
      confettiField.innerHTML = "";
    }, 2200);
  }

  function initPrimeChecker(root) {
    const input = root.querySelector("#primeInput");
    const card = root.querySelector("#numberCard");
    const numberDisplay = root.querySelector("#primeNumber");
    const face = root.querySelector("#primeFace");
    const message = root.querySelector("#primeMessage");
    const maximum = 18446744073709551615n;

    function check() {
      const raw = input.value.trim();
      if (!/^\d+$/.test(raw)) {
        card.className = "number-card not-prime";
        numberDisplay.textContent = "?";
        face.textContent = "•︵•";
        message.textContent = "Pop in a positive whole number.";
        return;
      }
      const value = BigInt(raw);
      if (value > maximum) {
        card.className = "number-card not-prime";
        numberDisplay.textContent = "BIG";
        face.textContent = "•︵•";
        message.textContent = "That number is beyond this shelf's range.";
        return;
      }
      const prime = isPrimeBigInt(value);
      card.className = "number-card";
      void card.offsetWidth;
      card.classList.add(prime ? "is-prime" : "not-prime");
      numberDisplay.textContent = value.toLocaleString("en-US");
      if (prime) {
        face.textContent = "•ᴗ•";
        message.textContent = "Prime! Only 1 and itself divide it.";
        celebratePrime();
        bounceCategoryMascot("math", "A prime! Hooray!");
      } else if (value < 2n) {
        face.textContent = "•‿•";
        message.textContent = "Neither prime nor composite.";
      } else {
        face.textContent = "•︵•";
        message.textContent = "Composite — it has extra factors.";
      }
    }

    root.querySelector("#checkPrime").addEventListener("click", check);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") check();
    });
  }

  /* Sequence playground */
  function renderSequencePlayground() {
    const sequences = [
      ["fibonacci", "Fibonacci"],
      ["triangular", "Triangular"],
      ["square", "Square"],
      ["cube", "Cube"],
      ["prime", "Prime"],
      ["palindromic", "Palindromic"],
      ["happy", "Happy numbers"],
      ["perfect", "Perfect numbers"],
    ];
    return `
      <div class="tool-layout">
        <div class="sequence-grid" role="list" aria-label="Number sequences">
          ${sequences
            .map(
              ([key, name], index) => `
                <button class="sequence-tile ${index === 0 ? "active" : ""}" data-sequence="${key}" role="listitem">${name}</button>
              `,
            )
            .join("")}
        </div>
        <div class="game-panel panel-lilac sequence-preview">
          <div class="sequence-count">
            <div>
              <span class="result-kicker">Now playing</span>
              <h3 id="sequenceName">Fibonacci</h3>
            </div>
            <output class="slider-bubble" id="sequenceCountValue">10 tiles</output>
          </div>
          <input class="game-range" id="sequenceCount" type="range" min="5" max="12" value="10" aria-label="Number of sequence tiles" />
          <div class="sequence-track" id="sequenceTrack" aria-live="polite"></div>
        </div>
      </div>
    `;
  }

  function isHappyNumber(number) {
    let current = number;
    const seen = new Set();
    while (current !== 1 && !seen.has(current)) {
      seen.add(current);
      current = String(current)
        .split("")
        .reduce((sum, digit) => sum + Number(digit) ** 2, 0);
    }
    return current === 1;
  }

  function generateSequence(type, count) {
    if (type === "fibonacci") {
      const values = [];
      let a = 0n;
      let b = 1n;
      for (let index = 0; index < count; index += 1) {
        values.push(a.toString());
        [a, b] = [b, a + b];
      }
      return values;
    }
    if (type === "triangular") return Array.from({ length: count }, (_, index) => String(((index + 1) * (index + 2)) / 2));
    if (type === "square") return Array.from({ length: count }, (_, index) => String((index + 1) ** 2));
    if (type === "cube") return Array.from({ length: count }, (_, index) => String((index + 1) ** 3));
    if (type === "prime") {
      const values = [];
      let candidate = 2;
      while (values.length < count) {
        let prime = true;
        for (let divisor = 2; divisor * divisor <= candidate; divisor += 1) {
          if (candidate % divisor === 0) {
            prime = false;
            break;
          }
        }
        if (prime) values.push(String(candidate));
        candidate += 1;
      }
      return values;
    }
    if (type === "palindromic") {
      const values = [];
      let candidate = 1;
      while (values.length < count) {
        const text = String(candidate);
        if (text === [...text].reverse().join("")) values.push(text);
        candidate += 1;
      }
      return values;
    }
    if (type === "happy") {
      const values = [];
      let candidate = 1;
      while (values.length < count) {
        if (isHappyNumber(candidate)) values.push(String(candidate));
        candidate += 1;
      }
      return values;
    }
    if (type === "perfect") {
      const exponents = [2n, 3n, 5n, 7n, 13n, 17n, 19n, 31n, 61n, 89n, 107n, 127n];
      return exponents.slice(0, count).map((power) => {
        const perfect = (2n ** (power - 1n)) * (2n ** power - 1n);
        return perfect.toString();
      });
    }
    return [];
  }

  function initSequencePlayground(root) {
    const track = root.querySelector("#sequenceTrack");
    const countRange = root.querySelector("#sequenceCount");
    const countValue = root.querySelector("#sequenceCountValue");
    const name = root.querySelector("#sequenceName");
    let active = "fibonacci";
    const names = {
      fibonacci: "Fibonacci",
      triangular: "Triangular",
      square: "Square",
      cube: "Cube",
      prime: "Prime",
      palindromic: "Palindromic",
      happy: "Happy numbers",
      perfect: "Perfect numbers",
    };

    function draw() {
      const count = Number(countRange.value);
      countValue.textContent = `${count} tiles`;
      name.textContent = names[active];
      track.innerHTML = "";
      generateSequence(active, count).forEach((value, index) => {
        const tile = document.createElement("span");
        tile.className = "sequence-number";
        tile.textContent = value;
        tile.title = value;
        tile.style.animationDelay = `${index * 35}ms`;
        track.append(tile);
      });
      track.scrollLeft = 0;
    }

    root.querySelectorAll("[data-sequence]").forEach((button) => {
      button.addEventListener("click", () => {
        active = button.dataset.sequence;
        root.querySelectorAll("[data-sequence]").forEach((tile) => tile.classList.toggle("active", tile === button));
        draw();
      });
    });
    countRange.addEventListener("input", draw);
    draw();
  }


  /* CodeHub */
  const codeHubRuntimeState = {
    scriptPromises: new Map(),
    pyodidePromise: null,
    compilers: new Map(),
  };

  const codeHubTemplates = {
    web: {
      html: `<main class="hello-card">
  <span class="badge">CodeHub</span>
  <h1>Hello, tiny web!</h1>
  <p id="message">HTML, CSS, and JavaScript are playing together.</p>
  <button id="spark">Make a spark</button>
</main>`,
      css: `body {
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  background: #f5dba8;
  color: #4f2f23;
  font-family: system-ui, sans-serif;
}

.hello-card {
  width: min(360px, 80vw);
  padding: 32px;
  border: 5px solid #4f2f23;
  border-radius: 28px;
  background: #fff1cf;
  box-shadow: 0 12px 0 #a96840;
  text-align: center;
}

.badge, button {
  display: inline-block;
  padding: 9px 14px;
  border: 3px solid #4f2f23;
  border-radius: 14px;
  background: #82b9b3;
  font-weight: 800;
}

button {
  background: #efb94f;
  cursor: pointer;
}`,
      js: `const button = document.querySelector('#spark');
const message = document.querySelector('#message');
let sparks = 0;

button.addEventListener('click', () => {
  sparks += 1;
  message.textContent = \`You made \${sparks} spark\${sparks === 1 ? '' : 's'}!\`;
  console.log('Spark count:', sparks);
});`,
    },
    python: `name = input("What is your name? ")
for bite in range(1, 4):
    print(f"{bite}: Hello, {name}!")

squares = [number ** 2 for number in range(1, 6)]
print("Tiny squares:", squares)`,
    c: `#include <stdio.h>

int main(void) {
    char name[64];
    printf("What is your name? ");
    if (scanf("%63s", name) != 1) return 1;

    for (int bite = 1; bite <= 3; ++bite) {
        printf("%d: Hello, %s!\\n", bite, name);
    }
    return 0;
}`,
    cpp: `#include <iostream>
#include <string>
#include <vector>

int main() {
    std::string name;
    std::cout << "What is your name? ";
    std::cin >> name;

    std::vector<int> squares;
    for (int number = 1; number <= 5; ++number) {
        squares.push_back(number * number);
    }

    std::cout << "Hello, " << name << "! Tiny squares:";
    for (int value : squares) std::cout << ' ' << value;
    std::cout << '\\n';
    return 0;
}`,
  };

  function renderCodeHub() {
    return `
      <div class="codehub-shell">
        <div class="codehub-top-panel">
          <div class="segmented codehub-language-tabs" role="tablist" aria-label="CodeHub language">
            <button class="tab-button active" data-code-language="web" aria-selected="true">HTML · CSS · JS</button>
            <button class="tab-button" data-code-language="python" aria-selected="false">Python</button>
            <button class="tab-button" data-code-language="c" aria-selected="false">C</button>
            <button class="tab-button" data-code-language="cpp" aria-selected="false">C++</button>
          </div>
          <div class="codehub-runtime-card" aria-live="polite">
            <span class="runtime-dot ready" id="codeRuntimeDot"></span>
            <div>
              <span>Runtime</span>
              <strong id="codeRuntimeLabel">Your browser · ready</strong>
            </div>
            <div class="runtime-progress" aria-hidden="true"><span id="runtimeProgressBar"></span></div>
          </div>
        </div>

        <div class="codehub-workspace">
          <section class="codehub-editor-card">
            <div class="codehub-file-tabs" id="webFileTabs" role="tablist" aria-label="Web files">
              <button class="code-file-tab active" data-web-file="html" aria-selected="true">index.html</button>
              <button class="code-file-tab" data-web-file="css" aria-selected="false">style.css</button>
              <button class="code-file-tab" data-web-file="js" aria-selected="false">script.js</button>
            </div>
            <div class="codehub-editor-heading">
              <span class="code-file-name" id="codeFileName">index.html</span>
              <span class="code-language-pill" id="codeLanguagePill">WEB TRIO</span>
            </div>
            <textarea class="code-editor" id="codeEditor" aria-label="Code editor" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
            <div class="codehub-stdin" id="codeStdinWrap" hidden>
              <label for="codeStdin">Program input</label>
              <textarea id="codeStdin" class="code-stdin-input" spellcheck="false">Waffle</textarea>
            </div>
            <div class="codehub-action-row">
              <button class="game-button game-button-coral" id="runCode">▶ RUN CODE</button>
              <button class="game-button game-button-small" id="resetCode">RESET</button>
            </div>
          </section>

          <section class="codehub-result-card">
            <div class="codehub-result-heading">
              <strong id="codeResultTitle">Live preview</strong>
              <span id="codeRunTime">Browser sandbox</span>
            </div>
            <iframe class="code-preview" id="codePreview" title="CodeHub web preview" sandbox="allow-scripts"></iframe>
            <div class="code-console-wrap" id="codeConsoleWrap">
              <span class="console-label">Console</span>
              <pre class="code-console" id="codeConsole" aria-live="polite">Ready.</pre>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  function loadCodeHubScript(path, globalReady) {
    if (globalReady()) return Promise.resolve();
    if (codeHubRuntimeState.scriptPromises.has(path)) return codeHubRuntimeState.scriptPromises.get(path);
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL(path, document.baseURI).href;
      script.async = true;
      script.addEventListener("load", () => (globalReady() ? resolve() : reject(new Error(`Runtime did not start: ${path}`))), { once: true });
      script.addEventListener("error", () => reject(new Error(`Could not load ${path}`)), { once: true });
      document.head.append(script);
    }).catch((error) => {
      codeHubRuntimeState.scriptPromises.delete(path);
      throw error;
    });
    codeHubRuntimeState.scriptPromises.set(path, promise);
    return promise;
  }

  async function getPyodideRuntime(onStatus) {
    if (window.pyodide) return window.pyodide;
    if (!codeHubRuntimeState.pyodidePromise) {
      codeHubRuntimeState.pyodidePromise = (async () => {
        onStatus("Loading Pyodide…", 0.16, "loading");
        await loadCodeHubScript("vendor/pyodide/pyodide.js", () => typeof window.loadPyodide === "function");
        onStatus("Preparing Python…", 0.5, "loading");
        const pyodide = await window.loadPyodide({
          indexURL: new URL("vendor/pyodide/", document.baseURI).href,
        });
        window.pyodide = pyodide;
        return pyodide;
      })().catch((error) => {
        codeHubRuntimeState.pyodidePromise = null;
        throw error;
      });
    }
    return codeHubRuntimeState.pyodidePromise;
  }

  async function getClangCompiler(language, onStatus) {
    if (codeHubRuntimeState.compilers.has(language)) return codeHubRuntimeState.compilers.get(language);
    const promise = (async () => {
      onStatus("Loading Clang WASM…", 0.08, "loading");
      await loadCodeHubScript("vendor/clang/clang-wasm.global.js", () => Boolean(window.clangWasm?.createCompiler));
      const baseUrl = new URL("vendor/clang/", document.baseURI);
      return window.clangWasm.createCompiler(language, {
        baseUrl,
        std: language === "cpp" ? "gnu++20" : "gnu17",
        onProgress: (value) => onStatus(`Loading Clang WASM… ${Math.round(value * 100)}%`, Math.max(0.08, value), "loading"),
      });
    })().catch((error) => {
      codeHubRuntimeState.compilers.delete(language);
      throw error;
    });
    codeHubRuntimeState.compilers.set(language, promise);
    return promise;
  }

  function initCodeHub(root) {
    const editor = root.querySelector("#codeEditor");
    const stdinWrap = root.querySelector("#codeStdinWrap");
    const stdin = root.querySelector("#codeStdin");
    const webFileTabs = root.querySelector("#webFileTabs");
    const fileName = root.querySelector("#codeFileName");
    const languagePill = root.querySelector("#codeLanguagePill");
    const runtimeLabel = root.querySelector("#codeRuntimeLabel");
    const runtimeDot = root.querySelector("#codeRuntimeDot");
    const runtimeProgress = root.querySelector("#runtimeProgressBar");
    const runButton = root.querySelector("#runCode");
    const resetButton = root.querySelector("#resetCode");
    const preview = root.querySelector("#codePreview");
    const consoleOutput = root.querySelector("#codeConsole");
    const resultTitle = root.querySelector("#codeResultTitle");
    const runTime = root.querySelector("#codeRunTime");
    const consoleWrap = root.querySelector("#codeConsoleWrap");
    const sources = {
      web: { ...codeHubTemplates.web },
      python: codeHubTemplates.python,
      c: codeHubTemplates.c,
      cpp: codeHubTemplates.cpp,
    };
    const fileNames = { html: "index.html", css: "style.css", js: "script.js" };
    const languageNames = { web: "WEB TRIO", python: "PYTHON", c: "C · WASM", cpp: "C++ · WASM" };
    const channel = `codehub-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let language = "web";
    let webFile = "html";
    let previewTimer = null;
    let running = false;

    function setStatus(message, progress = 1, state = "ready") {
      if (!root.isConnected) return;
      runtimeLabel.textContent = message;
      runtimeDot.className = `runtime-dot ${state}`;
      runtimeProgress.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
    }

    function saveEditor() {
      if (language === "web") sources.web[webFile] = editor.value;
      else sources[language] = editor.value;
    }

    function updateEditor() {
      editor.value = language === "web" ? sources.web[webFile] : sources[language];
      fileName.textContent = language === "web" ? fileNames[webFile] : language === "python" ? "main.py" : language === "c" ? "main.c" : "main.cpp";
      languagePill.textContent = languageNames[language];
    }

    function writeConsole(text, tone = "normal") {
      consoleOutput.textContent = text || "Program finished with no output.";
      consoleOutput.dataset.tone = tone;
      consoleWrap.scrollTop = consoleWrap.scrollHeight;
    }

    function runWeb() {
      saveEditor();
      const logs = [];
      writeConsole("Running in the browser…");
      const safeJavaScript = sources.web.js.replace(/<\/script/gi, "<\\/script");
      const bridge = `
        const __send = (type, values) => parent.postMessage({ source: 'codehub-preview', channel: ${JSON.stringify(channel)}, type, text: values.map(value => {
          try { return typeof value === 'object' ? JSON.stringify(value) : String(value); }
          catch { return String(value); }
        }).join(' ') }, '*');
        ['log', 'info', 'warn', 'error'].forEach(type => {
          const original = console[type];
          console[type] = (...values) => { __send(type, values); original.apply(console, values); };
        });
        window.addEventListener('error', event => __send('error', [event.message]));
      `;
      preview.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${sources.web.css}</style></head><body>${sources.web.html}<script>${bridge}${safeJavaScript}<\/script></body></html>`;
      writeConsole(logs.length ? logs.join("\n") : "Preview ready. Console messages will appear here.");
      setStatus("Your browser · ready", 1, "ready");
      runTime.textContent = "Browser sandbox";
    }

    const previewMessageHandler = (event) => {
      if (event.source !== preview.contentWindow || event.data?.source !== "codehub-preview" || event.data.channel !== channel) return;
      const prefix = event.data.type === "error" ? "Error: " : event.data.type === "warn" ? "Warning: " : "";
      const previous = consoleOutput.textContent.includes("Preview ready") ? "" : `${consoleOutput.textContent}\n`;
      writeConsole(`${previous}${prefix}${event.data.text}`, event.data.type === "error" ? "error" : "normal");
    };
    window.addEventListener("message", previewMessageHandler);
    addCleanup(() => window.removeEventListener("message", previewMessageHandler));

    async function runPython() {
      const started = performance.now();
      const output = [];
      setStatus("Loading Pyodide…", 0.1, "loading");
      const pyodide = await getPyodideRuntime(setStatus);
      const inputs = stdin.value.replace(/\r/g, "").split("\n");
      pyodide.setStdout({ batched: (text) => output.push(text) });
      pyodide.setStderr({ batched: (text) => output.push(text) });
      pyodide.setStdin({ stdin: () => (inputs.length ? inputs.shift() : null) });
      setStatus("Pyodide · running", 0.86, "loading");
      const result = await pyodide.runPythonAsync(sources.python);
      if (result !== undefined && result !== null && String(result) !== "None") output.push(String(result));
      if (result && typeof result.destroy === "function") result.destroy();
      writeConsole(output.join("\n"));
      setStatus("Pyodide · ready", 1, "ready");
      runTime.textContent = `Python · ${Math.round(performance.now() - started)} ms`;
    }

    async function runClang(languageId) {
      const started = performance.now();
      setStatus("Loading Clang WASM…", 0.05, "loading");
      const compiler = await getClangCompiler(languageId, setStatus);
      setStatus(`Clang WASM · compiling ${languageId === "cpp" ? "C++" : "C"}`, 0.92, "loading");
      const result = await compiler.run(sources[languageId], stdin.value, {
        std: languageId === "cpp" ? "gnu++20" : "gnu17",
      });
      const text = result.exitCode === null ? result.errors.join("\n") : result.output;
      writeConsole(text, result.exitCode === null || result.exitCode !== 0 ? "error" : "normal");
      setStatus("Clang WASM · ready", 1, result.exitCode === null ? "error" : "ready");
      runTime.textContent = result.exitCode === null
        ? "Compile stopped"
        : `Compile ${Math.round(result.compileMs)} ms · Run ${Math.round(result.runMs || 0)} ms · Exit ${result.exitCode}`;
      if (!text && result.exitCode === 0) writeConsole("Program finished with exit code 0.");
      if (!Number.isFinite(result.compileMs)) runTime.textContent = `WASM run · ${Math.round(performance.now() - started)} ms`;
    }

    async function runCode() {
      if (running) return;
      saveEditor();
      running = true;
      runButton.disabled = true;
      runButton.textContent = language === "web" ? "▶ REFRESHING" : "● RUNNING";
      writeConsole(language === "web" ? "Refreshing preview…" : "Starting runtime…");
      try {
        if (language === "web") runWeb();
        else if (language === "python") await runPython();
        else await runClang(language);
      } catch (error) {
        writeConsole(error?.stack || error?.message || String(error), "error");
        setStatus("Runtime needs attention", 1, "error");
        runTime.textContent = "Run stopped";
      } finally {
        if (root.isConnected) {
          running = false;
          runButton.disabled = false;
          runButton.textContent = "▶ RUN CODE";
        }
      }
    }

    function selectLanguage(nextLanguage) {
      if (nextLanguage === language) return;
      saveEditor();
      language = nextLanguage;
      root.querySelectorAll("[data-code-language]").forEach((button) => {
        const active = button.dataset.codeLanguage === language;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });
      webFileTabs.hidden = language !== "web";
      stdinWrap.hidden = language === "web";
      preview.hidden = language !== "web";
      resultTitle.textContent = language === "web" ? "Live preview" : "Program output";
      consoleWrap.classList.toggle("console-large", language !== "web");
      if (language === "web") {
        setStatus("Your browser · ready", 1, "ready");
        runTime.textContent = "Browser sandbox";
      } else if (language === "python") {
        setStatus(codeHubRuntimeState.pyodidePromise ? "Pyodide · warmed up" : "Pyodide · loads on first run", codeHubRuntimeState.pyodidePromise ? 1 : 0, codeHubRuntimeState.pyodidePromise ? "ready" : "idle");
        runTime.textContent = "Python output";
        writeConsole("Press RUN CODE to start Python in Pyodide.");
      } else {
        const warm = codeHubRuntimeState.compilers.has(language);
        setStatus(warm ? "Clang WASM · warmed up" : "Clang WASM · loads on first run", warm ? 1 : 0, warm ? "ready" : "idle");
        runTime.textContent = `${language === "cpp" ? "C++20" : "C17"} output`;
        writeConsole(`Press RUN CODE to compile ${language === "cpp" ? "C++" : "C"} to WebAssembly.`);
      }
      updateEditor();
      if (language === "web") runWeb();
    }

    root.querySelectorAll("[data-code-language]").forEach((button) => {
      button.addEventListener("click", () => selectLanguage(button.dataset.codeLanguage));
    });
    root.querySelectorAll("[data-web-file]").forEach((button) => {
      button.addEventListener("click", () => {
        if (language !== "web" || button.dataset.webFile === webFile) return;
        sources.web[webFile] = editor.value;
        webFile = button.dataset.webFile;
        root.querySelectorAll("[data-web-file]").forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        updateEditor();
      });
    });
    editor.addEventListener("input", () => {
      if (language !== "web") return;
      window.clearTimeout(previewTimer);
      previewTimer = window.setTimeout(runWeb, 480);
    });
    runButton.addEventListener("click", runCode);
    resetButton.addEventListener("click", () => {
      if (language === "web") sources.web = { ...codeHubTemplates.web };
      else sources[language] = codeHubTemplates[language];
      updateEditor();
      writeConsole("Starter code restored.");
      if (language === "web") runWeb();
    });
    addCleanup(() => window.clearTimeout(previewTimer));
    updateEditor();
    runWeb();
  }
})();
