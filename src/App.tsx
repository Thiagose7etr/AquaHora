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

  // 🔹 Carregar dados salvos
  useEffect(() => {
    const salvo = localStorage.getItem("aguaHoje");
    const historicoSalvo = localStorage.getItem("historicoAgua");

    if (salvo) setQuantidade(Number(salvo));
    if (historicoSalvo) setHistorico(JSON.parse(historicoSalvo));
  }, []);

  // 🔹 Salvar no navegador
  useEffect(() => {
    localStorage.setItem("aguaHoje", quantidade.toString());
  }, [quantidade]);

  useEffect(() => {
    localStorage.setItem("historicoAgua", JSON.stringify(historico));
  }, [historico]);

  // 🔹 Adicionar 250ml
  const beberAgua = () => {
    const novaQuantidade = quantidade + 250;
    setQuantidade(novaQuantidade);

    const existe = historico.find(( 
