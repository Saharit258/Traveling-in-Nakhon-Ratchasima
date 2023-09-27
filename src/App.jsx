import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './pagecss/App.css'
import { Link } from 'react-router-dom'
import Nav from './navigation/Nav'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Nav />
    </>
  )
}

export default App
