import { useState } from "react";

function App() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");

  function handleNext() {
    if (name.trim() === "") {
      alert("Digite seu nome primeiro 😉");
      return;
    }
    setStep(2);
  }

  if (step === 2) {
    return (
      <div className="app-container">
        <h1>Bem-vindo, {name}! 💧</h1>
        <p>Sua meta diária recomendada é 2.5 litros de água.</p>

        <button onClick={() => setStep(1)}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>AquaHora 💧</h1>
      <p>Vamos configurar seu perfil de hidratação.</p>

      <label>Idioma</label>
      <select>
        <option>Português</option>
        <option>English</option>
      </select>

      <label>Como devemos te chamar?</label>
      <input
        type="text"
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleNext}>
        Próximo
      </button>
    </div>
  );
}

export default App;
