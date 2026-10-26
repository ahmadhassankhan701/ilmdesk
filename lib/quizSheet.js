export const QUIZ_SAMPLE_ROWS = [
  {
    question: "What is the atomic number of carbon?",
    option1: "4",
    option2: "6",
    option3: "8",
    option4: "12",
    correct: "2",
    explanation: "Carbon has 6 protons.",
  },
  {
    question: "Which gas do plants take in for photosynthesis?",
    option1: "Oxygen",
    option2: "Nitrogen",
    option3: "Carbon dioxide",
    option4: "Hydrogen",
    correct: "C",
    explanation: "Plants use carbon dioxide and release oxygen.",
  },
];

const HEADER_ALIASES = {
  question: "question",
  title: "question",
  prompt: "question",
  option1: "option1",
  optiona: "option1",
  a: "option1",
  option2: "option2",
  optionb: "option2",
  b: "option2",
  option3: "option3",
  optionc: "option3",
  c: "option3",
  option4: "option4",
  optiond: "option4",
  d: "option4",
  correct: "correct",
  correctoption: "correct",
  answer: "correct",
  correctanswer: "correct",
  explanation: "explanation",
  explain: "explanation",
};

const SAMPLE_HEADERS = ["question", "option1", "option2", "option3", "option4", "correct", "explanation"];

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function mapHeaders(row) {
  const map = {};
  row.forEach((cell, index) => {
    const key = HEADER_ALIASES[normalizeHeader(cell)];
    if (key && map[key] === undefined) map[key] = index;
  });
  return map;
}

function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function sampleCsv() {
  const lines = [SAMPLE_HEADERS.join(",")];
  QUIZ_SAMPLE_ROWS.forEach((row) => {
    lines.push(SAMPLE_HEADERS.map((key) => csvCell(row[key])).join(","));
  });
  return `${lines.join("\n")}\n`;
}

export function parseCsv(text) {
  const input = String(text || "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (char === "\n" || char === "\r") {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((item) => item.some((value) => String(value).trim()));
}

function correctIndex(correct, options, line) {
  const value = String(correct || "").trim();
  if (!value) throw new Error(`Row ${line}: mark the correct option.`);
  const letter = value.toUpperCase();
  if (/^[A-D]$/.test(letter)) {
    const index = letter.charCodeAt(0) - 65;
    if (!(options[index] || "").trim()) throw new Error(`Row ${line}: option ${letter} is empty.`);
    return index;
  }
  if (/^[1-4]$/.test(value)) {
    const index = Number(value) - 1;
    if (!(options[index] || "").trim()) throw new Error(`Row ${line}: option ${value} is empty.`);
    return index;
  }
  const match = options.findIndex((option) => option.trim().toLowerCase() === value.toLowerCase());
  if (match >= 0) return match;
  throw new Error(`Row ${line}: correct must be 1–4 or A–D.`);
}

function padOptions(options) {
  const next = options.slice(0, 4);
  while (next.length < 4) next.push("");
  return next;
}

export function questionsFromTable(rows) {
  const table = (rows || []).filter((row) => (row || []).some((value) => String(value ?? "").trim()));
  if (!table.length) throw new Error("The file has no questions.");

  const headerMap = mapHeaders(table[0].map((cell) => String(cell ?? "")));
  const hasHeader = headerMap.question !== undefined && headerMap.option1 !== undefined;
  const data = hasHeader ? table.slice(1) : table;
  if (!data.length) throw new Error("The file has no questions.");

  const questions = [];
  data.forEach((row, index) => {
    const line = hasHeader ? index + 2 : index + 1;
    const read = (key, position) => {
      const at = hasHeader ? headerMap[key] : position;
      if (at === undefined) return "";
      return String(row[at] ?? "").trim();
    };
    const question = read("question", 0);
    const options = [read("option1", 1), read("option2", 2), read("option3", 3), read("option4", 4)];
    const correct = read("correct", 5);
    const explanation = read("explanation", 6);
    if (!question && options.every((option) => !option) && !correct && !explanation) return;
    if (!question) throw new Error(`Row ${line}: enter the question.`);
    if (options.filter((option) => option).length < 2) throw new Error(`Row ${line}: add at least two options.`);
    questions.push({
      question,
      explanation,
      options: padOptions(options),
      correctOption: correctIndex(correct, options, line),
    });
  });

  if (!questions.length) throw new Error("The file has no questions.");
  return questions;
}

export function questionsFromRecords(records) {
  const list = Array.isArray(records) ? records.filter((record) => record && typeof record === "object") : [];
  if (!list.length) throw new Error("The file has no questions.");
  const headers = Object.keys(list[0]);
  return questionsFromTable([headers, ...list.map((record) => headers.map((key) => record[key]))]);
}

export function blankQuestion(question) {
  return (
    !(question?.question || "").trim() &&
    !(question?.explanation || "").trim() &&
    !(question?.options || []).some((option) => (option || "").trim())
  );
}

export function mergeQuestions(current, incoming) {
  const kept = (current || []).filter((question) => !blankQuestion(question));
  return [...kept, ...incoming];
}
