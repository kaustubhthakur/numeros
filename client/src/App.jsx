import React from 'react'
import HomePage from './pages/homepage/HomePage'
import WalletInteraction from './components/walletinteraction/WalletInteraction'
import BettingGame from './components/bettinggame/BettingGame'

const App = () => {
  return (
    <div>
      <HomePage/>
      <WalletInteraction/>
      <BettingGame/>
    </div>
  )
}

export default App