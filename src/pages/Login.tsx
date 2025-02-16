import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import styled from "styled-components";
import tw from "twin.macro";
import supabaseClient from "../lib/supabase";

const PageWrapperStyled = styled.div`
  ${tw`flex p-10 flex-col items-center justify-center h-screen`}
`;

const LogIn = () => {
  return (
    <PageWrapperStyled>
      <div tw="w-96">
        <Auth
          supabaseClient={supabaseClient}
          appearance={{
            theme: ThemeSupa,
          }}
          theme={"dark"}
          providers={[]}
        />
      </div>
    </PageWrapperStyled>
  );
};

export default LogIn;
