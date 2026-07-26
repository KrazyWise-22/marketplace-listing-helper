import { Project } from "ts-morph";

import { buildSymbolIndex } from "./symbolIndex";
import { resolveReferencedSymbols } from "./resolver";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
});

const index =
    buildSymbolIndex(project);

const node =
    index.get("buildPrice");

if (!node) {

    console.log("buildPrice not found.");

    process.exit(1);

}

console.log("Referenced symbols:\n");

const symbols =
    resolveReferencedSymbols(node);

for (const symbol of symbols) {

    const found =
        index.has(symbol);

    console.log(
        `${found ? "✅" : "❌"} ${symbol}`
    );

}