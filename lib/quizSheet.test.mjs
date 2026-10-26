import assert from "node:assert/strict";
import { mergeQuestions, parseCsv, questionsFromTable, sampleCsv } from "./quizSheet.js";

const imported = questionsFromTable(parseCsv(sampleCsv()));
assert.equal(imported.length, 2);
assert.equal(imported[0].question, "What is the atomic number of carbon?");
assert.equal(imported[0].correctOption, 1);
assert.equal(imported[0].options[1], "6");
assert.equal(imported[1].correctOption, 2);
assert.equal(imported[1].explanation, "Plants use carbon dioxide and release oxygen.");

const quoted = questionsFromTable(
  parseCsv('question,option1,option2,option3,option4,correct,explanation\n"What, exactly?",A,B,C,D,A,"Because, yes"\n')
);
assert.equal(quoted[0].question, "What, exactly?");
assert.equal(quoted[0].correctOption, 0);
assert.equal(quoted[0].explanation, "Because, yes");

assert.throws(() => questionsFromTable([["question", "option1", "option2", "correct"], ["Only stem", "A", "B", ""]]), /mark the correct option/);
assert.throws(() => questionsFromTable([]), /no questions/);

const merged = mergeQuestions(
  [{ question: "", explanation: "", options: ["", "", "", ""], correctOption: 0 }, { question: "Kept", options: ["A", "B"], correctOption: 0 }],
  imported
);
assert.equal(merged[0].question, "Kept");
assert.equal(merged.length, 3);

console.log("quiz sheet ok");
