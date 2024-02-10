// process.env.NODE_ENV = 'PRODUCTION';
// var Config = require('config-js');
// var config = new Config('./conf/app_##');

// lets separate out environment varibles & config.js chnages from our code 

// config.js
// config.js
module.exports = {
  REACT_APP_API_URL: 'https://kadamharshad25-eval-prod.apigee.net/api/v1',

  sampleTextData: "Write XSL for removal of node cardNumber & cardCvv from below XML payload.\n<cardDetails>\n  <cardHolderName>Harshad Kadam</cardHolderName>\n  <cardBrand>MasterCard</cardBrand>\n  <cardNumber>5105105105105100</cardNumber>\n  <expDate>1228</expDate>\n  <cardCvv>342</cardCvv>\n</cardDetails>",

  sampleJsonData: `{
      "name": "ABC Corporation",
      "employees": {
        "employee": [
          {
            "id": "1",
            "name": "John Doe",
            "position": "Software Engineer",
            "salary": "80000"
          },
          {
            "id": "2",
            "name": "Jane Smith",
            "position": "Project Manager",
            "salary": "100000"
          }
        ]
      },
      "departments": {
        "department": [
          {
            "id": "101",
            "name": "Engineering",
            "location": "Building A"
          },
          {
            "id": "102",
            "name": "Marketing",
            "location": "Building B"
          }
        ]
      }
    }`,

  sampleXmlData: `<?xml version="1.0" encoding="UTF-8"?>
    <company>
      <name>ABC Corporation</name>
      <employees>
        <employee>
          <id>1</id>
          <name>John Doe</name>
          <position>Software Engineer</position>
          <salary>80000</salary>
        </employee>
        <employee>
          <id>2</id>
          <name>Jane Smith</name>
          <position>Project Manager</position>
          <salary>100000</salary>
        </employee>
      </employees>
      <departments>
        <department>
          <id>101</id>
          <name>Engineering</name>
          <location>Building A</location>
        </department>
        <department>
          <id>102</id>
          <name>Marketing</name>
          <location>Building B</location>
        </department>
      </departments>
    </company>`,
};

