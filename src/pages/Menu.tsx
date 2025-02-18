import styled from "styled-components";
import tw from "twin.macro";
import NavBar from "../components/common/NavBar";
import { LyricList } from "../components/menu";

const PageWrapperStyled = styled.div`
  ${tw`text-white pt-20 pb-12 bg-black h-screen`}
  background-size: 40px 60px;
  background-image:
    linear-gradient(to right, #ffff002b 1px, transparent 1px),
    linear-gradient(to bottom, #ffff002b 1px, transparent 1px);
`;

const Menu = () => {
  return (
    <PageWrapperStyled>
      <NavBar />
      <LyricList />
    </PageWrapperStyled>
  );
};

export default Menu;
