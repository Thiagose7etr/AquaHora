import { useEffect, useState } from "react";

type Dia = {
  data: string;
  quantidade: number;
};

export default function App() {
  const hoje = new Date().toISOString().split("T")[0];

  const [nome, setNome] = useState<string>("");
  const [peso, setPeso] = useState<number>(0);
  const [meta, setMeta] = useState<number>(2000);
  const [quantidade, setQuantidade] = useState<number>(0);
  const [historico, setHistorico] = useState<Dia[]>([]);
  const [logado, setLogado] = useState<boolean>(false);

  // 🔹 Carregar dados
  useEffect(() => {
    const nomeSalvo = localStorage.getItem("nome");
    const pesoSalvo = localStorage.getItem("peso");
    const aguaSalva = localStorage.getItem("aguaHoje");
    const historicoSalvo = localStorage.getItem("historicoAgua");

    if (nomeSalvo && pesoSalvo) {
      setNome(nomeSalvo);
      setPeso(Number(pesoSalvo));
      setMeta(Number(pesoSalvo) * 35);
      setLogado(true);
    }

    if (aguaSalva) setQuantidade(Number(aguaSalva));
    if (historicoSalvo) setHistorico(JSON.parse(historicoSalvo));
  }, []);

  // 🔹 Salvar dados
  useEffect(() => {
    localStorage.setItem("aguaHoje", quantidade.toString());
  }, [quantidade]);

  useEffect(() => {
    localStorage.setItem("historicoAgua", JSON.stringify(historico));
  }, [historico]);

  const salvarCadastro = () => {
    if (!nome || !peso) return;

    localStorage.setItem("nome", nome);
    localStorage.setItem("peso", peso.toString());

    setMeta(peso * 35);
    setLogado(true);
  };

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

  // 🔔 Notificação automática
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

  // 🔹 TELA DE CADASTRO
  if (!logado) {
    return (
      <div style={{ padding: 20 }}>
        <h1>💧 AquaHora</h1>
        <h2>Cadastro</h2>

        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          placeholder="Seu peso (kg)"
          value={peso}
          onChange={(e) => setPeso(Number(e.target.value))}
        />
        <br /><br />

        <button onClick={salvarCadastro}>Salvar</button>
      </div>
    );
  }

  // 🔹 TELA PRINCIPAL
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>💧 Olá, {nome}</h1>

      <p>Meta diária: {meta} ml</p>
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

      <button onClick={beberAgua}>💧 Bebi 250ml</button>

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
