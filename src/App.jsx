import { Link, Outlet, useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex justify-center gap-4">
        <Link to="/" className="font-bold">Pokedex</Link>
        <Link to="/about" className="font-bold">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/about" element={<About />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
}

function getCardColor(id) {
  if ([1, 2, 3, 10, 11, 12].includes(id)) return '#8bd674'; // green
  if ([4, 5, 6].includes(id)) return '#f5ac78'; // orange
  if ([7, 8, 9].includes(id)) return '#9db7f5'; // blue
  return '#eee';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset}`)
      .then(res => res.json())
      .then(data => {
        Promise.all(data.results.map(p =>
          fetch(p.url).then(res => res.json())
        )).then(setPokemonList);
      });
  }, [offset]);

  return (
    <div className="pokedex-container">
      <div className="pokemon-grid">
        {pokemonList.map((pokemon, index) => (
          <div
            key={pokemon.id}
            className="pokemon-card"
            style={{ backgroundColor: getCardColor(pokemon.id) }}
          >
            <div className="pokemon-id">#{pokemon.id}</div>
            <h2 className="pokemon-name">{capitalize(pokemon.name)}</h2>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setOffset(Math.max(0, offset - 12))}>Previous</button>
        <button onClick={() => setOffset(offset + 12)}>Next</button>
      </div>
    </div>
  );
}

function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(res => res.json())
      .then(data => setPokemon(data));
  }, [name]);

  if (!pokemon) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4 bg-gray-300 px-4 py-2 rounded">Return</button>
      <h2 className="text-2xl font-bold mb-4">{capitalize(pokemon.name)}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} className="mx-auto mb-4" />
      <p><strong>Type(s):</strong> {pokemon.types.map(t => t.type.name).join(", ")}</p>
      <p><strong>Height:</strong> {pokemon.height}</p>
      <p><strong>Weight:</strong> {pokemon.weight}</p>
      <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(", ")}</p>
      <p className="mt-4 font-bold">Stats:</p>
      <ul className="list-disc list-inside">
        {pokemon.stats.map(stat => (
          <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
        ))}
      </ul>
    </div>
  );
}

function About() {
  return <div className="p-4">This is the About page.</div>;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function PokemonDetail() {
  return <div className="p-4">Detailed Pokémon view placeholder.</div>;
}

export default App;