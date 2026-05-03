#!/usr/bin/env node
/**
 * Читает первую строку как заголовки столбцов.
 * Разделитель: табуляция (TSV), если в строке есть \t; иначе запятая (CSV).
 * Учитывает кавычки RFC-стиля в CSV.
 */

import { readFileSync } from "node:fs";
import { argv, exit, stderr } from "node:process";

function parseDelimitedLine(line, delimiter) {
  if (delimiter === "\t") {
    return line.split("\t").map((s) => s.trim());
  }
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

function detectDelimiter(firstLine) {
  return firstLine.includes("\t") ? "\t" : ",";
}

function escapeCell(text) {
  const flat = String(text).replace(/\r?\n/g, " ").trim();
  return flat.replace(/\|/g, "\\|");
}

function toMarkdownTable(rows) {
  if (rows.length === 0) return "";
  const headers = rows[0];
  const body = rows.slice(1);
  const headerRow = `| ${headers.map(escapeCell).join(" | ")} |`;
  const sepRow = `| ${headers.map(() => "---").join(" | ")} |`;
  const dataRows = body.map(
    (r) => `| ${r.map(escapeCell).join(" | ")} |`
  );
  return [headerRow, sepRow, ...dataRows].join("\n");
}

function main() {
  const filePath = argv[2];
  if (!filePath) {
    stderr.write(
      "Usage: node scripts/tabular-to-markdown.mjs <file.csv|file.tsv>\n"
    );
    exit(1);
  }
  const raw = readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) {
    stderr.write("Empty file.\n");
    exit(1);
  }
  const delimiter = detectDelimiter(lines[0]);
  const rows = lines.map((line) => parseDelimitedLine(line, delimiter));
  const width = rows[0].length;
  for (let i = 1; i < rows.length; i++) {
    while (rows[i].length < width) {
      rows[i].push("");
    }
    if (rows[i].length > width) {
      rows[i] = rows[i].slice(0, width);
    }
  }
  console.log(toMarkdownTable(rows));
}

main();
