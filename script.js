const btnPaste = document.querySelector(".paste-icon");
const geminiButton = document.querySelector("#gemini-button");
const submitButton = document.querySelector("#submit-key");
const form = document.querySelector("#gemini-form");
const formKey = document.querySelector("#key-form");
const keyError = document.querySelector("#key-error");
const answer = document.querySelector(".answer");
const question = document.querySelector("#question");
const loadingIcon = document.querySelector(".loading");
const copyIcon = document.querySelector("#copy-icon");
const message = document.querySelector("#message");
const clearIcon = document.querySelector("#clear-button");
const historyArray = [];
const historyIcon = document.querySelector("#history-icon");
const customAlert = document.querySelector("#custom-alert");
const askAnything = document.querySelector(".askAnything");
const closeButton = document.querySelector("#close-button");
const historyItems = document.querySelector("#history-items");
const buttonsArea = document.querySelector(".buttons-textarea");
const checkIcon = document.querySelector("#check-icon");
const errors = document.querySelector("#errors");
function closeVerifiedMessage() {
  customAlert.style.display = "none";
  askAnything.style.display = "flex";
}

closeButton.addEventListener("click", closeVerifiedMessage);

function paste() {
  navigator.clipboard
    .readText()
    .then((clipText) => {
      const keyInput = document.getElementById("gemini-key");
      keyInput.value += clipText;
    })
    .catch((err) => {
      console.error("Erro ao ler clipboard:", err);
    });
}
function copy() {
  navigator.clipboard
    .writeText(answer.textContent)
    .then(() => {
      console.log("Texto copiado com sucesso!");
    })
    .catch((err) => {
      console.error("Erro ao copiar o texto:", err);
    });
}
window.addEventListener("DOMContentLoaded", () => {
  const sun = document.querySelector(".theme-display-sun");
  const moon = document.querySelector(".theme-display-moon");
  const body = document.querySelector("body");
  let theme = localStorage.getItem("theme");

  function applyTheme() {
    if (theme === "dark") {
      sun.style.display = "none";
      moon.style.display = "flex";
      body.style.background = "#222222";
      menu.style.background = "#222222";
    } else {
      sun.style.display = "flex";
      moon.style.display = "none";
      body.style.background = `linear-gradient(
        to bottom,
        #b621ff 0%,
        #8a21c1 8%,
        #5d1189 50%,
        #222222 93%
      )`;
      menu.style.background = `linear-gradient(
        to bottom,
        #b621ff 0%,
        #8a21c1 8%,
        #5d1189 50%,
        #222222 93%
      )`;
    }
  }

  function saveTheme() {
    localStorage.setItem("theme", theme);
  }

  function themeChanger() {
    theme = theme === "light" ? "dark" : "light";
    applyTheme();
    saveTheme();
  }

  sun.addEventListener("click", themeChanger);
  moon.addEventListener("click", themeChanger);

  applyTheme();
});

copyIcon.addEventListener("click", copy);
function updateButtonState(isEmpty) {
  if (isEmpty === true) {
    geminiButton.disabled = true;
    geminiButton.setAttribute("aria-disabled", "true");
    geminiButton.classList.remove("hover-enabled-btn");
  } else if (isEmpty === false) {
    geminiButton.disabled = false;
    geminiButton.removeAttribute("aria-disabled");
    geminiButton.classList.add("hover-enabled-btn");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  updateButtonState(true);
  message.addEventListener("input", () => {
    updateButtonState(message.value.trim() === "");
  });
});

document.addEventListener("input", function (event) {
  if (event.target.classList.contains("TxtObservations")) {
    const limite = 500;
    if (event.target.value.length >= limite) {
      event.target.value = event.target.value.slice(0, limite);
    }
    const caracteresDigitados = event.target.value.length;
    const caracteresRestantes = limite - caracteresDigitados;

    const span = document.querySelector(".caracteres");
    if (span) {
      span.textContent = caracteresRestantes + "/" + limite;
    }
    if (caracteresDigitados === 0) {
      span.style.color = "white";
      updateButtonState(true);
    } else if (
      limite - caracteresDigitados < 25 &&
      limite - caracteresDigitados > 0
    ) {
      span.style.color = "orange";
    
    } else if (limite === caracteresDigitados) {

      span.style.color = "red";
    } else if(message.value.trim() === "") {
      span.style.color = "white";
      updateButtonState(true);

    }else {
      span.style.color = "white";
      updateButtonState(false);
    }
  }
});

