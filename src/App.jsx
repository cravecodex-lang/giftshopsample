import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GiftIntro from './components/GiftIntro';

function App() {
  const [siteRevealed, setSiteRevealed] = useState(false);

  return (
    <BrowserRouter>
      <GiftIntro onReveal={setSiteRevealed} />
      <div className={`gift-site${siteRevealed ? ' gift-site--revealed' : ''}`}>
        <HomePage />
      </div>
    </BrowserRouter>
  );
}

export default App;
