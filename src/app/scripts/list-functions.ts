import { Project, SyntaxKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const source = project.getSourceFileOrThrow("src/app/page.tsx");

const functions = source.getDescendantsOfKind(SyntaxKind.FunctionDeclaration);

console.log(`Found ${functions.length} functions:\n`);

for (const fn of functions) {
  const name = fn.getName() ?? "<anonymous>";
  const start = source.getLineAndColumnAtPos(fn.getStart()).line;
  const end = source.getLineAndColumnAtPos(fn.getEnd()).line;

  console.log(`${name.padEnd(35)} ${start}-${end}`);
}