'use strict';

const visitCountElement = document.querySelector("[data-visit-count]");

const VISIT_COUNTER_NAMESPACE = "zedourado-github-io";
const VISIT_COUNTER_KEY = "portfolio-home";
const VISIT_COUNTER_FALLBACK_KEY = "portfolio-home-fallback";
const VISIT_COUNTER_SESSION_KEY = "portfolio-home-session-incremented";

const fetchCounterValue = async function (url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(function () { controller.abort(); }, 7000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store"
    });

    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

    const data = await response.json();
    if (typeof data.value !== "number") throw new Error("Resposta inválida do contador");

    return data.value;
  } finally {
    clearTimeout(timeoutId);
  }
};

const updateVisitCounter = async function () {
  if (!visitCountElement) return;

  const endpoints = [
    `https://api.countapi.xyz/hit/${VISIT_COUNTER_NAMESPACE}/${VISIT_COUNTER_KEY}`,
    `https://countapi.xyz/hit/${VISIT_COUNTER_NAMESPACE}/${VISIT_COUNTER_KEY}`
  ];

  for (let i = 0; i < endpoints.length; i++) {
    try {
      const value = await fetchCounterValue(endpoints[i]);
      visitCountElement.textContent = value.toLocaleString("pt-BR");
      return;
    } catch (error) {
      console.warn("Falha ao consultar contador remoto:", endpoints[i], error);
    }
  }

  const sessionAlreadyIncremented = sessionStorage.getItem(VISIT_COUNTER_SESSION_KEY) === "1";
  const localCount = Number(localStorage.getItem(VISIT_COUNTER_FALLBACK_KEY) || "0");
  const fallbackCount = sessionAlreadyIncremented ? localCount : localCount + 1;

  if (!sessionAlreadyIncremented) {
    localStorage.setItem(VISIT_COUNTER_FALLBACK_KEY, String(fallbackCount));
    sessionStorage.setItem(VISIT_COUNTER_SESSION_KEY, "1");
  }

  visitCountElement.textContent = `${fallbackCount.toLocaleString("pt-BR")}*`;
  visitCountElement.title = "Contagem local exibida porque o serviço remoto não respondeu.";
};

updateVisitCounter();



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// portfolio case modal variables
const projectModalContainer = document.querySelector("[data-project-modal-container]");
const projectModalOverlay = document.querySelector("[data-project-modal-overlay]");
const projectModalCloseBtn = document.querySelector("[data-project-modal-close-btn]");
const projectModalTitle = document.querySelector("[data-project-modal-title]");
const projectModalDescription = document.querySelector("[data-project-modal-description]");
const projectModalGallery = document.querySelector("[data-project-modal-gallery]");
const projectOpenButtons = document.querySelectorAll("[data-project-open]");

const projectCases = {
  "case-psp": {
    title: "Case: Website com Painel Administrativo (PSP Química)",
    description: "Projeto focado em presença digital e autonomia editorial. Foi estruturado um painel para o time atualizar páginas, produtos e conteúdos institucionais sem depender de deploy técnico.",
    screenshots: ["./assets/images/index_psp.png", "./assets/images/pspquimica.webp"]
  },
  "case-ribeiro": {
    title: "Case: Manutenção e Evolução Contínua (Ribeiro Doces)",
    description: "Atuação contínua em ajustes visuais, atualização de catálogo e melhorias de performance. O foco foi manter o site estável, com ciclos curtos de entrega e correções rápidas em produção.",
    screenshots: ["./assets/images/index-ribeiro.png", "./assets/images/ribeiro.webp"]
  }
};

const toggleProjectModal = function (show) {
  projectModalContainer.classList.toggle("active", show);
};

const openProjectModal = function (caseId) {
  const caseData = projectCases[caseId];
  if (!caseData) return;

  projectModalTitle.textContent = caseData.title;
  projectModalDescription.textContent = caseData.description;
  projectModalGallery.innerHTML = caseData.screenshots.map((imagePath) => `<img src="${imagePath}" alt="Screenshot do projeto">`).join("");
  toggleProjectModal(true);
};

for (let i = 0; i < projectOpenButtons.length; i++) {
  projectOpenButtons[i].addEventListener("click", function (event) {
    event.preventDefault();
    openProjectModal(this.dataset.projectOpen);
  });
}

projectModalCloseBtn.addEventListener("click", function () { toggleProjectModal(false); });
projectModalOverlay.addEventListener("click", function () { toggleProjectModal(false); });


// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    const itemCategory = filterItems[i].dataset.category.toLowerCase();

    if (selectedValue === "all" || selectedValue === "todos") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === itemCategory) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formStatus = document.querySelector("[data-form-status]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!form.checkValidity()) return;

  formBtn.setAttribute("disabled", "");
  formBtn.querySelector("span").innerText = "Enviando...";

  if (formStatus) {
    formStatus.classList.remove("success", "error");
    formStatus.textContent = "Enviando sua mensagem...";
  }

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
        _subject: "Novo contato pelo portfólio",
        _template: "table",
        _captcha: "false"
      })
    });

    if (!response.ok) throw new Error("Falha no envio do formulário");

    form.reset();
    if (formStatus) {
      formStatus.classList.add("success");
      formStatus.textContent = "Mensagem enviada com sucesso! Em breve entrarei em contato.";
    }
  } catch (error) {
    if (formStatus) {
      formStatus.classList.add("error");
      formStatus.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
    }
  } finally {
    formBtn.querySelector("span").innerText = "Enviar Email!";
    formBtn.setAttribute("disabled", "");
  }
});



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const selectedPage = this.dataset.navTarget || this.innerText.toLowerCase();

    for (let i = 0; i < pages.length; i++) {
      if (selectedPage === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}
