(function () {
  if (globalThis.__copyUnlockerLoaded) return;
  globalThis.__copyUnlockerLoaded = true;

  const blockedEvents = new Set([
    "beforecopy",
    "copy",
    "contextmenu",
    "cut",
    "dragstart",
    "mousedown",
    "select",
    "selectstart"
  ]);

  const blockedKeyboardEvents = new Set([
    "keydown",
    "keypress",
    "keyup"
  ]);

  installEarlyPagePatch(blockedEvents);
  installEventGuards(blockedEvents, blockedKeyboardEvents);
  restoreInlineHandlers();
  restoreSelectableStyles();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  } else {
    startObserver();
  }

  function installEarlyPagePatch(events) {
    const script = document.createElement("script");
    script.textContent = `(${patchPageEventListeners.toString()})(${JSON.stringify([...events])});`;
    (document.documentElement || document.head || document).appendChild(script);
    script.remove();
  }

  function patchPageEventListeners(events) {
    if (globalThis.__copyUnlockerPagePatchLoaded) return;
    globalThis.__copyUnlockerPagePatchLoaded = true;

    const blockedEvents = new Set(events);
    const copyKeys = new Set(["a", "c", "x"]);
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalSetAttribute = Element.prototype.setAttribute;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
      const eventType = String(type).toLowerCase();
      if (blockedEvents.has(eventType)) {
        return undefined;
      }
      return originalAddEventListener.call(this, type, listener, options);
    };

    Element.prototype.setAttribute = function (name, value) {
      if (String(name).toLowerCase().startsWith("on")) {
        return undefined;
      }
      return originalSetAttribute.call(this, name, value);
    };

    document.addEventListener("keydown", function (event) {
      const key = String(event.key || "").toLowerCase();
      if ((event.metaKey || event.ctrlKey) && copyKeys.has(key)) {
        event.stopImmediatePropagation();
      }
    }, true);
  }

  function installEventGuards(events, keyboardEvents) {
    const targets = [window, document, document.documentElement];
    for (const target of targets) {
      if (!target) continue;
      for (const eventType of events) {
        target.addEventListener(eventType, stopPageBlocker, true);
      }
      for (const eventType of keyboardEvents) {
        target.addEventListener(eventType, stopCopyShortcutBlocker, true);
      }
    }
  }

  function stopPageBlocker(event) {
    event.stopImmediatePropagation();
  }

  function stopCopyShortcutBlocker(event) {
    const key = String(event.key || "").toLowerCase();
    if ((event.metaKey || event.ctrlKey) && (key === "a" || key === "c" || key === "x")) {
      event.stopImmediatePropagation();
    }
  }

  function restoreInlineHandlers(root = document) {
    const selector = [
      "[onbeforecopy]",
      "[oncopy]",
      "[oncontextmenu]",
      "[oncut]",
      "[ondragstart]",
      "[onmousedown]",
      "[onselect]",
      "[onselectstart]"
    ].join(",");

    const targets = [];
    if (root.matches?.(selector)) {
      targets.push(root);
    }
    targets.push(...(root.querySelectorAll?.(selector) ?? []));

    for (const element of targets) {
      for (const attribute of [...element.attributes]) {
        if (attribute.name.toLowerCase().startsWith("on")) {
          element.removeAttribute(attribute.name);
        }
      }
    }

    const handlerNames = [
      "onbeforecopy",
      "oncopy",
      "oncontextmenu",
      "oncut",
      "ondragstart",
      "onmousedown",
      "onselect",
      "onselectstart"
    ];

    for (const target of [window, document, document.documentElement, document.body].filter(Boolean)) {
      for (const handlerName of handlerNames) {
        try {
          target[handlerName] = null;
        } catch {
          // Some host objects expose readonly event handler properties.
        }
      }
    }
  }

  function restoreSelectableStyles(root = document) {
    const elements = [];
    if (root.nodeType === Node.ELEMENT_NODE) {
      elements.push(root);
    }
    elements.push(...(root.querySelectorAll?.("*") ?? []));

    for (const element of elements) {
      const style = element.style;
      if (!style) continue;
      style.setProperty("-webkit-user-select", "text", "important");
      style.setProperty("user-select", "text", "important");
      style.setProperty("-webkit-touch-callout", "default", "important");
    }
  }

  function startObserver() {
    restoreInlineHandlers();
    restoreSelectableStyles();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          restoreInlineHandlers(mutation.target);
          restoreSelectableStyles(mutation.target);
        }
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          restoreInlineHandlers(node);
          restoreSelectableStyles(node);
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [
        "onbeforecopy",
        "oncopy",
        "oncontextmenu",
        "oncut",
        "ondragstart",
        "onmousedown",
        "onselect",
        "onselectstart",
        "style"
      ],
      childList: true,
      subtree: true
    });
  }
})();
