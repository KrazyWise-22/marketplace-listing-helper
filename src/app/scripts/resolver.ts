import {
    Identifier,
    Node,
    SyntaxKind,
} from "ts-morph";

export function resolveReferencedSymbols(
    declaration: Node
): string[] {

    const referenced = new Set<string>();

    const identifiers =
        declaration.getDescendantsOfKind(
            SyntaxKind.Identifier
        );

    for (const identifier of identifiers) {

        if (isLocalIdentifier(identifier)) {
            continue;
        }

        referenced.add(identifier.getText());

    }

    return [...referenced].sort();

}

function isLocalIdentifier(
    identifier: Identifier
): boolean {

    const definitions =
        identifier.getDefinitions();

    if (definitions.length === 0) {
        return false;
    }

    for (const definition of definitions) {

        const kind =
            String(definition.getKind());

        if (
            kind.includes("parameter") ||
            kind.includes("variable") ||
            kind.includes("local") ||
            kind.includes("property") ||
            kind.includes("method") ||
            kind.includes("alias") ||
            kind.includes("function")
        ) {
            return true;
        }

    }

    return false;

}