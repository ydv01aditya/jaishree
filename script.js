const specialDate = { day: 15, month: 3, originalYear: 2004 };
const unlockPassword = "iloveuaditya";
const requiredGateTaps = 3;

const notes = [
  "You make ordinary days feel special.",
  "Your smile is still my favorite notification.",
  "I like you in the quiet moments and the loud ones too.",
  "Being around you feels like coming home.",
  "You are my favorite part of every plan.",
  "I hope this made you smile, even a little."
];

const moodNotes = {
  happy: "Your happiness is my favorite kind of sunshine.",
  missing: "Even when you are far, you are still the closest thought in my heart.",
  cute: "You are cute in ways that should honestly be illegal.",
  romantic: "If love had a name on this page, it would be Jaishree."
};

const photoMemories = [
  {
    src: "photos/jaishree-1.jpg",
    caption: "Her smile",
    note: "Your smile can make the whole day softer.",
    tilt: "-3deg"
  },
  {
    src: "photos/us-1.jpg",
    caption: "Us",
    note: "This photo feels like a small piece of forever.",
    tilt: "2deg"
  },
  {
    src: "photos/jaishree-2.jpg",
    caption: "Favorite face",
    note: "You look beautiful in the easiest, most natural way.",
    tilt: "-1deg"
  },
  {
    src: "photos/jaishree-3.jpg",
    caption: "Jaishree",
    note: "You are honestly the prettiest part of this page.",
    tilt: "3deg"
  }
];

