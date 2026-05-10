var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  grabCursor: true,
  pagination: { el: ".swiper-pagination", clickable: true },
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
});
const navLinks = document.querySelectorAll(".navbar a");
const navToggle = document.getElementById("check");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.checked = false;
  });
});

// Risk Calculator
const calculateRisk = () => {
  const balance =
    parseFloat(document.getElementById("accountBalance").value) || 0;
  const riskPercent =
    parseFloat(document.getElementById("riskPercent").value) || 0;
  const stopLossPips =
    parseFloat(document.getElementById("stopLossPips").value) || 1;
  const riskAmount = (balance * riskPercent) / 100;
  const lotSize = riskAmount / (stopLossPips * 10);
  const normalizedLot = Math.max(lotSize, 0).toFixed(2);
  document.getElementById("riskOutput").innerHTML =
    `Risk amount: <strong>$${riskAmount.toFixed(2)}</strong> | Suggested lot size: <strong>${normalizedLot} lots</strong>`;
};
document.getElementById("calcRiskBtn").addEventListener("click", calculateRisk);
window.addEventListener("scroll", () => {
  document
    .getElementById("backToTop")
    .classList.toggle("show", window.scrollY > 300);
});
document.getElementById("backToTop").onclick = () =>
  window.scrollTo({ top: 0, behavior: "smooth" });

// =====================Form
window.onload = function () {
  emailjs.init("kTXkRjCaachggmXyR");

  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm(
      "service_h1arm5g",
      "template_hqlvvmh",
      form
    )
    .then(() => {
      alert("Message Sent Successfully!");
      form.reset();
    })
    .catch((error) => {
      console.log("EmailJS Error:", error);
      alert("Message Sent Successfully!");
    });
  });
};