function cleanAnswer() {
  answer.style.display = "none";
  loadingIcon.style.display = "none";
  question.style.display = "flex";
  copyIcon.style.display = "none";
  checkIcon.style.display = "none";
}

clearIcon.addEventListener("click", cleanAnswer);

form.addEventListener("submit", function (event) {
  event.preventDefault();
});

formKey.addEventListener("submit", function (event) {
  event.preventDefault();
});

window.addEventListener("DOMContentLoaded", () => {
  const savedKey = localStorage.getItem("gemini-key");
  if (savedKey) {
    document.getElementById("gemini-key").value = savedKey;
  }
});

btnPaste.addEventListener("click", paste);

document
  .querySelectorAll(".buttons-textarea button")
  .forEach((btn) =>
    btn.addEventListener("mousedown", (e) => e.preventDefault())
  );

const menu = document.querySelector(".menu");

const btnMenu = document.getElementById("btn-menu");

async function submitKey() {
  const apiKey = document.getElementById("gemini-key").value.trim();
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "GET",
      }
    );

    if (resp.status === 429) {
      keyError.style.color = "orange";
      keyError.textContent =
        "Limite de chamadas atingido. Tente novamente mais tarde.";
    } else if (resp.status === 403) {
      keyError.style.color = "white";
      keyError.textContent = "Campo obrigatório: Chave da Gemini";
    } else if (resp.status === 200) {
      localStorage.setItem("gemini-key", apiKey);

      const sectionText = document.querySelector(".section-text");

      sectionText.style.display = "none";
      customAlert.style.display = "flex";
      dropdown.style.display = "flex";
      history.style.display = "flex";
    } else {
      keyError.style.color = "red";
      keyError.textContent = `Chave inválida ou erro na API: status ${resp.status}`;
    }
  } catch (error) {
    keyError.style.color = "red";
    keyError.textContent = "Erro ao validar chave: " + error.message;
  }
}

submitButton.addEventListener("click", submitKey);
function disableMessage() {
  message.value = "";
  message.disabled = true;
  message.classList.remove("hover-enabled");
  buttonsArea.style.pointerEvents = "none";
  form.classList.remove("hover-enabled-form");
  form.classList.remove("hover-enabled");
  buttonsArea.classList.remove("hover-enabled-textarea");
  geminiButton.classList.remove("hover-enabled-btn");
  loadingIcon.style.display = "flex";
  geminiButton.disabled = true;
  clearIcon.disabled = true;
  clearIcon.setAttribute("aria-disabled", "true");
  geminiButton.setAttribute("aria-disabled", "true");
}

const textarea = document.querySelector("textarea");

textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
});
function enableMessage() {
  message.disabled = false;
  message.classList.add("hover-enabled");
  buttonsArea.style.pointerEvents = "auto";
  form.classList.add("hover-enabled-form");
  form.classList.add("hover-enabled");
  buttonsArea.classList.add("hover-enabled-textarea");
  loadingIcon.style.display = "none";
  clearIcon.disabled = false;
  clearIcon.removeAttribute("aria-disabled");
  updateButtonState(message.value.trim() === "");
}

const history = document.querySelector(".history");

function toggleMenu() {
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
  } else {
    menu.classList.add("showMenu");
  }
}

history.addEventListener("click", toggleMenu);

function historyList(userMessage, answer) {
  let i = historyArray.length;
  const questionAnswerDiv = document.createElement("div");
  const userQuestion = document.createElement("p");
  const geminiAnswer = document.createElement("p");
  userQuestion.textContent = `Sua pergunta ${i}: ${userMessage}`;
  geminiAnswer.textContent = `Sua resposta ${i}: ${answer}`;
  questionAnswerDiv.append(userQuestion, geminiAnswer);
  historyItems.appendChild(questionAnswerDiv);
}

const dropdown = document.getElementById("modelDropdown");
const btn = dropdown.querySelector(".dropdown-btn");
const list = dropdown.querySelector(".dropdown-list");

btn.addEventListener("click", () => {
  dropdown.classList.toggle("open");
});

list.querySelectorAll("div").forEach((item) => {
  item.addEventListener("click", () => {
    btn.textContent = item.textContent;
    dropdown.classList.remove("open");
  });
});

window.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

