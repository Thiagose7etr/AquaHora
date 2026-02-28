function App() {
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
      <input type="text" placeholder="Seu nome" />

      <button>Próximo</button>
    </div>
  );
}

export default App;
