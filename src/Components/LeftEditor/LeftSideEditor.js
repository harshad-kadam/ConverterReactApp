import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-tomorrow';

import './LeftSideEditor.css';
import '../../ResponsiveStyles.css';

const LeftSideEditor = ({ xml, onChange, payloadType}) => {
    return (
      <AceEditor
        className="left-editor"
        mode={payloadType}
        theme="tomorrow"
        value={xml}
        onChange={onChange}
        name="left-editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          useWorker: false,
          showLineNumbers: true,
          tabSize: 2//,
          //markers:[{ startRow: 0, startCol: 2, endRow: 1, endCol: 20, className: 'error-marker', type: 'background' }]
        }}
      />
    );
  };
  

export default LeftSideEditor;