const days = document.querySelector("#days");
const hours = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");
const noteText = document.querySelector("#noteText");
const noteBox = document.querySelector(".note-box");
const surpriseGate = document.querySelector("#surpriseGate");
const gateHeartButton = document.querySelector("#gateHeartButton");
const gateDots = [
  document.querySelector("#gateDotOne"),
  document.querySelector("#gateDotTwo"),
  document.querySelector("#gateDotThree")
];
const fallingHearts = document.querySelectorAll(".heart-rain span");
const newNoteButton = document.querySelector("#newNoteButton");
const sendHeartButton = document.querySelector("#sendHeartButton");
const heartCount = document.querySelector("#heartCount");
const meterFill = document.querySelector("#meterFill");
const meterLabel = document.querySelector("#meterLabel");
const meterReward = document.querySelector("#meterReward");
const moodButtons = document.querySelectorAll("[data-mood]");
const quizButtons = document.querySelectorAll("[data-answer]");
const quizMessage = document.querySelector("#quizMessage");
const scratchCanvas = document.querySelector("#scratchCanvas");
const scratchMessage = document.querySelector("#scratchMessage");
const photoGallery = document.querySelector("#photoGallery");
const photoLightbox = document.querySelector("#photoLightbox");
const closeLightbox = document.querySelector("#closeLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxPlaceholder = document.querySelector("#lightboxPlaceholder");
const lightboxCaption = document.querySelector("#lightboxCaption");
const unlockForm = document.querySelector("#unlockForm");
const passwordInput = document.querySelector("#passwordInput");
const errorMessage = document.querySelector("#errorMessage");
const letter = document.querySelector("#letter");
let sentHearts = 0;
let scratchCount = 0;
let isScratching = false;
let hasShownSelfPhotoPop = false;
let gateTapCount = 0;

function markMissingImage(image, placeholder, src) {
  image.classList.add("is-missing");
  placeholder.hidden = false;
  placeholder.textContent = `Photo slot: ${src}`;
}

function getNextSpecialDate() {
  const now = new Date();
  const thisYearDate = new Date(now.getFullYear(), specialDate.month - 1, specialDate.day);

  if (thisYearDate >= now) {
    return thisYearDate;
  }

  return new Date(now.getFullYear() + 1, specialDate.month - 1, specialDate.day);
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const countdownDate = getNextSpecialDate();
  const distance = countdownDate - now;

  if (distance <= 0) {
    days.textContent = "00";
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(distance / 1000);
  const dayCount = Math.floor(totalSeconds / 86400);
  const hourCount = Math.floor((totalSeconds % 86400) / 3600);
  const minuteCount = Math.floor((totalSeconds % 3600) / 60);
  const secondCount = totalSeconds % 60;

  days.textContent = padNumber(dayCount);
  hours.textContent = padNumber(hourCount);
  minutes.textContent = padNumber(minuteCount);
  seconds.textContent = padNumber(secondCount);
}

function showRandomNote() {
  const currentNote = noteText.textContent;
  let nextNote = currentNote;

  while (nextNote === currentNote && notes.length > 1) {
    nextNote = notes[Math.floor(Math.random() * notes.length)];
  }

  noteText.textContent = nextNote;
  noteText.classList.remove("note-pop");
  noteBox.classList.remove("note-changing");
  void noteText.offsetWidth;
  noteText.classList.add("note-pop");
  noteBox.classList.add("note-changing");

  const noteBoxBounds = noteBox.getBoundingClientRect();
  const centerX = noteBoxBounds.left + noteBoxBounds.width / 2;
  const centerY = noteBoxBounds.top + noteBoxBounds.height / 2;

  for (let index = 0; index < 8; index += 1) {
    const burstX = (index - 3.5) * 22;
    createTapHeart(centerX, centerY, burstX);
  }

  for (let index = 0; index < 6; index += 1) {
    createLoveBurst(centerX, centerY, index);
  }
}

newNoteButton.addEventListener("click", showRandomNote);

gateHeartButton.addEventListener("click", () => {
  gateTapCount = Math.min(gateTapCount + 1, requiredGateTaps);
  gateHeartButton.classList.remove("is-tapped");
  void gateHeartButton.offsetWidth;
  gateHeartButton.classList.add("is-tapped");

  gateDots.forEach((dot, index) => {
    dot.classList.toggle("is-filled", index < gateTapCount);
  });

  createKissEffect();

  if (gateTapCount < requiredGateTaps) {
    return;
  }

  surpriseGate.classList.add("is-opening");
  createFireworkShow();

  window.setTimeout(() => {
    surpriseGate.classList.add("is-open");
  }, 900);
});

function renderPhotoGallery() {
  photoMemories.forEach((photo, index) => {
    const card = document.createElement("button");
    const frame = document.createElement("div");
    const image = document.createElement("img");
    const placeholder = document.createElement("div");

    card.className = "personal-photo-card";
    card.type = "button";
    card.style.setProperty("--tilt", photo.tilt);
    frame.className = "personal-photo-frame";
    placeholder.className = "photo-placeholder";

    image.src = photo.src;
    image.alt = photo.caption;
    placeholder.hidden = true;

    image.addEventListener("error", () => {
      markMissingImage(image, placeholder, photo.src);
    });

    card.addEventListener("click", () => {
      openPhotoLightbox(index);
    });

    frame.append(image, placeholder);
    card.append(frame);
    photoGallery.append(card);
  });
}

function openPhotoLightbox(index) {
  const photo = photoMemories[index];

  if ([0, 2, 3].includes(index)) {
    showSelfPhotoPop();
  }

  lightboxImage.classList.remove("is-missing");
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.caption;
  lightboxPlaceholder.hidden = true;
  lightboxCaption.textContent = `${photo.caption}: ${photo.note}`;
  photoLightbox.hidden = false;

  lightboxImage.onerror = () => {
    markMissingImage(lightboxImage, lightboxPlaceholder, photo.src);
  };

  for (let burstIndex = 0; burstIndex < 10; burstIndex += 1) {
    createLoveBurst(window.innerWidth / 2, window.innerHeight / 2, burstIndex);
  }
}

closeLightbox.addEventListener("click", () => {
  photoLightbox.hidden = true;
});

photoLightbox.addEventListener("click", (event) => {
  if (event.target === photoLightbox) {
    photoLightbox.hidden = true;
  }
});

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mood = button.dataset.mood;
    noteText.textContent = moodNotes[mood];
    createLoveBurst(window.innerWidth / 2, window.innerHeight / 2, 0);
  });
});

document.querySelectorAll("button, .primary-button, .icon-button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.remove("is-clicking");
    void button.offsetWidth;
    button.classList.add("is-clicking");

    window.setTimeout(() => {
      button.classList.remove("is-clicking");
    }, 720);
  });
});

