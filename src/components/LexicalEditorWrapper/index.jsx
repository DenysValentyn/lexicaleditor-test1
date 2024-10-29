// import { $getRoot, $getSelection, $insertText } from "lexical";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
} from "lexical";

import { useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { MuiContentEditable, placeHolderSx } from "./styles";
import { Box, Divider, TextField } from "@mui/material";
import { lexicalEditorConfig } from "../../config/lexicalEditorConfig";
import LexicalEditorTopBar from "../LexicalEditorTopBar";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import ImagesPlugin from "../CustomPlugins/ImagePlugin";
import FloatingTextFormatToolbarPlugin from "../CustomPlugins/FloatingTextFormatPlugin";

function LexicalEditorWrapper(props) {
  const [data, setData] = useState("");

  const handleDrop = (event) => {
    console.log("handledrop");
    event.preventDefault();
    const text = event.dataTransfer.getData("text/plain");
    setData(text); // Set the dragged text here
    // Optionally insert the text into the editor
    // $insertText(text); // Uncomment if you want to insert directly
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <LexicalComposer initialConfig={lexicalEditorConfig}>
      <LexicalEditorTopBar />
      <Divider />

      <Box
        sx={{ position: "relative", background: "white" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <RichTextPlugin
          contentEditable={<MuiContentEditable />}
          placeholder={<Box sx={placeHolderSx}>Enter some text...</Box>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <LinkPlugin />
        <ImagesPlugin captionsEnabled={false} />
        <FloatingTextFormatToolbarPlugin />
        <MyCustomAutoFocusPlugin setData={setData} draggedText={data} />
      </Box>
    </LexicalComposer>
  );
}

function MyCustomAutoFocusPlugin({ setData, draggedText }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  const inputRef = useRef(null);

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", inputRef.current.value);
  };

  useEffect(() => {
    if (draggedText) {
      console.log("Received dragged text:", draggedText);
      // You can perform any action with draggedText here
      // For example, inserting it into the editor:
      editor.update(() => {
        const root = $getRoot();
        const p = $createParagraphNode();
        p.append($createTextNode(draggedText));
        root.append(p);
      });
    }
  }, [draggedText]);

  return (
    <TextField
      inputRef={inputRef}
      variant="outlined"
      onDragStart={handleDragStart}
      draggable
      placeholder="Drag this text"
      sx={{ width: "100%" }}
    />
  );
}
// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();
    console.log(root, selection);
  });
}

export default LexicalEditorWrapper;
