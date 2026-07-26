import { FunctionDeclaration, SyntaxKind } from "ts-morph";

export function buildDependencyGraph(
    functions: FunctionDeclaration[]
): Map<string, Set<string>> {

    const functionNames = new Set(
        functions
            .map(fn => fn.getName())
            .filter((name): name is string => !!name)
    );

    const graph = new Map<string, Set<string>>();

    for (const fn of functions) {

        const name = fn.getName();

        if (!name) continue;

        const dependencies = new Set<string>();

        const calls = fn.getDescendantsOfKind(
            SyntaxKind.CallExpression
        );

        for (const call of calls) {

            const expression = call.getExpression();

            if (
                expression.getKind() !== SyntaxKind.Identifier
            ) {
                continue;
            }

            const calledName = expression.getText();

            if (
                functionNames.has(calledName) &&
                calledName !== name
            ) {
                dependencies.add(calledName);
            }
        }

        graph.set(name, dependencies);
    }

    return graph;
}