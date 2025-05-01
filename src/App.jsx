import { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes, Link, useParams, useNavigate } from "react-router-dom";
import './App.css';

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
  const limit = 15;

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then(res => res.json())
      .then(data => {
        Promise.all(data.results.map(p => fetch(p.url).then(res => res.json())))
          .then(setPokemonList);
      });
  }, [offset]);

  return (
    <div className="pokedex-container">
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <Link to={`/pokemon/${pokemon.name}`} key={pokemon.id} className="pokemon-card" style={{ backgroundColor: getCardColor(pokemon.id) }}>
            <div className="pokemon-id">#{pokemon.id}</div>
            <h2 className="pokemon-name">{capitalize(pokemon.name)}</h2>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </Link>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setOffset(Math.max(0, offset - limit))}>Previous</button>
        <button onClick={() => setOffset(offset + limit)}>Next</button>
      </div>
    </div>
  );
}

function About() {
  return <div className="p-4">This is the About page. It provides information about the Pokédex project.</div>;
}

function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(res => res.json())
      .then(setPokemon);
  }, [name]);

  if (!pokemon) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="mb-4 underline text-blue-600">← Back</button>
      <h1 className="text-2xl font-bold">{capitalize(pokemon.name)} (#{pokemon.id})</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p><strong>Height:</strong> {pokemon.height}</p>
      <p><strong>Weight:</strong> {pokemon.weight}</p>
      <p><strong>Type(s):</strong> {pokemon.types.map(t => capitalize(t.type.name)).join(', ')}</p>
      <p><strong>Abilities:</strong> {pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ')}</p>
      <p><strong>Stats:</strong></p>
      <ul>
        {pokemon.stats.map(stat => (
          <li key={stat.stat.name}>
            {capitalize(stat.stat.name)}: {stat.base_stat}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;