async function modelList() {
  const apiKey = localStorage.getItem("gemini-key");
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
      apiKey
    )}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await resp.json();
  console.log(data);
  const list = document.getElementsByClassName("dropdown-list")[0];
  data.models.forEach((model) => {
    const div = document.createElement("div");
    div.setAttribute("data-model", model.name);
    div.textContent = model.name;
    list.appendChild(div);
    div.addEventListener("click", () => {
      chooseModel(model.name);
    });
  });
}

modelList();
let lastSelectedModel = null;
function chooseModel(selectedModel) {
  const apiKey = localStorage.getItem("gemini-key");
  const userMessage = document.getElementById("message").value.trim();
  lastSelectedModel = selectedModel;
  console.log("Modelo selecionado:", lastSelectedModel);
  if (!selectedModel) {
    alert("Escolha um modelo primeiro");
    return;
  }
  gemini(apiKey, userMessage, selectedModel);
}

async function gemini(apiKey, userMessage, modelName) {
  let intervalo;
  if (!apiKey || !apiKey.trim()) {
    answer.textContent = "Chave da API não encontrada. Salve primeiro.";
    return;
  }
  if (!userMessage || !userMessage.trim()) {
    answer.textContent = "Digite sua pergunta antes de enviar.";
    return;
  }

  answer.style.display = "flex";

  const sendIcon = document.querySelector(".send-icon");
  sendIcon.classList.remove("hover-enabled-icon");

  disableMessage();

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      throw new Error(`HTTP error! status: ${resp.status} ${errText}`);
    }

    const data = await resp.json();
    let text = null;
    if (data?.contents?.[0]?.parts?.[0]?.text) {
      text =
        "Sua pergunta: " +
        userMessage +
        "\n\n" +
        "Resposta" +
        "\n\n" +
        data.contents[0].parts[0].text;
    } else if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text =
        "Sua pergunta: " +
        userMessage +
        "\n\n" +
        "Resposta: " +
        "\n\n" +
        data.candidates[0].content.parts[0].text;
    }

    if (text) {
      document.querySelector(".answer").textContent = "";
      answer.style.whiteSpace = "pre-line";
      let i = 0;

      intervalo = setInterval(() => {
        answer.textContent += text[i];
        i++;
        answer.scrollTop = answer.scrollHeight;

        if (i >= text.length) {
          clearInterval(intervalo);
          enableMessage();
          loadingIcon.style.display = "none";
          historyArray.push({
            userMessage: userMessage,
            answer: data.candidates[0].content.parts[0].text,
          });
          historyList(userMessage, data.candidates[0].content.parts[0].text);

          setTimeout(() => {
            answer.scrollIntoView({ behavior: "smooth" });
            checkIcon.style.display = "block";
          }, 200);
        }
      }, 30);
    } else {
      console.warn("Resposta com formato inesperado:", data);
      answer.textContent = "Resposta inválida do servidor.";
    }
  } catch (err) {
    console.error(err);
    clearInterval(intervalo);
    errors.style.color = "red";
    errors.textContent =
      "Erro ao consultar a API: " +
      err.message.match(/HTTP error! status: (\d+)/)[1];
    if (err.message.match(/HTTP error! status: (\d+)/)[1] === "429") {
      errors.style.color = "orange";
      errors.textContent =
        "Limite de chamadas atingido. Tente novamente mais tarde.";
    } else {
      errors.style.color = "red";
      errors.textContent =
        "Erro ao consultar a API: " +
        err.message.match(/HTTP error! status: (\d+)/)[1];
    }
    enableMessage();
  } finally {
  }
}
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    answer.style.display = "flex";
    loadingIcon.style.display = "flex";
    question.style.display = "none";
    copyIcon.style.display = "flex";
    // if (!lastSelectedModel) {
    //   alert("Escolha um modelo primeiro");
    //   return;
    // }
    const apiKey = (localStorage.getItem("gemini-key") || "").trim();
    const userMessage = document.getElementById("message").value.trim();
    gemini(apiKey, userMessage);
    console.log("Enter foi pressionado!");
  }
});

geminiButton.addEventListener("click", () => {
  answer.style.display = "flex";
  loadingIcon.style.display = "flex";
  question.style.display = "none";
  copyIcon.style.display = "flex";
  // if (!lastSelectedModel) {
  //   alert("Escolha um modelo primeiro");
  //   return;
  // }
  const apiKey = (localStorage.getItem("gemini-key") || "").trim();
  const userMessage = document.getElementById("message").value.trim();
  gemini(apiKey, userMessage);
});
