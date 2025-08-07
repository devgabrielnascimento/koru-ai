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
function paste() {
  navigator.clipboard
    .readText()
    .then((clipText) => {
      const keyInput = document.getElementById("openai-key");
      keyInput.value += clipText;
    })
    .catch((err) => {
      console.error("Erro ao ler clipboard:", err);
    });
}

btnPaste.addEventListener("click", paste);

function copy() {
  navigator.clipboard
    .writeText(answer.textContent)
    .then(() => {
      console.log("Texto copiado com sucesso!");
    })
    .catch((err) => {
      console.error("Erro ao copiar texto:", err);
    });
}

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

form.addEventListener("submit", function (event) {
  event.preventDefault();
});

formKey.addEventListener("submit", function (event) {
  event.preventDefault();
});

window.addEventListener("DOMContentLoaded", () => {
  const savedKey = localStorage.getItem("openai-key");
  if (savedKey) {
    document.getElementById("openai-key").value = savedKey;
  }
});

async function submitKey() {
  const apiKey = document.getElementById("openai-key").value.trim();
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
      //   localStorage.removeItem("openai-key", apiKey);
      //   throw new Error(`Chave inválida ou erro na API: status ${resp.status}`);
      // }
    } else if (resp.status === 403) {
      keyError.style.color = "white";
      keyError.textContent = "Campo obrigatório: Chave da OpenAI";
    } else if (resp.status === 200) {
      localStorage.setItem("openai-key", apiKey);
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

function enableMessage() {
  message.disabled = false;
  message.classList.add("hover-enabled");
  geminiButton.classList.add("hover-enabled-btn");
  loadingIcon.style.display = "none";
  geminiButton.disabled = false;
  geminiButton.removeAttribute("aria-disabled");
}


async function gemini(apiKey, userMessage) {
  // validação defensiva dentro da função também
  if (!apiKey || !apiKey.trim()) {
    answer.textContent = "Chave da API não encontrada. Salve primeiro.";
    return;
  }
  if (!userMessage || !userMessage.trim()) {
    answer.textContent = "Digite sua pergunta antes de enviar.";
    return;
  }
  answer.style.display = "flex";
  copyIcon.style.display = "flex";

  const sendIcon = document.querySelector(".send-icon");
  sendIcon.classList.remove("hover-enabled-icon");

  const message = document.getElementById("message");
  disableMessage();

  loadingIcon.style.display = "flex";


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
      text = data.contents[0].parts[0].text;
    } else if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = data.candidates[0].content.parts[0].text;
    }

    if (text) {
      const letras = text.split("");

      answer.innerHTML = "";

      let i = 0;

      const intervalo = setInterval(() => {
        answer.innerHTML += letras[i];
        i++;
        if (i < letras.length) {
          answer.scrollTop = answer.scrollHeight;
       disableMessage();
        }
        if (i >= letras.length) {
          clearInterval(intervalo);
         enableMessage();
          loadingIcon.style.display = "none";
          
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
  enableMessage();
    loadingIcon.style.display = "none";
  }
}

geminiButton.addEventListener("click", () => {
  answer.style.display = "flex";
  loadingIcon.style.display = "flex";
  question.style.display = "none";

  const apiKey = (localStorage.getItem("openai-key") || "").trim();
  const userMessage = document.getElementById("message").value.trim();
  gemini(apiKey, userMessage);
});
