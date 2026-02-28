import { useState, useEffect } from "react";

function App() {
  const today = new Date().toISOString().split("T")[0];

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState(0);
  const [consumed, setConsumed] = useState(0);
  const [history, setHistory] = useState<{ [key: string]: number }>({});

  // Carregar dados
  useEffect(() => {
    const savedData = localStorage.getItem("aquaHoraData");
    const savedHistory = localStorage.getItem("aquaHoraHistory");

    if (savedData) {
      const data = JSON.parse(savedData);
      setName(data.name);
      setWeight(data.weight);
      setGoal(data.goal);
      setStep(2);
    }

    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      setConsumed(parsedHistory[today] || 0);
    }
  }, []);

  // Salvar histórico
  useEffect(() => {
    if (step === 2) {
      const updatedHistory = {
        ...history,
        [today]: consumed,
      };

      setHistory(updatedHistory);
      localStorage.setItem("aquaHoraHistory", JSON.stringify(updatedHistory));
      localStorage.setItem(
        "aquaHoraData",
        JSON.stringify({ name, weight, goal })
      );
    }
  }, [consumed]);

  function handleNext() {
    if (name.trim() === "" || weight === "") {
      alert("Preencha seu nome e peso 😉");
      return;
    }

    const calculatedGoal = (Number(weight) * 35) / 1000;
    setGoal(calculatedGoal);
    setStep(2);
  }

  function drinkWater() {
    setConsumed((prev) => prev + 0.25);
  }

  const progress = goal > 0 ? (consumed / goal) * 100 : 0;

  if (step === 2) {
    return (
      <div className="app-container">
        <h1>Olá, {name}! 💧</h1>
        <p>Meta diária: {goal.toFixed(2)}L</p>

        <div style={{ margin: "20px 0" }}>
          <div
            style={{
              height: "20px",
              background: "#eee",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#4facfe",
                transition: "0.3s",
              }}
            />
          </div>
          <p style={{ marginTop: "10px" }}>
            {consumed.toFixed(2)}L consumidos hoje
          </p>
        </div>

        <button onClick={drinkWater}>
          Bebi 250ml 💧
        </button>

        <h2 style={{ marginTop: "30px" }}>📊 Histórico (últimos dias)</h2>
        <ul style={{ marginTop: "10px", fontSize: "14px" }}>
          {Object.entries(history)
            .slice(-7)
            .reverse()
            .map(([date, value]) => (
              <li key={date}>
                {date} → {value.toFixed(2)}L
              </li>
            ))}
        </ul>

        <button
          style={{ marginTop: "20px", background: "#ff6b6b" }}
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Resetar Tudo
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>AquaHora 💧</h1>
      <p>Configure seu perfil de hidratação.</p>

      <label>Seu nome</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Seu peso (kg)</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button onClick={handleNext}>
        Calcular Meta
      </button>
    </div>
  );
}

export default App;    }

    const calculatedGoal = (Number(weight) * 35) / 1000;
    setGoal(calculatedGoal);
    setStep(2);
  }

  function drinkWater() {
    setConsumed((prev) => prev + 0.25);
  }

  const progress = goal > 0 ? (consumed / goal) * 100 : 0;

  if (step === 2) {
    return (
      <div className="app-container">
        <h1>Olá, {name}! 💧</h1>
        <p>Meta diária: {goal.toFixed(2)}L</p>

        <div style={{ margin: "20px 0" }}>
          <div
            style={{
              height: "20px",
              background: "#eee",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#4facfe",
                transition: "0.3s",
              }}
            />
          </div>
          <p style={{ marginTop: "10px" }}>
            {consumed.toFixed(2)}L consumidos
          </p>
        </div>

        <button onClick={drinkWater}>
          Bebi 250ml 💧
        </button>

        <button
          style={{ marginTop: "10px", background: "#ff6b6b" }}
          onClick={() => {
            localStorage.removeItem("aquaHoraData");
            window.location.reload();
          }}
        >
          Resetar
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>AquaHora 💧</h1>
      <p>Configure seu perfil de hidratação.</p>

      <label>Seu nome</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Seu peso (kg)</label>
      <input
        type="number"
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
