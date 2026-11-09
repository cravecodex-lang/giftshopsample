import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WriteReviewPage from './pages/WriteReviewPage';
import GiftIntro from './components/GiftIntro';

function App() {
  const [siteRevealed, setSiteRevealed] = useState(false);

  return (
    <BrowserRouter>
      <GiftIntro onReveal={setSiteRevealed} />
      <div className={`gift-site${siteRevealed ? ' gift-site--revealed' : ''}`}>
        <Routes>
          <Route path="/write-review" element={<WriteReviewPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
