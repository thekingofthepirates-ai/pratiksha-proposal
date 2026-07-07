(() => {
  const pages = Array.from(document.querySelectorAll(".page"));
  const total = pages.length;
  const noButton = document.querySelector('[data-answer="no"]');
  const yesButton = document.querySelector('[data-answer="yes"]');
  const proposalResponse = document.getElementById("proposalResponse");
  const notificationTopic = "braj-pratiksha-proposal-yes-20260707";
  const noMessages = [
    "Think again baccha...",
    "You know i can't live without you",
    "Just give me a chance babu...",
    "My heart already chose you.",
    "Please don't run from us...",
    "One yes, and I promise I'll make it worth it.",
    "Babu, you know the right answer...",
  ];
  let current = 1;
  let noAttempts = 0;

  const goTo = (pageNumber) => {
    const next = Math.max(1, Math.min(total, Number.parseInt(pageNumber, 10) || 1));
    if (next === current) return;

    pages.forEach((page) => {
      page.classList.toggle("is-active", Number(page.dataset.page) === next);
      if (Number(page.dataset.page) === next) page.scrollTop = 0;
    });

    current = next;
  };

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-go]");
    if (!target) return;

    goTo(target.dataset.go);
    target.blur();
  });

  const showProposalResponse = (message) => {
    if (!proposalResponse) return;
    proposalResponse.classList.remove("is-visible");
    proposalResponse.textContent = message;
    window.requestAnimationFrame(() => {
      proposalResponse.classList.add("is-visible");
    });
  };

  const sendYesNotification = () => {
    fetch(`https://ntfy.sh/${notificationTopic}`, {
      method: "POST",
      body: "Pratiksha pressed YES on your proposal website.",
      headers: {
        Title: "She said YES!",
        Priority: "urgent",
        Tags: "heart",
      },
    }).catch(() => {
      // Keep the proposal moment smooth even if the notification service is unreachable.
    });
  };

  const moveNoButton = () => {
    if (!noButton) return;

    noAttempts += 1;
    const isSmallScreen = window.innerWidth < 520;
    const safeSpots = isSmallScreen
      ? [
          { x: 92, y: -72 },
          { x: 124, y: 56 },
          { x: 104, y: 88 },
          { x: 136, y: -18 },
          { x: 98, y: 22 },
        ]
      : [
          { x: 168, y: -78 },
          { x: 230, y: 48 },
          { x: 184, y: 90 },
          { x: 258, y: -18 },
          { x: 150, y: 18 },
          { x: 218, y: -52 },
        ];
    const spot = safeSpots[noAttempts % safeSpots.length];
    const wiggle = Math.round((Math.random() * 2 - 1) * 10);
    const x = spot.x + wiggle;
    const y = spot.y;
    noButton.style.setProperty("--run-x", `${x}px`);
    noButton.style.setProperty("--run-y", `${y}px`);
    noButton.classList.add("is-running");
    showProposalResponse(noMessages[(noAttempts - 1) % noMessages.length]);
  };

  yesButton?.addEventListener("click", () => {
    yesButton.textContent = "YES, YOURS";
    yesButton.disabled = true;
    sendYesNotification();
    yesButton.blur();
    goTo(6);
  });

  noButton?.addEventListener("pointerenter", () => {
    moveNoButton();
  });

  noButton?.addEventListener("focus", () => {
    moveNoButton();
  });

  noButton?.addEventListener("touchstart", (event) => {
    event.preventDefault();
    moveNoButton();
  }, { passive: false });

  noButton?.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton();
    noButton.blur();
  });
})();
