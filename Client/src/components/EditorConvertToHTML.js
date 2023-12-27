import { useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function EditorConvertToHTML({ handleChangeValue, html }) {
    const [_editorState, setEditorState] = useState(!html ? EditorState.createEmpty() : EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(html))));


    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
        if (!editorState.getCurrentContent().hasText()) {
            handleChangeValue(null);
            return;
        }
        let valueHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        handleChangeValue(valueHtml);
    };

    return (
        <div>
            <Editor
                editorState={_editorState}
                onEditorStateChange={onEditorStateChange}
                editorStyle={{ border: "1px solid", height: "200px" }}
            />
        </div>
    )
}