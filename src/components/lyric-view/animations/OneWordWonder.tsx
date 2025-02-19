import { SizeVariants } from "../../../interfaces/enums";
import SnippetText from "./SnippetText";

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
