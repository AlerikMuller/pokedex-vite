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
function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
      .then(res => res.json())
      .then(data => setPokemonList(data.results));
  }, [offset]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mini Pokédex</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pokemonList.map(pokemon => (
          <Link to={`/pokemon/${pokemon.name}`} key={pokemon.name} className="border p-4 rounded shadow hover:bg-gray-100">
            {capitalize(pokemon.name)}
          </Link>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setOffset(prev => Math.max(prev - 20, 0))}
          disabled={offset === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={() => setOffset(prev => prev + 20)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
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
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">About This Pokédex</h1>
      <p>This is a Pokédex application built with React and Vite, using data from a site called "PokéAPI".</p>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default App;