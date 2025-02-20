import { IoPersonCircle } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import tw from "twin.macro";
import { useIsClientRemoteControl } from "../hooks/useIsClientRemoteControl";

const StyledNavBarWrapper = styled.div`
  ${tw`bg-black items-center fixed w-screen z-50 top-0 bg-opacity-5 backdrop-blur-lg flex justify-between xl:px-10 xl:py-6 p-4`}
`;

const StyledAppText = styled.p`
  ${tw`text-xl font-semibold`}
`;

const StyledProfileButton = styled.button`
  ${tw`bg-white bg-opacity-20 p-1 text-xl rounded-lg`}
`;

const StyledStatusButton = styled.button`
  ${tw`bg-white bg-opacity-20 px-2 text-sm p-1 rounded-lg`}
`;

const NavBar = () => {
  const isClientRemoteControl = useIsClientRemoteControl();

  const changeIsClientRemoteControl = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (isClientRemoteControl) {
      params.set("remote-control", "false");
    } else {
      params.set("remote-control", "true");
    }

    if (!params.has("remote-control")) {
      params.append("remote-control", "false");
    }

    window.location.href = `${url.origin}${url.pathname}?${params.toString()}`;
  };

  return (
    <StyledNavBarWrapper>
      <StyledAppText>Lyricast</StyledAppText>

      <div tw="space-x-4 flex items-center">
        <StyledStatusButton onClick={changeIsClientRemoteControl}>
          {isClientRemoteControl ? "Remote Control" : "Client"}
        </StyledStatusButton>
        <StyledProfileButton>
          <IoPersonCircle />
        </StyledProfileButton>
      </div>
    </StyledNavBarWrapper>
  );
};

export default NavBar;
