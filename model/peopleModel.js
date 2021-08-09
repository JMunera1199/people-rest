module.exports = {
    getFileLocation: function (isForReadingFile) {
        const PropertiesReader = require('properties-reader');
        const prop = PropertiesReader('resources/app.properties');
        getProperty = (pty) => { return prop.get(pty); }

        if(isForReadingFile){
            return getProperty('persons.list');
        } else {
            return getProperty('persons.updated.file');
        }
        
    },
    validateRequest: function (req, res) {
        const { Validator } = require('jsonschema');
        var userSchema = {
            "id": "/Person", "type": "object", "properties": {
                "firstName": { "type": "string" }, "lastName": { "type": "string" },
                "dateOfBirth": { "type": "string", "format": "date" }, "emailAddress": { "type": "string", "format": "email" }, "socialSecurityNumber": { "type": "string" }
            },
            "required": ["firstName", "lastName", "dateOfBirth", "emailAddress", "socialSecurityNumber"], "additionalProperties": false
        };

        var validator = new Validator();
        validator.addSchema(userSchema, "/Person");

        if (req.get("Content-Type") != "application/json") {
            res.status(401).send("Invalid header format");
            return false;
        }

        try {
            req.body.forEach(element => {
                validator.validate(element, userSchema, { "throwError": true });
            })
        } 
        catch (error) {
            res.status(401).end("Invalid body format: " + error.message);
            return false;
        }
        
        return true;
    }
};