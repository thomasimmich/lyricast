import React from "react";
import { SizeVariants } from "../../base/enums";
import SnippetText from "../SnippetText";

const OneWordWonder = (props: { snippets: string[]; size: SizeVariants }) => {
  return (
    <p>
      {props.snippets.map((snippet, index) => {
        return <SnippetText key={index} snippet={snippet} size={props.size} />;
      })}
    </p>
  );
};

export default OneWordWonder;
