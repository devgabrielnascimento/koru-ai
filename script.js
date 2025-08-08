const btnPaste = document.querySelector(".paste-icon");
const geminiButton = document.querySelector("#gemini-button");
const submitButton = document.querySelector("#submit-key");
const form = document.querySelector("#openai-form");
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
const sun = document.querySelector(".theme-display-sun");
const moon = document.querySelector(".theme-display-moon");
const body = document.querySelector("body");
function themeChanger() {
  if (sun.style.display === "flex") {
    sun.style.display = "none";
    moon.style.display = "flex";
    body.style.background = "#222222";
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
  }
}

sun.addEventListener("click", themeChanger);
moon.addEventListener("click", themeChanger);

copyIcon.addEventListener("click", copy);

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

    if (limite - caracteresDigitados < 25 && limite - caracteresDigitados > 0) {
      span.style.color = "orange";
      geminiButton.classList.add("hover-enabled-btn");
      geminiButton.disabled = false;
      geminiButton.removeAttribute("aria-disabled");
    } else if (limite === caracteresDigitados) {
      geminiButton.classList.remove("hover-enabled-btn");
      geminiButton.disabled = true;
      geminiButton.setAttribute("aria-disabled", "true");
      span.style.color = "red";
    } else {
      span.style.color = "white";
      geminiButton.classList.add("hover-enabled-btn");
      geminiButton.disabled = false;
      geminiButton.removeAttribute("aria-disabled");
    }
  }
});

function cleanAnswer() {
  answer.style.display = "none";
  loadingIcon.style.display = "none";
  question.style.display = "flex";
  copyIcon.style.display = "none";
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Teste de validação" }] }],
        }),
      }
    );

    if (resp.status === 429) {
      keyError.style.color = "orange";
      keyError.textContent =
        "Limite de chamadas atingido. Tente novamente mais tarde.";
      // } else if (resp.status === 200) {
      //   localStorage.removeItem("gemini-key", apiKey);
      //   throw new Error(`Chave inválida ou erro na API: status ${resp.status}`);
      // }
    } else if (resp.status === 403) {
      keyError.style.color = "white";
      keyError.textContent = "Campo obrigatório: Chave da Gemini";
    } else if (resp.status === 200) {
      console.log("Teste setTimeout funcionando");
      const keyInput = document.getElementById("gemini-key");
      keyInput.type = "text"; // mostra o texto para teste
      keyInput.value = "validado";
      keyInput.style.backgroundColor = "green";

      localStorage.setItem("gemini-key", apiKey);

      const sectionText = document.querySelector(".section-text");
      const askAnything = document.querySelector(".askAnything");
      sectionText.style.display = "none";
      askAnything.style.display = "flex";
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
  geminiButton.classList.remove("hover-enabled-btn");
  loadingIcon.style.display = "flex";
  geminiButton.disabled = true;
  geminiButton.setAttribute("aria-disabled", "true");
}

const textarea = document.querySelector("textarea");

textarea.addEventListener("input", () => {
  textarea.style.height = "auto"; //
  textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px"; //
});
function enableMessage() {
  message.disabled = false;
  message.classList.add("hover-enabled");
  geminiButton.classList.add("hover-enabled-btn");
  loadingIcon.style.display = "none";
  geminiButton.disabled = false;
  geminiButton.removeAttribute("aria-disabled");
}

const hamburger = document.querySelector(".hamburger");

function toggleMenu() {
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
  } else {
    menu.classList.add("showMenu");
  }
}

hamburger.addEventListener("click", toggleMenu);

function historyList() {
  historyArray.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `Pergunta: ${item.pergunta} - Resposta: ${item.resposta}`;
    menu.appendChild(li);
  });
}
const historico = document.getElementById("historico");
historico.addEventListener("click", historyList);

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

  const message = document.getElementById("message");
  message.value = "";
  message.disabled = true;
  message.classList.remove("hover-enabled");
  geminiButton.classList.remove("hover-enabled-btn");
  loadingIcon.style.display = "flex";
  geminiButton.disabled = true;
  geminiButton.setAttribute("aria-disabled", "true");

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
        data.contents[0].parts[0].text;
    } else if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      loadingIcon.style.display = "none";
      text =
        "Sua pergunta: " +
        userMessage +
        "\n\n" +
        data.candidates[0].content.parts[0].text;
    }

    if (text) {
      const letras = text.split("");

      document.querySelector(".answer").textContent = "";
      answer.style.whiteSpace = "pre-line";
      let i = 0;

      const intervalo = setInterval(() => {
        answer.innerHTML += letras[i];
        i++;
        if (i < letras.length) {
          disableMessage();
        }
        if (i >= letras.length) {
          clearInterval(intervalo);
          enableMessage();
          loadingIcon.style.display = "none";
          historyArray.push({ pergunta: userMessage, resposta: text });
          setTimeout(() => {
            answer.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }, 30);
    } else {
      console.warn("Resposta com formato inesperado:", data);
      answer.textContent = "Resposta inválida do servidor.";
    }
  } catch (err) {
    console.error(err);
    answer.textContent = "Erro ao consultar a API: " + (err.message || err);
  } finally {
    message.classList.add("hover-enabled");
    geminiButton.classList.add("hover-enabled-btn");
    sendIcon.classList.add("hover-enabled-icon");
    loadingIcon.style.display = "none";
    message.disabled = false;
    geminiButton.disabled = false;
    geminiButton.setAttribute("aria-disabled", "false");
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
    }});

    // aqui coloca o que quer executar no atalho
  
;
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
