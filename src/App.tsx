import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useStateContext } from "./contexts";
import { EditLyricLayoutView, Menu } from "./pages";
import Login from "./pages/Login";

function App() {
  const { userId } = useStateContext();
  return (
    <div>
      <BrowserRouter>
        {userId == "undefined" ? (
          <Login />
        ) : (
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/edit-layout" element={<EditLyricLayoutView />} />
            <Route path="/*" element={<p>Not Found</p>} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
