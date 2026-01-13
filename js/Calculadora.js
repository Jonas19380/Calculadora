const texto = document.getElementById("textoDaCalculadora");
const botoes = document.querySelectorAll("[data-valor]");
const botaoC = document.getElementById("C");
const som = document.getElementById("clickSom")
const backspace = document.getElementById("backspace");
const btnMute = document.getElementById("mute")
const btnModo = document.getElementById("modoEscuro");
let emErro = false;
let mute = false;

// função para atualizar o texto
function atualizarTela() {
  if (emErro) return;
  texto.innerText = conta || "Faça uma conta.";
  texto.style.fontStyle = conta ? "normal" : "italic"
}

function mostrarErro() {
  texto.innerText = "Erro";
  texto.style.fontStyle = "normal";

  emErro = true;
  conta = "";

  texto.classList.remove("pulse");
  texto.classList.remove("erro");

  requestAnimationFrame(() => {
    texto.classList.add("erro");
  });
}

backspace.addEventListener("click", () => {
  tocarSom();

if (emErro) {
    emErro = false;
    conta = "";

    texto.classList.remove("erro");
    texto.style.fontStyle = "italic";
    texto.innerText = "Faça uma conta.";

    return;
}
  
  conta = conta.trimEnd();

  conta = conta.slice(0, -1);

  ultimoFoiOperador = /[+\-x÷]\s?$/.test(conta);

  texto.classList.remove("pulse");
  requestAnimationFrame(() => {
  texto.classList.add("pulse");
  });

  atualizarTela();
});

function tocarSom() {
  if (mute) return;
  som.currentTime = 0;
  som.play()
};

btnMute.addEventListener("click", () => {
  tocarSom()
  mute = !mute;
  btnMute.textContent = mute ? "🔇" : "🔊";
});

let conta = "";
let ultimoFoiOperador = false;

botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    tocarSom()
    let valor = botao.dataset.valor;
// se estiver em erro
if (emErro) {
  // se apertar número ou ponto, começa nova conta
  if (!isNaN(valor) || valor === ".") {
    emErro = false;
    texto.classList.remove("erro"); // 👈 IMPORTANTE
    conta = valor;
    atualizarTela();
  }
  return;
}
    
    // porcentagem
    if (valor === "%") {
      if (conta === "") return;

        // pega o último número da expressão
        conta = conta.replace(/(\d+\.?\d*)$/, (match) => {
        return (Number(match) / 100).toString();
  });

  atualizarTela();
  return;
}

    // botão =
    if (valor === "=") {
      try {
        // converte x e ÷ para JS
        let expressao = conta
          .replace(/x/g, "*")
          .replace(/÷/g, "/");

        if (expressao === "") return;

        let resultado = Function("return " + expressao)();
        conta = resultado.toString();
        atualizarTela();
      } catch {
        mostrarErro()
      }
      return;
    }

    // operadores
    if (["+", "-", "x", "÷"].includes(valor)) {
      if (conta === "" || ultimoFoiOperador) return;
      conta += " " + valor + " ";
      ultimoFoiOperador = true;
    } 
    // números e ponto
    else {
      conta += valor;
      ultimoFoiOperador = false;
    }

    atualizarTela();
  });
});

botaoC.addEventListener("click", () => {
  tocarSom();
  conta = "";
  emErro = false;
  texto.classList.remove("erro");

  texto.classList.remove("pulse");
  requestAnimationFrame(() => {
    texto.classList.add("pulse");
  });

  atualizarTela();
});

btnModo.addEventListener("click", () => {
  tocarSom()
  document.body.classList.toggle("dark");
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