function createTapHeart(x, y, burstX) {
  const heart = document.createElement("span");
  heart.className = "tap-heart";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.setProperty("--burst-x", `${burstX}px`);
  document.body.append(heart);

  heart.addEventListener("animationend", () => {
    heart.remove();
  });
}

function burstFallingHeart(event) {
  const heartBox = event.currentTarget.getBoundingClientRect();
  const x = heartBox.left + heartBox.width / 2;
  const y = heartBox.top + heartBox.height / 2;

  event.currentTarget.classList.remove("is-heart-tapped");
  void event.currentTarget.offsetWidth;
  event.currentTarget.classList.add("is-heart-tapped");

  for (let index = 0; index < 12; index += 1) {
    const burstX = (index - 5.5) * 16;
    createTapHeart(x, y, burstX);
  }

  for (let index = 0; index < 5; index += 1) {
    createLoveBurst(x, y, index);
  }
}

fallingHearts.forEach((heart) => {
  heart.addEventListener("click", burstFallingHeart);
});

function createLoveBurst(x, y, index) {
  const sparkle = document.createElement("span");
  const angle = (Math.PI * 2 * index) / 14;
  const distance = 90 + Math.random() * 70;

  sparkle.className = "love-burst";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.style.setProperty("--x", `${x}px`);
  sparkle.style.setProperty("--y", `${y}px`);
  sparkle.style.setProperty("--size", `${8 + Math.random() * 10}px`);
  sparkle.style.setProperty("--move-x", `${Math.cos(angle) * distance}px`);
  sparkle.style.setProperty("--move-y", `${Math.sin(angle) * distance}px`);
  document.body.append(sparkle);

  sparkle.addEventListener("animationend", () => {
    sparkle.remove();
  });
}

function showRomanticPop() {
  const pop = document.createElement("div");
  pop.className = "romantic-pop";
  pop.textContent = "Correct, my wifu";
  document.body.append(pop);

  pop.addEventListener("animationend", () => {
    pop.remove();
  });
}

function showMessagePop(message) {
  const pop = document.createElement("div");
  pop.className = "romantic-pop";
  pop.textContent = message;
  document.body.append(pop);

  pop.addEventListener("animationend", () => {
    pop.remove();
  });
}

function showSelfPhotoPop() {
  if (hasShownSelfPhotoPop) {
    return;
  }

  hasShownSelfPhotoPop = true;
  showMessagePop("yha prr bhe sabse pehle khudhko dekhna h tumhe");
  createKissEffect();
}

