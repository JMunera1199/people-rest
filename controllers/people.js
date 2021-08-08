var people = require('../model/peopleModel.js');
var persons = require(people.getFileLocation(true));
const fs = require('fs');
var ssns = persons.map(getSSN);

exports.getPosts = (req, res) => {
  res.status(200).json({
    posts: persons
  });

};

exports.getPostsBySSN = (req, res) => {
  if (persons.length > 0) {
    console.log(persons);
    persons.forEach(element => {

      if (req.params.socialSecurityNumber == element.socialSecurityNumber) {
        res.status(200).json({
          posts: element
        });
      }
    })
  } else {
    res.status(404).json({
      message: '404 Not Found Error'
    })
  }
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

exports.deletePostsBySSN = (req, res) => {
  
  const socialSecurityNumberParam = req.params.socialSecurityNumber;

  if ((ssns.includes(socialSecurityNumberParam))) {
    persons = persons.filter(({ socialSecurityNumber }) => socialSecurityNumber != socialSecurityNumberParam);

    fs.writeFileSync(people.getFileLocation(false), JSON.stringify(persons));

    res.status(200).json({
      message: 'Delete successful!'
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