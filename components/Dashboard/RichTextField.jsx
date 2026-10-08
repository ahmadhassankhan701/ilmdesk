"use client";

import { useState } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import {
  FormatAlignCenter,
  FormatAlignLeft,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatUnderlined,
  LinkOutlined,
} from "@mui/icons-material";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { fieldSx, ink, primary } from "@/components/AuthFrame";

const pine = "#0D9AAC";

function htmlForEditor(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/<\/?[a-z][\s\S]*>/i.test(text)) return text;
  const safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<p>${safe.replace(/\n/g, "</p><p>")}</p>`;
}

function Tool({ label, active, onClick, children }) {
  return (
    <IconButton
      type="button"
      size="small"
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      sx={{
        width: 32,
        height: 32,
        borderRadius: "8px",
        color: active ? pine : ink,
        bgcolor: active ? "rgba(13, 154, 172, 0.12)" : "transparent",
        "&:hover": { bgcolor: active ? "rgba(13, 154, 172, 0.16)" : "#F0F3F5" },
      }}
    >
      {children}
    </IconButton>
  );
}

export default function RichTextField({ value, onChange, placeholder = "Write the explanation" }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: htmlForEditor(value),
    onUpdate: ({ editor: current }) => {
      onChange(current.isEmpty ? "" : current.getHTML());
    },
  });

  const applyLink = () => {
    if (!editor) return;
    const raw = linkUrl.trim();
    if (!raw) {
      editor.chain().focus().unsetLink().run();
      setLinkOpen(false);
      return;
    }
    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkOpen(false);
  };

  return (
    <Box
      sx={{
        border: "1px solid #E2E8EC",
        borderRadius: "16px",
        overflow: "hidden",
        bgcolor: "#fff",
        "&:focus-within": {
          borderColor: primary,
          boxShadow: "0 0 0 4px rgba(13, 154, 172, 0.16)",
        },
        "& .ProseMirror": {
          minHeight: 168,
          px: 1.75,
          py: 1.4,
          outline: "none",
          color: ink,
          fontSize: 15,
          lineHeight: 1.65,
        },
        "& .ProseMirror p": { margin: "0 0 0.65em" },
        "& .ProseMirror h2": { fontSize: 22, fontWeight: 700, lineHeight: 1.3, margin: "0.2em 0 0.45em" },
        "& .ProseMirror h3": { fontSize: 18, fontWeight: 700, lineHeight: 1.35, margin: "0.2em 0 0.4em" },
        "& .ProseMirror ul, & .ProseMirror ol": { margin: "0.2em 0 0.7em", paddingLeft: "1.3em" },
        "& .ProseMirror blockquote": {
          margin: "0.4em 0 0.8em",
          paddingLeft: "0.9em",
          borderLeft: `3px solid ${pine}`,
          color: "#3c403c",
        },
        "& .ProseMirror a": { color: primary },
        "& .ProseMirror p.is-editor-empty:first-of-type::before": {
          content: "attr(data-placeholder)",
          float: "left",
          height: 0,
          pointerEvents: "none",
          color: "#8A97A3",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 0.25,
          px: 0.75,
          py: 0.6,
          borderBottom: "1px solid #E2E8EC",
          bgcolor: "#F0F3F5",
        }}
      >
        <Tool label="Bold" active={Boolean(editor?.isActive("bold"))} onClick={() => editor?.chain().focus().toggleBold().run()}>
          <FormatBold sx={{ fontSize: 18 }} />
        </Tool>
        <Tool label="Italic" active={Boolean(editor?.isActive("italic"))} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <FormatItalic sx={{ fontSize: 18 }} />
        </Tool>
        <Tool label="Underline" active={Boolean(editor?.isActive("underline"))} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          <FormatUnderlined sx={{ fontSize: 18 }} />
        </Tool>
        <Box sx={{ width: "1px", height: 18, bgcolor: "#e4ddd4", mx: 0.4 }} />
        <Tool label="Heading" active={Boolean(editor?.isActive("heading", { level: 2 }))} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Box component="span" sx={{ fontSize: 12, fontWeight: 800 }}>H2</Box>
        </Tool>
        <Tool label="Subheading" active={Boolean(editor?.isActive("heading", { level: 3 }))} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Box component="span" sx={{ fontSize: 12, fontWeight: 800 }}>H3</Box>
        </Tool>
        <Box sx={{ width: "1px", height: 18, bgcolor: "#e4ddd4", mx: 0.4 }} />
        <Tool label="Bullet list" active={Boolean(editor?.isActive("bulletList"))} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <FormatListBulleted sx={{ fontSize: 18 }} />
        </Tool>
        <Tool label="Numbered list" active={Boolean(editor?.isActive("orderedList"))} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <FormatListNumbered sx={{ fontSize: 18 }} />
        </Tool>
        <Tool label="Quote" active={Boolean(editor?.isActive("blockquote"))} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          <FormatQuote sx={{ fontSize: 18 }} />
        </Tool>
        <Box sx={{ width: "1px", height: 18, bgcolor: "#e4ddd4", mx: 0.4 }} />
        <Tool label="Align left" active={Boolean(editor?.isActive({ textAlign: "left" }))} onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
          <FormatAlignLeft sx={{ fontSize: 18 }} />
        </Tool>
        <Tool label="Align center" active={Boolean(editor?.isActive({ textAlign: "center" }))} onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
          <FormatAlignCenter sx={{ fontSize: 18 }} />
        </Tool>
        <Tool
          label="Link"
          active={Boolean(editor?.isActive("link")) || linkOpen}
          onClick={() => {
            setLinkUrl(editor?.getAttributes("link").href || "");
            setLinkOpen((open) => !open);
          }}
        >
          <LinkOutlined sx={{ fontSize: 18 }} />
        </Tool>
      </Box>
      {linkOpen && (
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            applyLink();
          }}
          sx={{ display: "flex", gap: 1, px: 1, py: 1, borderBottom: "1px solid #E2E8EC", bgcolor: "#fff" }}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            sx={fieldSx}
          />
          <Box
            component="button"
            type="submit"
            sx={{
              border: 0,
              borderRadius: "999px",
              px: 1.6,
              bgcolor: pine,
              color: "#fff",
              font: "inherit",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Apply
          </Box>
        </Box>
      )}
      {editor ? <EditorContent editor={editor} /> : <Box sx={{ minHeight: 168 }} />}
    </Box>
  );
}
