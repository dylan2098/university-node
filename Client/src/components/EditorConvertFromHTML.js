import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function EditorConvertFromHTML ({html}) {
    return (
        <div>
            <Editor
                editorState={EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(html)))}
                toolbarHidden
                readOnly
            />
        </div>
    )
}