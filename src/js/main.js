document.addEventListener("DOMContentLoaded", function () {
  // *** Плавный скролл до якоря с учетом фикс.меню ***
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      let href = this.getAttribute("href").substring(1);

      const scrollTarget = document.getElementById(href);
      const topOffset = document.querySelector(".header").offsetHeight;
      const elementPosition = scrollTarget.getBoundingClientRect().top;
      const offsetPosition = elementPosition - topOffset;

      window.scrollBy({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });

  // *** Slider ***
  const prev = document.querySelector("#prev");
  const next = document.querySelector("#next");
  const sliderItems = document.querySelectorAll(".slider__item");

  let i = 0;
  prev.addEventListener("click", function () {
    sliderItems[i].classList.add("hidden");
    i--;

    if (i < 0) {
      i = sliderItems.length - 1;
    }

    sliderItems[i].classList.remove("hidden");
  });

  next.addEventListener("click", function () {
    sliderItems[i].classList.add("hidden");
    i++;

    if (i >= sliderItems.length) {
      i = 0;
    }

    sliderItems[i].classList.remove("hidden");
  });

  // *** Валидация формы ***
  let reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const email = document.getElementById("contactEmail");
  const errorMessage = document.querySelector(".error-message");
  const successMessage = document.querySelector(".success-message");
  const btn = document.getElementById("contact__btn");
  const form = document.querySelector(".form");

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!reg.test(email.value)) {
      setError(email);
    } else {
      setSuccess(email);
    }
  });

  function setError() {
    email.classList.remove("success");
    email.classList.add("error");
    errorMessage.innerHTML = "Enter your email!";
    successMessage.innerHTML = "";
  }

  function setSuccess() {
    email.classList.remove("error");
    email.classList.add("success");
    successMessage.innerHTML = "Thank you for contacting us!";
    errorMessage.innerHTML = "";
    form.reset();
  }

});
