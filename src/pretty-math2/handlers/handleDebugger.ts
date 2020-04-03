import { EditorState } from 'pretty-math2/model/EditorState';

export function handleDebugger(editorState: EditorState, e: React.KeyboardEvent) {
    console.log("Start: type=", editorState.selection.range.start.type, 
        " text=", editorState.selection.range.start.toCalchub().text);
    console.log("End: type=", editorState.selection.range.end.type, 
        " text=", editorState.selection.range.end.toCalchub().text);
}