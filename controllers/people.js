const { Console } = require('console');
const { Validator } = require('jsonschema');

exports.getPosts = (req, res, next) => {
  const PropertiesReader = require('properties-reader');
  const prop = PropertiesReader('resources/app.properties');
  getProperty = (pty) => {return prop.get(pty);}

  var person = require(getProperty('persons.list'));
  res.status(200).json({
    posts: person
  });
};

exports.getPostsBySSN = (req, res, next) => {
  const PropertiesReader = require('properties-reader');
  const prop = PropertiesReader('resources/app.properties');
  getProperty = (pty) => {return prop.get(pty);}

  var person = require(getProperty('persons.list'));
  person.forEach(element => {

    if (req.params.socialSecurityNumber == element.socialSecurityNumber) {
      res.status(200).json({
        posts: person
      });
    } else {
      res.status(404).json({
        message: '404 Not Found Error'
      })
    }

    console.log(element.socialSecurityNumber);
  })

};

exports.createPost = (req, res, next) => {

  const PropertiesReader = require('properties-reader');
  const prop = PropertiesReader('resources/app.properties');
  getProperty = (pty) => {return prop.get(pty);}
  // console.log(getProperty('persons.list'));
  
  const fs = require('fs');

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dateOfBirth = req.body.dateOfBirth;
  const emailAddress = req.body.emailAddress;
  const socialSecurityNumber = req.body[0].socialSecurityNumber;

  var userSchema = { "id": "/Person", "type": "object", "properties": { "firstName": { "type": "string" }, "lastName": { "type": "string" },
                     "dateOfBirth": { "type": "string" }, "emailAddress": { "type": "string", "format": "email" }, "socialSecurityNumber": { "type": "string" }},
                     "required" :["firstName","lastName","dateOfBirth", "emailAddress", "socialSecurityNumber"], "additionalProperties": false };
  
  var validator = new Validator();
  validator.addSchema(userSchema, "/Person");

  if (req.get("Content-Type") != "application/json") {
    res.status(401).send("Invalid header format");
    return;
  }

  try {
    req.body.forEach(element => {
      validator.validate(element, userSchema, {"throwError": true});
    })
  }
  catch (error) {
    res.status(401).end("Invalid body format: " + error.message);
    return;
  }

  var persons = require(getProperty('persons.list'));
  var ssns = persons.map(getSSN);

  console.log("TEST" + ssns);

  if (!ssns.includes(socialSecurityNumber)) {
    persons.push(req.body[0]);
    fs.writeFileSync(getProperty('persons.updated.file'), JSON.stringify(persons));

    res.status(201).json({
      message: 'Post created successfully!',
      post: { id: new Date().toISOString(), firstName: firstName, lastName: lastName, dateOfBirth: dateOfBirth, emailAddress: emailAddress, socialSecurityNumber: socialSecurityNumber }
    });
  } else {
    res.status(400).json({
      message: '400 Bad Request'
    })
  }
};

exports.updatePut = (req, res, next) => {

  const fs = require('fs');

  const PropertiesReader = require('properties-reader');
  const prop = PropertiesReader('resources/app.properties');
  getProperty = (pty) => {return prop.get(pty);}

  var persons = require(getProperty('persons.list'));
  var ssns = persons.map(getSSN);

  const firstName = req.body[0].firstName;
  const lastName = req.body[0].lastName;
  const dateOfBirth = req.body[0].dateOfBirth;
  const emailAddress = req.body[0].emailAddress;
  const socialSecurityNumber = req.body[0].socialSecurityNumber;

  var userSchema = { "id": "/Person", "type": "object", "properties": { "firstName": { "type": "string" }, "lastName": { "type": "string" },
                    "dateOfBirth": { "type": "string" }, "emailAddress": { "type": "string", "format": "email" }, "socialSecurityNumber": { "type": "string" }},
                    "required" :["firstName","lastName","dateOfBirth", "emailAddress", "socialSecurityNumber"], "additionalProperties": false };
  
  var validator = new Validator();
  validator.addSchema(userSchema, "/Person");

  if (req.get("Content-Type") != "application/json") {
    res.status(401).send("Invalid header format");
    return;
  }

  try {
    req.body.forEach(element => {
      validator.validate(element, userSchema, {"throwError": true});
    })
  }
  catch (error) {
    res.status(401).end("Invalid body format: " + error.message);
    return;
  }

  if ((ssns.includes(req.params.socialSecurityNumber)) && (req.params.socialSecurityNumber == req.body[0].socialSecurityNumber)) {
    persons = persons.filter(({socialSecurityNumber}) => socialSecurityNumber !== req.body[0].socialSecurityNumber);
    persons.push(req.body[0]);
    console.log("TEST" + JSON.stringify(persons, null, 2));

    fs.writeFileSync(getProperty('persons.updated.file'), JSON.stringify(persons));

    res.status(200).json({
      message: 'Put updated successfully!',
      post: { firstName: firstName, lastName: lastName, dateOfBirth: dateOfBirth, emailAddress: emailAddress, socialSecurityNumber: socialSecurityNumber }
    });
  } else {
    res.status(400).json({
      message: '400 Bad Request'
    })
  }
};

exports.deletePostsBySSN = (req, res, next) => {
  const fs = require('fs');

  const PropertiesReader = require('properties-reader');
  const prop = PropertiesReader('resources/app.properties');
  getProperty = (pty) => {return prop.get(pty);}

  var persons = require(getProperty('persons.list'));
  var ssns = persons.map(getSSN);

  const socialSecurityNumber = req.params.socialSecurityNumber;
  console.log(socialSecurityNumber);

  if (ssns.includes(req.params.socialSecurityNumber)) {
    persons = persons.filter(({socialSecurityNumber}) => socialSecurityNumber !== req.params.socialSecurityNumber);
    console.log("TEST" + JSON.stringify(persons, null, 2));

    fs.writeFileSync(getProperty('persons.updated.file'), JSON.stringify(persons));

    res.status(200).json({
      message: 'Delete successful!',
      post: { socialSecurityNumber: "xxx-xx-" + socialSecurityNumber.substr(7,9) }
    });
  } else {
    res.status(400).json({
      message: '400 Bad Request'
    })
  }
};

function getSSN(item) {

  return item.socialSecurityNumber;
}