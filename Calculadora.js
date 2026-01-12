const texto = document.getElementById("textoDaCalculadora");
const botoes = document.querySelectorAll("[data-valor]");
const botaoC = document.getElementById("C");

const som = document.getElementById("clickSom")

function tocarSom() {
  som.currentTime = 0;
  som.play()
};

let conta = "";
let ultimoFoiOperador = false;

// função para atualizar o texto
function atualizarTela() {
  texto.innerText = conta || "Faça uma conta.";

  texto.classList.remove("pulse");
  requestAnimationFrame(() => {
  texto.classList.add("pulse");
  });
}

botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    tocarSom()
    let valor = botao.dataset.valor;

    // ignora vírgula
    if (valor === ",") return;

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
        conta = "Faz a conta direeeeeeeito";
        atualizarTela();
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

// botão C
botaoC.addEventListener("click", () => {
  tocarSom()
  conta = "";
  atualizarTela();
  
});

const btnModo = document.getElementById("modoEscuro");

btnModo.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
