import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-tomorrow';

import './RightSideEditor.css';
import '../../ResponsiveStyles.css';

const RightSideEditor = ({ json, payloadType }) => {
    return (
      <AceEditor
        className="right-editor"
        mode={payloadType}
        theme="tomorrow"
        // theme="tomorrow_night"
        // readOnly={true}
        value={json}
        name="right-editor"
        editorProps={{ $blockScrolling: true }}
        // editorProps={{ $blockScrolling: Infinity }}
        setOptions={{
          useWorker: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    );
  };

export default RightSideEditor;
