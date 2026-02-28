import { useEffect, useState } from "react";

type Dia = {
  data: string;
  quantidade: number;
};

export default function App() {
  const meta = 2000;
  const hoje = new Date().toISOString().split("T")[0];

  const [quantidade, setQuantidade] = useState<number>(0);
  const [historico, setHistorico] = useState<Dia[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem("aguaHoje");
    const historicoSalvo = localStorage.getItem("historicoAgua");

    if (salvo) setQuantidade(Number(salvo));
    if (historicoSalvo) setHistorico(JSON.parse(historicoSalvo));
  }, []);

  useEffect(() => {
    localStorage.setItem("aguaHoje", quantidade.toString());
  }, [quantidade]);

  useEffect(() => {
    localStorage.setItem("historicoAgua", JSON.stringify(historico));
  }, [historico]);

  const beberAgua = () => {
    const novaQuantidade = quantidade + 250;
    setQuantidade(novaQuantidade);

    const existe = historico.find((d) => d.data === hoje);

    if (existe) {
      const atualizado = historico.map((d) =>
        d.data === hoje ? { ...d, quantidade: novaQuantidade } : d
      );
      setHistorico(atualizado);
    } else {
      setHistorico([...historico, { data: hoje, quantidade: 250 }]);
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const intervalo = setInterval(() => {
      if (Notification.permission === "granted") {
        new Notification("💧 Hora de beber água!");
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(intervalo);
  }, []);

  const porcentagem = (quantidade / meta) * 100;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>💧 Controle de Água</h1>

      <h2>{quantidade} ml</h2>

      <div
        style={{
          width: "100%",
          height: 30,
          backgroundColor: "#eee",
          borderRadius: 10,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: `${porcentagem}%`,
            height: "100%",
            backgroundColor: "green",
          }}
        />
      </div>

      <button onClick={beberAgua} style={{ padding: 10 }}>
        💧 Bebi 250ml
      </button>

      <h2 style={{ marginTop: 40 }}>📊 Histórico Semanal</h2>

      {historico.slice(-7).map((dia) => (
        <div key={dia.data} style={{ marginBottom: 10 }}>
          <strong>{dia.data}</strong>
          <div
            style={{
              width: "100%",
              height: 20,
              backgroundColor: "#ddd",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(dia.quantidade / meta) * 100}%`,
                height: "100%",
                backgroundColor: "#4caf50",
              }}
            />
          </div>
          <small>{dia.quantidade} ml</small>
        </div>
      ))}
    </div>
  );
}
