import React from 'react';
import { Logo, LogoSize } from './components/Logo'
import './css/main.css';
import { IconContext } from 'react-icons';
import { FiUser } from 'react-icons/fi'

function Header() {
  return (
    <div className="flex flex-row justify-between">
      <div className="justify-start flex-grow-0"><Logo /></div>
      <div className="order-last justify-end inline-block py-4 h-full mb-auto mt-auto"><FiUser size={30} /></div>
    </div>
  )
}

function App() {
  return (
    <div className="px-6">
      <Header />
      <div className="mr-auto ml-auto xl:max-w-screen-xl md:max-w-4xl p-4 m-4 bg-green-300 h-full">
        <h2 className="text-green-900">Have much fun using Tailwind CSS</h2>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">My Tailwind Button</button>
      </div>
    </div>
  );
}

export default App;
