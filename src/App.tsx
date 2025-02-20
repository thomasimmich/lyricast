import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import tw from "twin.macro";
import Login from "./components/auth/Login";
import LyricList from "./components/LyricList";
import NavBar from "./components/NavBar";
import { useStateContext } from "./contexts";
import useDisableZoomAndScroll from "./hooks/useDisableZoomAndScroll";

const PageWrapperStyled = styled.div`
  ${tw`text-white pt-20 pb-12 bg-black h-screen`}
  background-size: 40px 60px;
  background-image:
    linear-gradient(to right, #ffff002b 1px, transparent 1px),
    linear-gradient(to bottom, #ffff002b 1px, transparent 1px);
`;

function App() {
  const { userId } = useStateContext();

  useDisableZoomAndScroll();

  return (
    <div>
      <BrowserRouter>
        {userId == "undefined" ? (
          <Login />
        ) : (
          <PageWrapperStyled>
            <NavBar />
            <LyricList />
          </PageWrapperStyled>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