function createFireworkShow() {
  const colors = ["#ff4f8b", "#fff6b8", "#b7d8c6", "#ef6f9a", "#d9a441"];

  for (let burst = 0; burst < 5; burst += 1) {
    const centerX = window.innerWidth * (0.18 + Math.random() * 0.64);
    const centerY = window.innerHeight * (0.18 + Math.random() * 0.5);

    for (let spark = 0; spark < 18; spark += 1) {
      const particle = document.createElement("span");
      const angle = (Math.PI * 2 * spark) / 18;
      const distance = 60 + Math.random() * 70;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.className = "firework";
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.setProperty("--x", `${centerX}px`);
      particle.style.setProperty("--y", `${centerY}px`);
      particle.style.setProperty("--move-x", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--move-y", `${Math.sin(angle) * distance}px`);
      particle.style.setProperty("--color", color);
      document.body.append(particle);

      particle.addEventListener("animationend", () => {
        particle.remove();
      });
    }
  }
}

function createKissEffect() {
  for (let index = 0; index < 18; index += 1) {
    const kiss = document.createElement("span");
    const x = window.innerWidth * (0.16 + Math.random() * 0.68);
    const y = window.innerHeight * (0.2 + Math.random() * 0.54);

    kiss.className = "kiss-pop";
    kiss.textContent = "kiss";
    kiss.style.setProperty("--x", `${x}px`);
    kiss.style.setProperty("--y", `${y}px`);
    kiss.style.setProperty("--size", `${1.2 + Math.random() * 1.4}rem`);
    kiss.style.setProperty("--rotate", `${-22 + Math.random() * 44}deg`);
    kiss.style.setProperty("--move-x", `${-40 + Math.random() * 80}px`);
    kiss.style.setProperty("--move-y", `${-86 - Math.random() * 60}px`);
    document.body.append(kiss);

    kiss.addEventListener("animationend", () => {
      kiss.remove();
    });
  }
}

function updateLoveMeter() {
  const percentage = Math.min(sentHearts * 20, 100);

  meterFill.style.width = `${percentage}%`;
  meterLabel.textContent = `${percentage}%`;

  if (percentage >= 100) {
    meterReward.hidden = false;
  }
}

sendHeartButton.addEventListener("click", () => {
  const buttonBox = sendHeartButton.getBoundingClientRect();
  const startX = buttonBox.left + buttonBox.width / 2;
  const startY = buttonBox.top + buttonBox.height / 2;

  sentHearts += 1;
  heartCount.textContent = sentHearts;
  updateLoveMeter();

  for (let index = 0; index < 8; index += 1) {
    const burstX = (index - 3.5) * 18;
    createTapHeart(startX, startY, burstX);
  }

  for (let index = 0; index < 14; index += 1) {
    createLoveBurst(window.innerWidth / 2, window.innerHeight / 2, index);
  }
});

quizButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.answer === "correct") {
      quizMessage.textContent = "Correct, my wifu.";
      quizMessage.classList.add("success-message");
      showRomanticPop();
      createFireworkShow();
      createKissEffect();

      for (let index = 0; index < 12; index += 1) {
        createLoveBurst(window.innerWidth / 2, window.innerHeight / 2, index);
      }
      return;
    }

    if (button.dataset.answer === "romantic") {
      quizMessage.textContent = "I am more romantic than that.";
      quizMessage.classList.add("success-message");
      showMessagePop("I am more romantic than that");

      for (let index = 0; index < 12; index += 1) {
        createLoveBurst(window.innerWidth / 2, window.innerHeight / 2, index);
      }
      return;
    }

    quizMessage.textContent = "Fireworks for this cute wrong answer.";
    quizMessage.classList.remove("success-message");
    createFireworkShow();
  });
});

function setupScratchCard() {
  if (!scratchCanvas) {
    return;
  }

  const context = scratchCanvas.getContext("2d");

  function paintCover() {
    const { width, height } = scratchCanvas;
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f7c1d1");
    gradient.addColorStop(0.45, "#ef6f9a");
    gradient.addColorStop(1, "#f9d66f");

    context.globalCompositeOperation = "source-over";
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(255, 255, 255, 0.9)";
    context.font = "700 28px Inter, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("scratch here", width / 2, height / 2);
  }

  function scratchAt(event) {
    const box = scratchCanvas.getBoundingClientRect();
    const scaleX = scratchCanvas.width / box.width;
    const scaleY = scratchCanvas.height / box.height;
    const x = (event.clientX - box.left) * scaleX;
    const y = (event.clientY - box.top) * scaleY;

    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, 28, 0, Math.PI * 2);
    context.fill();

    scratchCount += 1;
    if (scratchCount > 18) {
      scratchMessage.textContent = "Surprise revealed. Tiny masterpiece behavior.";
      scratchMessage.classList.add("success-message");
    }
  }

  scratchCanvas.addEventListener("pointerdown", (event) => {
    isScratching = true;
    scratchCanvas.setPointerCapture(event.pointerId);
    scratchAt(event);
  });

  scratchCanvas.addEventListener("pointermove", (event) => {
    if (isScratching) {
      scratchAt(event);
    }
  });

  scratchCanvas.addEventListener("pointerup", () => {
    isScratching = false;
  });

  scratchCanvas.addEventListener("pointercancel", () => {
    isScratching = false;
  });

  paintCover();
}

unlockForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (passwordInput.value.trim().toLowerCase() === unlockPassword) {
    letter.hidden = false;
    unlockForm.hidden = true;
    errorMessage.textContent = "";
    letter.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  errorMessage.textContent = "Not this one. Try something closer to her heart.";
  passwordInput.select();
});

updateCountdown();
setInterval(updateCountdown, 1000);
updateLoveMeter();
renderPhotoGallery();
setupScratchCard();
