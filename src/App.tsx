import { useState } from "react";

function App() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState(0);

  function handleNext() {
    if (name.trim() === "" || weight === "") {
      alert("Preencha seu nome e peso 😉");
      return;
    }

    const calculatedGoal = (Number(weight) * 35) / 1000;
    setGoal(calculatedGoal);
    setStep(2);
  }

  if (step === 2) {
    return (
      <div className="app-container">
        <h1>Bem-vindo, {name}! 💧</h1>
        <p>
          Com {weight}kg, sua meta diária recomendada é:
        </p>
        <h2>{goal.toFixed(2)} Litros</h2>

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

      <label>Como devemos te chamar?</label>
      <input
        type="text"
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Qual seu peso (kg)?</label>
      <input
        type="number"
        placeholder="Ex: 70"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button onClick={handleNext}>
        Calcular Meta
      </button>
    </div>
  );
}

export default App;
