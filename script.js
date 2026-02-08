// Navigation scroll effect
const nav = document.getElementById("nav");
let lastScroll = 0;

window.addEventListener(
  "scroll",
  () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
    lastScroll = currentScroll;
  },
  { passive: true }
);

// Scroll reveal with Intersection Observer
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

// Smooth parallax on scroll for hero grid
const heroGrid = document.querySelector(".hero-grid");
window.addEventListener(
  "scroll",
  () => {
    if (heroGrid) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      heroGrid.style.transform = `perspective(500px) rotateX(25deg) translateY(${rate}px)`;
    }
  },
  { passive: true }
);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ====== Google Analytics 4 イベント ======
function sendGAEvent(eventName, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
}

// CTAクリック計測（アンカーリンク: お問い合わせ・体験内容を見る など）
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function () {
    let location = "other";
    if (this.closest("nav")) location = "nav";
    else if (this.closest(".hero"))
      location = this.classList.contains("btn-primary")
        ? "hero_apply"
        : "hero_experience";
    sendGAEvent("click_cta", { location, label: this.textContent.trim() });
  });
});

// お問い合わせフォーム（Googleフォーム）クリック = コンバージョン
const contactFormLink = document.querySelector(
  'a[href*="docs.google.com/forms"]'
);
if (contactFormLink) {
  contactFormLink.addEventListener("click", function () {
    sendGAEvent("outbound_contact_form");
    sendGAEvent("click_cta", {
      location: "contact",
      label: this.textContent.trim(),
    });
  });
}

// お問い合わせセクションが画面に入った（1回だけ）
const contactSection = document.getElementById("contact");
if (contactSection) {
  let contactViewed = false;
  const contactObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !contactViewed) {
          contactViewed = true;
          sendGAEvent("view_section_contact");
        }
      });
    },
    { threshold: 0.2 }
  );
  contactObserver.observe(contactSection);
}
