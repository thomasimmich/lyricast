import { IoPersonCircle } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import tw from "twin.macro";

const StyledNavBarWrapper = styled.div`
  ${tw`bg-black items-center fixed w-screen z-50 top-0 bg-opacity-5 backdrop-blur-lg flex justify-between xl:px-10 xl:py-6 p-4`}
`;

const StyledAppText = styled.p`
  ${tw`text-xl font-semibold`}
`;

const StyledNavLink = styled(NavLink)`
  ${tw`text-opacity-80 invisible md:visible text-white hover:text-opacity-100`}
`;

const StyledProfileButton = styled.button`
  ${tw`bg-white bg-opacity-20 p-1 text-xl rounded-lg`}
`;

const NavBar = () => {
  return (
    <StyledNavBarWrapper>
      <StyledAppText>Lyricast</StyledAppText>
      <div tw="space-x-6 flex items-center">
        <StyledNavLink to="/">Lyrics</StyledNavLink>
        <StyledNavLink to="/edit-layout">Edit Layout</StyledNavLink>
        <StyledNavLink to="/edit-layout">Microphone Check</StyledNavLink>

        <StyledProfileButton>
          <IoPersonCircle />
        </StyledProfileButton>
      </div>
    </StyledNavBarWrapper>
  );
};

export default NavBar;


