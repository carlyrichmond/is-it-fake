/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
import "./App.css";
import Header from "./components/header/Header";
import Hero from "./components/hero/Hero";
import Rules from "./components/rules/Rules";

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Hero />
      <Rules />
    </>
  );
}

export default App;
