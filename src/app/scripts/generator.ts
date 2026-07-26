import { FunctionDeclaration } from "ts-morph";

export function collectDependencies(
    entryPoint: string,
    graph: Map<string, Set<string>>
): string[] {

    const visited = new Set<string>();

    function visit(name: string) {

        if (visited.has(name)) {
            return;
        }

        visited.add(name);

        const deps = graph.get(name);

        if (!deps) {
            return;
        }

        for (const dep of deps) {
            visit(dep);
        }
    }

    visit(entryPoint);

    return [...visited];
}

export function generateModuleSource(
    names: string[],
    functions: FunctionDeclaration[]
): string {

    const lookup = new Map(
        functions.map(fn => [
            fn.getName(),
            fn,
        ])
    );

    const pieces: string[] = [];

    for (const name of names.sort()) {

        const fn = lookup.get(name);

        if (!fn) {
            continue;
        }

        pieces.push(
            fn.getText().replace(
                /^function\s+/,
                "export function "
            )
        );
    }

    return pieces.join("\n\n");
}