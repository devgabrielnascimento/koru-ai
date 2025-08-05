/* Clipboard*/

const btnPaste = document.querySelector(".paste-icon");
    function paste() {
    navigator.clipboard
      .readText()
      .then(
        (clipText) => (document.getElementById("openai-key").value += clipText)
      );
}


btnPaste.addEventListener("click", paste);

/* Em breve mais implementações serão adicionadas*/