import { motion } from "framer-motion";
import { SizeVariants } from "../../../interfaces/enums";
import SnippetText from "./SnippetText";

const StackedChaos = (props: { snippets: string[] }) => {
  const snippets = props.snippets.filter((_, idx) => idx % 2 === 0);
  return (
    <div style={{ width: "100%" }}>
      {snippets.map((_, index) => (
        <motion.div
          key={index}
          initial={{ y: 0, rotate: 0 }}
          animate={{ y: 0, rotate: 10 * (index % 2 === 1 ? -1 : 1) }}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <SnippetText snippet={snippets[index]} size={SizeVariants.L} />

          {snippets[index + 1] && (
            <SnippetText
              key={index + index * 12}
              snippet={props.snippets[index + 1]}
              size={SizeVariants.L}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default StackedChaos;
