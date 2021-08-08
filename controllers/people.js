const { Console } = require('console');
const { Validator } = require('jsonschema');
var people = require('../model/peopleModel.js');
var persons = require(people.getFileLocation(true));
const fs = require('fs');
var ssns = persons.map(getSSN);

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: persons
  });

};

exports.getPostsBySSN = (req, res, next) => {
  persons.forEach(element => {

    if (req.params.socialSecurityNumber == element.socialSecurityNumber) {
      res.status(200).json({
        posts: persons
      });
    } else {
      res.status(404).json({
        message: '404 Not Found Error'
      })
    }
  })

};

exports.createPost = (req, res) => {
  const isValidRequest = people.validateRequest(req, res);

  req.body.forEach(element => {
    if (isValidRequest) {
      if (!ssns.includes(element.socialSecurityNumber)) {
        requestFailed = false;
        persons.push(element);
        fs.writeFileSync(people.getFileLocation(false), JSON.stringify(persons));

        res.status(201).json({
          message: 'Post created successfully!',
          post: req.body
        });
      } else {
        res.status(400).json({
          message: '400 Bad Request'
        })
      }
    }
  })
};

exports.updatePut = (req, res) => {

  console.log(ssns);
  req.body.forEach(element => {
    if ((ssns.includes(req.params.socialSecurityNumber)) && (req.params.socialSecurityNumber == element.socialSecurityNumber)) {
      persons = persons.filter(({ socialSecurityNumber }) => socialSecurityNumber !== element.socialSecurityNumber);
      persons.push(element);

      fs.writeFileSync(people.getFileLocation(false), JSON.stringify(persons));

      res.status(200).json({
        message: 'Put updated successfully!',
        post: req.body
      });
    } else {
      res.status(400).json({
        message: '400 Bad Request'
      })
    }
  })
};

exports.deletePostsBySSN = (req, res, next) => {

  const firstName = req.body[0].firstName;
  const lastName = req.body[0].lastName;
  const dateOfBirth = req.body[0].dateOfBirth;
  const emailAddress = req.body[0].emailAddress;
  const socialSecurityNumber = req.body[0].socialSecurityNumber;
  const socialSecurityNumberParam = req.params.socialSecurityNumber;

  if ((ssns.includes(socialSecurityNumberParam)) && (socialSecurityNumber == socialSecurityNumberParam)) {
    persons = persons.filter(({ socialSecurityNumber }) => socialSecurityNumber !== req.params.socialSecurityNumber);

    fs.writeFileSync(people.getFileLocation(false), JSON.stringify(persons));

    res.status(200).json({
      message: 'Delete successful!',
      post: { firstName: firstName, lastName: lastName, dateOfBirth: dateOfBirth, emailAddress: emailAddress, socialSecurityNumber: "xxx-xx-" + socialSecurityNumber.substr(7, 9) }
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