import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import vkbeautify from 'vkbeautify';
import { minify } from 'xml-minifier';
import { FaFile, FaDownload, FaTrash, FaCopy, FaFileAlt } from 'react-icons/fa';
import { MdDriveFolderUpload, MdFormatIndentIncrease } from "react-icons/md";
import { CgFormatLeft } from "react-icons/cg";
import { TbSortAscendingLetters } from "react-icons/tb";
import { LiaCheckCircle } from "react-icons/lia";
import { BsFiletypeXml, BsFiletypeJson, BsTrash3 } from "react-icons/bs";
import { SiConvertio } from "react-icons/si";
import { VscJson, VscCode } from "react-icons/vsc";

import LeftSideEditor from '../../Components/LeftEditor/LeftSideEditor';
import RightSideEditor from '../../Components/RightEditor/RightSideEditor';
import TooltipWrapper from '../../Components/Tooltip/TooltipWrapper';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import '../../App.css';
import '../../ResponsiveStyles.css';
import './EditorToolbar.css';
import { handleApiError, handleUncaughtError } from '../../Utils/errorHandling';

import 'bootstrap/dist/css/bootstrap.min.css';

const CONSTANTS = require('../../Config/Constants');

const ConverterAppMain = () => {

  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [converterType, setConverterType] = useState('XML to JSON');
  const [leftPanePayloadType, setLeftPanePayloadType] = useState("xml");
  const [rightPanePayloadType, setRightPanePayloadType] = useState("json");
  const [leftPaneType, setLeftPaneType] = useState("Xml");
  const [rightPaneType, setRightPaneType] = useState("Json");
  const [converterUri, setConverterUri] = useState("");
  const [contentType, setContentType] = useState('application/xml');

  const bottomRef = useRef(null);

  // Load XML and JSON from local storage on component mount
  const [xmlPayload, setXmlPayload] = useState(localStorage.getItem('xmlPayload') || '');
  const [jsonPayload, setJsonPayload] = useState(localStorage.getItem('jsonPayload') || '');

  useEffect(() => {
    localStorage.setItem('xmlPayload', xmlPayload);
    localStorage.setItem('jsonPayload', jsonPayload);
  }, [xmlPayload, jsonPayload]);

  useEffect(() => {
    // Set up global error handler for uncaught runtime errors
    window.onerror = (message, source, lineno, colno, error) => {
      handleUncaughtError(setErrorMessages, error);
      return true;
    };

    // Clean up the global error handler when the component is unmounted
    return () => {
      window.onerror = null;
    };
  }, []);

  const loadConverter = (converterType) => {
    let leftPanePayloadType = 'xml';
    let rightPanePayloadType = 'json';
    let converterUri = '';

    switch (converterType) {
      case 'xml-to-json':
        leftPanePayloadType = 'xml';
        rightPanePayloadType = 'json';
        converterUri = '/xmltojson';
        setConverterType('XML to JSON');
        setContentType('application/xml');
        setLeftPaneType('Xml');
        setRightPaneType('Json');
        break;
      case 'json-to-xml':
        leftPanePayloadType = 'json';
        rightPanePayloadType = 'xml';
        converterUri = '/jsontoxml';
        setConverterType('JSON to XML');
        setContentType('application/json');
        setLeftPaneType('Json');
        setRightPaneType('Xml');
        break;
      case 'xml-to-contracts':
        leftPanePayloadType = 'xml';
        rightPanePayloadType = 'json';
        converterUri = '';
        setConverterType('XML to Snake-Case JSON');
        setContentType('application/xml');
        setLeftPaneType('Xml');
        setRightPaneType('Json');
        break;
      case 'xsl-for-transformation':
        // leftPanePayloadType = 'text';
        leftPanePayloadType = 'text';
        rightPanePayloadType = 'text';
        converterUri = '/xsl';
        setConverterType('Get XSL script for Input');
        setContentType('text/plain');
        setLeftPaneType('Input');
        setRightPaneType('Output');
        break;
      default:
      // Handle default case
    }

    setLeftPanePayloadType(leftPanePayloadType);
    setRightPanePayloadType(rightPanePayloadType);
    setConverterUri(converterUri);
    setDropdownOpen(false);
  };

  const handleConvert = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      console.log('API_URL:', CONSTANTS.REACT_APP_API_URL);
      let reqPayload = (leftPanePayloadType === 'json') ? jsonPayload : xmlPayload;
      const response = await axios.post(`${CONSTANTS.REACT_APP_API_URL}` + converterUri, reqPayload, {
        // const response = await axios.post('https://apis-dev.globalpay.com/v1/boarding/propay', xmlPayload, {
        mode: 'no-cors',
        // method: 'POST',
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        },
        timeout: 15000, // 15 seconds timeout
      });

      const data = response.data;

      if (leftPanePayloadType === 'text') {
        setJsonPayload(data);
      } else if (leftPanePayloadType === 'xml') {
        //based on request content-type req xml type then res json type & vice versa
        if (contentType === 'application/xml') {
          setJsonPayload(JSON.stringify(data, null, 2));
        } else {
          setJsonPayload(data);
        }
      } else if (leftPanePayloadType === 'json') {
        if (contentType === 'application/xml') {
          setXmlPayload(JSON.stringify(data, null, 2));
        } else {
          setXmlPayload(data);
          handleBeautifyXml();
        }
      }


      setErrorMessages([{ type: 'success', message: 'Conversion successful' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    } catch (error) {
      console.error('Error converting payload:', error);

      if (axios.isCancel(error)) {
        // Request was canceled due to timeout
        handleApiError(setErrorMessages, 'Request timed out. Please check your internet connection and try again.');
      } else if (error.response) {
        // The request was made, but the server responded with a status code
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            handleApiError(setErrorMessages, 'Bad request. Please check your input and try again.');
            break;
          case 401:
            handleApiError(setErrorMessages, 'Unauthorized. Please check your credentials and try again.');
            break;
          case 404:
            handleApiError(setErrorMessages, 'Resource Not Found. Please Retry.');
            break;
          default:
            handleApiError(setErrorMessages, `Failed with status code ${statusCode}. Please try again later.`);
        }
      } else {
        // Something happened in setting up the request that triggered an error
        if (error.message === 'timeout of 15000ms exceeded') {
          handleApiError(setErrorMessages, 'Request timed out. Please check your internet connection and try again.');
        } else if (error.code === 'ECONNABORTED') {
          // The request was made but no response was received
          handleApiError(setErrorMessages, 'Request timed out. Please check your internet connection and try again.');
        } else if (error.request) {
          // The request was made but no response was received
          handleApiError(setErrorMessages, 'No response from the server. Please check your input and try again.');
        } else {
          handleApiError(setErrorMessages, 'An unexpected error occurred. Please try again later.');
        }
      }
    } finally {
      setLoading(false);
      // Scroll to the bottom of the page
      // window.scrollTo(0, document.body.scrollHeight);
      // window.scrollTo(0, document.documentElement.scrollHeight);

      // Scroll to the bottom of the page
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // -----------XML ToolBar functionalities-----------
  const handleXmlChange = (xml) => {
    setXmlPayload(xml);
  };

  const handleJsonChange = (json) => {
    setJsonPayload(json);
  };

  const handleBeautifyXml = () => {
    const beautifiedXml = vkbeautify.xml(xmlPayload).trim();
    setXmlPayload(beautifiedXml);
    setDropdownOpen(false);
  };

  const handleMinifyXml = () => {
    try {
      const minifiedXml = minify(xmlPayload);
      setXmlPayload(minifiedXml);
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error minifying XML:', error);
      handleApiError(setErrorMessages, "Failed to minify XML. Please check your input and try again.");
    }
  };

  // Function to sort XML
  const sortXmlAttributes = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    const sortAttributes = (element) => {
      if (element.nodeType === 1) { // Check if it's an element node
        const sortedAttributes = Array.from(element.attributes)
          .sort((a, b) => a.name.localeCompare(b.name));

        for (const attribute of sortedAttributes) {
          const { name, value } = attribute;
          element.removeAttribute(name);
          element.setAttribute(name, value);
        }

        // Recursively sort attributes for child elements
        for (const childElement of element.children) {
          sortAttributes(childElement);
        }
      }
    };

    sortAttributes(xmlDoc.documentElement);

    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  };

  const handleSortXmlKeys = () => {
    const sortedXml = sortXmlAttributes(xmlPayload);
    setXmlPayload(sortedXml);
  };

  const handleValidXml = () => {
    const parser = new DOMParser();
    setDropdownOpen(false);
    try {
      const xmlDoc = parser.parseFromString(xmlPayload, 'application/xml');

      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML');
      }
      setErrorMessages([{ type: 'success', message: 'Valid XML Provided!' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    } catch (error) {
      console.error('Invalid XML:', error);
      setErrorMessages([{ type: 'warning', message: 'Invalid XML Provided!' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    }
  };

  const handleSampleXml = () => {
    const sampleXml = CONSTANTS.sampleXmlData;
    setXmlPayload(sampleXml);
    setDropdownOpen(false);
  };

  const handleClearXml = () => {
    setXmlPayload('');
    setDropdownOpen(false);
    setErrorMessages([]);
    //setError(null);
  };

  const handleCopyXml = () => {
    //logic to copy the Payload to the clipboard here
    navigator.clipboard.writeText(xmlPayload).then(() => {
      setErrorMessages([{ type: 'info', message: 'Copied to Clipboard' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    }).catch((error) => {
      console.error('Error copying XML:', error);
      setErrorMessages([{ type: 'warning', message: 'Failed to copy XML' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    });
    setDropdownOpen(false);
  };

  // -----------XML & JSON Common ToolBar functionalities-----------
  const handleClearAll = () => {
    setXmlPayload('');
    setJsonPayload('');
    setDropdownOpen(false);
    setErrorMessages([]);
    //setError(null);
  };

  const handleOpenFile = (event, paneTypeXorJ) => {
    let fileInput;
    if (paneTypeXorJ === "xml") fileInput = document.getElementById('fileInputXml');
    if (paneTypeXorJ === "json") fileInput = document.getElementById('fileInputJson');
    fileInput.click();
  };


  const handleFileChange = (event, paneTypeXorJ) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        if (paneTypeXorJ === "xml") (leftPanePayloadType === 'json') ? setJsonPayload(fileContent) : setXmlPayload(fileContent);
        if (paneTypeXorJ === "json") (leftPanePayloadType === 'xml') ? setJsonPayload(fileContent) : setXmlPayload(fileContent);
        setDropdownOpen(false);
      };

      reader.readAsText(file);
    }
  };

  const handleDownload = (paneTypeXorJ) => {
    // logic to download the file here
    let blob;
    if (paneTypeXorJ === "xml") blob = new Blob([xmlPayload], { type: 'application/xml' });
    if (paneTypeXorJ === "json") blob = new Blob([jsonPayload], { type: 'application/json' });
    if (paneTypeXorJ === "text") blob = new Blob([jsonPayload], { type: 'application/text' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    if (paneTypeXorJ === "xml") a.download = 'Converted-payload.xml';
    if (paneTypeXorJ === "json") a.download = 'Converted-payload.json';
    if (paneTypeXorJ === "text") a.download = 'Converted-payload.text';
    a.click();
    window.URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };

  // const handleResizeWindow = () => {
  //   // Implement the logic to resize the window here
  //   // For example, you can set the window width to half of the current width
  //   const newWidth = window.innerWidth / 2;
  //   window.resizeTo(newWidth, window.innerHeight);
  //   setDropdownOpen(false); // Close the dropdown
  // };

  // const handleResizeWindow = () => {
  //   // Implement the logic to resize the panes here
  //   const newWidth = window.innerWidth / 2;
  //   setPaneWidth(newWidth); // Use state to manage the width of the panes

  //   setDropdownOpen(false); // Close the dropdown
  // };

  const doNothing = () => { }

  const handleSampleText = () => {
    // Implement the logic to generate or fetch a sample JSON here
    const sampleText = CONSTANTS.sampleTextData;
    setXmlPayload(sampleText);
    setDropdownOpen(false);
  }
  // -----------JSON ToolBar functionalities-----------

  const handleBeautifyJson = () => {
    try {
      const beautifiedJson = JSON.stringify(JSON.parse(jsonPayload), null, 2);
      setJsonPayload(beautifiedJson);
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error beautifying JSON:', error);
      setErrorMessages([{ type: 'warning', message: 'Failed to beautify JSON' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    }
  };

  const handleMinifyJson = () => {
    try {
      const minifiedJson = JSON.stringify(JSON.parse(jsonPayload));
      setJsonPayload(minifiedJson);
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error minifying JSON:', error);
      setErrorMessages([{ type: 'warning', message: 'Failed to minify JSON' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    }
  };

  const handleSortJsonKeys = () => {
    // Implement the logic to sort JSON keys alphabetically
    try {
      const parsedJson = JSON.parse(jsonPayload);
      const sortedJson = sortObjectKeys(parsedJson);
      const jsonString = JSON.stringify(sortedJson, null, 2);
      setJsonPayload(jsonString);
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error sorting JSON keys:', error);
      handleApiError(setErrorMessages, 'Failed to sort JSON keys. Please check your JSON and try again.');
    }
  };

  // Function to sort object keys alphabetically
  const sortObjectKeys = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => sortObjectKeys(item));
    }

    return Object.keys(obj)
      .sort()
      .reduce((sortedObj, key) => {
        sortedObj[key] = sortObjectKeys(obj[key]);
        return sortedObj;
      }, {});
  };

  const handleValidJSON = () => {
    setDropdownOpen(false);
    try {
      JSON.parse(jsonPayload);
      setErrorMessages([{ type: 'success', message: 'Valid JSON Provided!' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    } catch (error) {
      console.error('Invalid JSON:', error);
      setErrorMessages([{ type: 'warning', message: 'Invalid JSON Provided!' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    }
  };

  const handleSampleJson = () => {
    // Implement the logic to generate or fetch a sample JSON here
    const sampleJson = CONSTANTS.sampleJsonData;
    setJsonPayload(sampleJson);
    setDropdownOpen(false);
  };

  const handleCopyJson = () => {
    // Implement the logic to copy the XML to the clipboard here
    navigator.clipboard.writeText(jsonPayload).then(() => {
      setErrorMessages([{ type: 'info', message: 'Copied to Clipboard' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    }).catch((error) => {
      console.error('Error copying JSON:', error);
      setErrorMessages([{ type: 'warning', message: 'Failed to copy JSON' }]);
      setTimeout(() => {
        setErrorMessages([]);
      }, 2500);
    });
    setDropdownOpen(false);
  };

  const handleClearJson = () => {
    setJsonPayload('');
    setDropdownOpen(false);
    setErrorMessages([]);
  };



  return (
    <div className="app-container">
      <Header />
      <div className="editor-buttons">
        <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
          <div>
            <div
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown();
              }}
              className="cog-button"
            >
              <TooltipWrapper icon={<SiConvertio className={`cog-icon ${isDropdownOpen ? 'rotate' : ''}`} />} text="-- select converter --" />
            </div>
            <div className="dropdown-content">
              <TooltipWrapper icon={<BsFiletypeXml />} action={() => loadConverter('xml-to-json')} text="XML to JSON" />
              <TooltipWrapper icon={<BsFiletypeJson />} action={() => loadConverter('json-to-xml')} text="JSON to XML" />
              <TooltipWrapper icon={<VscJson />} action={() => loadConverter('xml-to-contracts')} text="XML to SnakeCase Json" />
              <TooltipWrapper icon={<VscCode />} action={() => loadConverter('xsl-for-transformation')} text="Get XSL script for Input" />
              <TooltipWrapper icon={<BsTrash3 />} action={handleClearAll} text="Clear All" />
            </div>
          </div>
        </div>
      </div>
      <div className="buttons-container">
        {loading ? <p>Processing...</p> : (
          <>
            <div onClick={handleConvert}>{converterType}</div>
          </>
        )}
        {errorMessages.length > 0 &&
          errorMessages.map((error, index) => (
            <Alert key={index} variant={error.type}>
              {error.message}
            </Alert>
          ))}
      </div>
      <div className="editors-container is-fluid">
        {/* LeftEditor */}
        <div className="left-editor-pane columns mb-0 is-desktop">
          {/*Toolbar */}
          <div className="editor-toolbar">
            <div title="Format Payload" onClick={() => (leftPanePayloadType === 'xml') ? handleBeautifyXml() : (leftPanePayloadType === 'json') ? handleBeautifyJson() : doNothing()} style={{ fontSize: '22px' }}><MdFormatIndentIncrease /></div>
            <div title="Minify Payload" onClick={() => (leftPanePayloadType === 'xml') ? handleMinifyXml() : (leftPanePayloadType === 'json') ? handleMinifyJson() : doNothing()} style={{ fontSize: '24px' }}><CgFormatLeft /></div>
            <div title="Sort Payload" onClick={() => (leftPanePayloadType === 'xml') ? handleSortXmlKeys() : (leftPanePayloadType === 'json') ? handleSortJsonKeys() : doNothing()} style={{ fontSize: '22px' }}><TbSortAscendingLetters /></div>
            <div title="Validate Payload" onClick={() => (leftPanePayloadType === 'xml') ? handleValidXml() : (leftPanePayloadType === 'json') ? handleValidJSON() : doNothing()} style={{ fontSize: '22px' }}><LiaCheckCircle /></div>
            <div className="icon is-hidden-desktop-only is-hidden-mobile" style={{ marginRight: '30px', float: 'right' }}>
              <i>{leftPaneType} Pane</i>
            </div>
            <div title="Sample Payload" onClick={() => (leftPanePayloadType === 'xml') ? handleSampleXml() : (leftPanePayloadType === 'json') ? handleSampleJson() : handleSampleText()}><FaFile /></div>
            <div title="Open File" onClick={(e) => handleOpenFile(e, 'xml')} style={{ fontSize: '24px' }}>
              <MdDriveFolderUpload />
              <input
                type="file"
                id="fileInputXml"
                onChange={(e) => handleFileChange(e, 'xml')}
                style={{ display: 'none' }}
              />
            </div>
            <div title="Download Payload" onClick={() => (leftPanePayloadType === 'xml') ? handleDownload('xml') : (leftPanePayloadType === 'json') ? handleDownload('json') : handleDownload('text')} ><FaDownload /></div>
            <div title="Copy Payload" onClick={() => (leftPanePayloadType === 'xml') ? handleCopyXml() : (leftPanePayloadType === 'json') ? handleCopyJson() : handleCopyXml()}><FaCopy /></div>
            <div title="Clear Payload" onClick={() => (leftPanePayloadType === 'xml') ? handleClearXml() : (leftPanePayloadType === 'json') ? handleClearJson() : handleClearXml()}><FaTrash /></div>
            {/* <div title="Resize Window" onClick={handleCopyXml}><FaArrowsAlt FaCompress/></div> */}
          </div>
          <LeftSideEditor xml={(leftPanePayloadType === 'xml') ? xmlPayload : (leftPanePayloadType === 'json') ? jsonPayload : xmlPayload} onChange={handleXmlChange} payloadType={leftPanePayloadType} />
        </div>
        <div className="buttons-container-inner">
          {loading ? <p>Processing...</p> : (
            <>
              <div onClick={handleConvert}>{converterType}</div>
            </>
          )}
          {errorMessages.length > 0 &&
            errorMessages.map((error, index) => (
              <Alert key={index} variant={error.type}>
                {error.message}
              </Alert>
            ))}
        </div>
        {/* RightEditor */}
        <div className="right-editor-pane columns mb-0 is-desktop">
          {/*Toolbar */}
          <div className="editor-toolbar">
            <div title="Format Payload" onClick={() => (rightPanePayloadType === 'xml') ? handleBeautifyXml() : (rightPanePayloadType === 'json') ? handleBeautifyJson() : doNothing()} style={{ fontSize: '22px' }}><MdFormatIndentIncrease /></div>
            <div title="Minify Payload" onClick={() => (rightPanePayloadType === 'xml') ? handleMinifyXml() : (rightPanePayloadType === 'json') ? handleMinifyJson() : doNothing()} style={{ fontSize: '24px' }}><CgFormatLeft /></div>
            <div title="Sort Payload" onClick={() => (rightPanePayloadType === 'xml') ? handleSortXmlKeys() : (rightPanePayloadType === 'json') ? handleSortJsonKeys() : doNothing()} style={{ fontSize: '22px' }}><TbSortAscendingLetters /></div>
            <div title="Validate Payload" onClick={() => (rightPanePayloadType === 'xml') ? handleValidXml() : (rightPanePayloadType === 'json') ? handleValidJSON() : doNothing()} style={{ fontSize: '22px' }}><LiaCheckCircle /></div>
            <div className="icon is-hidden-desktop-only is-hidden-mobile" style={{ marginRight: '30px', float: 'right' }}>
              <i>{rightPaneType} Pane</i>
            </div>
            <div title="Sample Payload" onClick={() => (rightPanePayloadType === 'xml') ? handleSampleXml() : (rightPanePayloadType === 'json') ? handleSampleJson() : handleSampleText()}><FaFileAlt /></div>
            <div title="Open File" onClick={(e) => handleOpenFile(e, 'json')} style={{ fontSize: '24px' }}>
              <MdDriveFolderUpload />
              <input
                type="file"
                id="fileInputJson"
                onChange={(e) => handleFileChange(e, 'json')}
                style={{ display: 'none' }}
              />
            </div>
            <div title="Download Payload" onClick={() => (rightPanePayloadType === 'xml') ? handleDownload('xml') : (rightPanePayloadType === 'json') ? handleDownload('json') : handleDownload('text')} ><FaDownload /></div>
            <div title="Copy Payload" onClick={() => (rightPanePayloadType === 'xml') ? handleCopyXml() : (rightPanePayloadType === 'json') ? handleCopyJson() : handleCopyJson()}><FaCopy /></div>
            <div title="Clear Payload" onClick={() => (rightPanePayloadType === 'xml') ? handleClearXml() : (rightPanePayloadType === 'json') ? handleClearJson() : handleClearJson()}><FaTrash /></div>
            {/* <div title="Resize Window" onClick={handleBeautifyXml}><FaArrowsAlt FaCompress/></div> */}
          </div>
          <RightSideEditor json={(rightPanePayloadType === 'xml') ? xmlPayload : (rightPanePayloadType === 'json') ? jsonPayload : jsonPayload} onChange={handleJsonChange} payloadType={rightPanePayloadType} />
        </div>
      </div>
      <Footer />
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ConverterAppMain;
