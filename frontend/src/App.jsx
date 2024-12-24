import { BrowserRouter, Routes, Route } from "react-router";

import LandingPage from "./features/landingPage/LandingPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
