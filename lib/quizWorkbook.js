import * as XLSX from "xlsx";
import { QUIZ_SAMPLE_ROWS, questionsFromRecords } from "./quizSheet.js";

export function questionsFromWorkbook(data) {
  const book = XLSX.read(data, { type: "array" });
  const name = book.SheetNames[0];
  const sheet = name ? book.Sheets[name] : null;
  if (!sheet) throw new Error("The file has no questions.");
  const records = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
  return questionsFromRecords(records);
}

export function sampleWorkbook() {
  const book = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(QUIZ_SAMPLE_ROWS);
  XLSX.utils.book_append_sheet(book, sheet, "Questions");
  return XLSX.write(book, { bookType: "xlsx", type: "array" });
}
