import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import tw from "twin.macro";
import LyricList from "./components/LyricList";
import NavBar from "./components/NavBar";
import useDisableZoomAndScroll from "./hooks/useDisableZoomAndScroll";

const PageWrapperStyled = styled.div`
  ${tw`text-white pt-20 pb-12 bg-black h-screen`}
  background-size: 40px 60px;
  background-image:
    linear-gradient(to right, #ffff002b 1px, transparent 1px),
    linear-gradient(to bottom, #ffff002b 1px, transparent 1px);
`;

function App() {
  useDisableZoomAndScroll();

  return (
    <div>
      <BrowserRouter>
        <PageWrapperStyled>
          <NavBar />
          <LyricList />
        </PageWrapperStyled>
      </BrowserRouter>
    </div>
  );
}

export default App;
