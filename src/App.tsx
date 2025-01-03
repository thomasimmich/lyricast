import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EditLyricLayoutView, Menu } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Menu} />
        <Route path="/edit-layout" Component={EditLyricLayoutView} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
