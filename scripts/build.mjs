import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "src");
const output = resolve(root, "dist");

if (!source.startsWith(root) || !output.startsWith(root)) {
  throw new Error("Caminho de build inválido.");
}

await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true, force: true });
console.log(`Site estático preparado em ${output}`);
