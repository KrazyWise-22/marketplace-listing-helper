import fs from "node:fs";
import path from "node:path";

export function writeModule(
    moduleName: string,
    source: string
) {

    const outputDir = path.join(
        process.cwd(),
        "Generated",
        moduleName
    );

    fs.mkdirSync(
        outputDir,
        {
            recursive: true,
        }
    );

    fs.writeFileSync(
        path.join(outputDir, "index.ts"),
        source,
        "utf8"
    );

    console.log(
        `✓ Generated ${moduleName}/index.ts`
    );
}