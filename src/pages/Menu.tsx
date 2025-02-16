import styled from "styled-components";
import tw from "twin.macro";
import LyricList from "./LyricList";

const PageWrapperStyled = styled.div`
  ${tw`flex text-white bg-fixed bg-black flex-col h-screen`}
  background-size: 80px 80px;
  background-image:
    linear-gradient(to right, #ffff002b 1px, transparent 1px),
    linear-gradient(to bottom, #ffff002b 1px, transparent 1px);
`;

const Menu = () => {
  return (
    <PageWrapperStyled>
      <p tw="text-xl p-10 pb-0 font-semibold">Lyricast</p>
      <LyricList />
    </PageWrapperStyled>
  );
};

export default Menu;
