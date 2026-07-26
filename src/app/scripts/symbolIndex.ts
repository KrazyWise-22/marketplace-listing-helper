import {
    Node,
    Project,
    SourceFile,
    SyntaxKind,
} from "ts-morph";

export type SymbolTable = Map<string, Node>;

export function buildSymbolIndex(
    project: Project
): SymbolTable {

    const index: SymbolTable = new Map();

    const files = project
    .getSourceFiles()
    .filter(file => {

        const path = file.getFilePath();

        return !path.includes("/Generated/")
            && !path.includes("\\Generated\\");

    });

    for (const file of files) {

        indexSourceFile(file, index);

    }

    return index;
}

function indexSourceFile(
    file: SourceFile,
    index: SymbolTable
) {

    for (const node of file.getStatements()) {

        switch (node.getKind()) {

            case SyntaxKind.FunctionDeclaration: {

                const fn = node.asKindOrThrow(
                    SyntaxKind.FunctionDeclaration
                );

                const name = fn.getName();

                if (name) {
                    index.set(name, fn);
                }

                break;
            }

            case SyntaxKind.InterfaceDeclaration: {

                const iface = node.asKindOrThrow(
                    SyntaxKind.InterfaceDeclaration
                );

                index.set(
                    iface.getName(),
                    iface
                );

                break;
            }

            case SyntaxKind.TypeAliasDeclaration: {

                const type = node.asKindOrThrow(
                    SyntaxKind.TypeAliasDeclaration
                );

                index.set(
                    type.getName(),
                    type
                );

                break;
            }

            case SyntaxKind.EnumDeclaration: {

                const e = node.asKindOrThrow(
                    SyntaxKind.EnumDeclaration
                );

                index.set(
                    e.getName(),
                    e
                );

                break;
            }

            case SyntaxKind.VariableStatement: {

                const vars = node
                    .asKindOrThrow(
                        SyntaxKind.VariableStatement
                    )
                    .getDeclarations();

                for (const v of vars) {

                    index.set(
                        v.getName(),
                        v
                    );

                }

                break;
            }

        }

    }

}