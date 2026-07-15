(() => {
  const quote = document.querySelector(".principal-quote-text");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!quote || reduceMotion.matches) return;

  const message = quote.textContent.trim();
  if (!message) return;

  const quoteBlock = quote.closest(".principal-quote");
  if (quoteBlock) quoteBlock.style.minHeight = `${quoteBlock.offsetHeight}px`;
  quote.classList.add("is-waiting");

  let characterIndex = 0;

  const typeNextCharacter = () => {
    characterIndex += 1;
    quote.textContent = message.slice(0, characterIndex);

    if (characterIndex < message.length) {
      const character = message.charAt(characterIndex - 1);
      const delay = /[,.!?]/.test(character) ? 130 : character === " " ? 25 : 38;
      window.setTimeout(typeNextCharacter, delay);
      return;
    }

    quote.classList.remove("is-typing");
    quote.classList.add("is-typed");
    if (quoteBlock) quoteBlock.style.removeProperty("min-height");
  };

  const startTyping = () => {
    quote.textContent = "";
    quote.classList.remove("is-waiting");
    quote.classList.add("is-typing");
    window.setTimeout(typeNextCharacter, 260);
  };

  if (!("IntersectionObserver" in window)) {
    startTyping();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    startTyping();
  }, { threshold: 0.35 });

  observer.observe(quote);
})();
