let user = {
  "$schema": "http://json-schema.org/draft-07/schema#",
     "properties":{
     	"mail": {
            "format": "email",
            "require": true,
         },
         "name": {
            "type": "string",
            "require": true,
         },
         "surname": {
            "type": "string",
            "require": true,
         },
         "login": {
            "type": "string",
            "require": true,
            "minLength": 3,
            "maxLength": 16
         },
         "pwd":{
            "type": "string",
            "require": true,
            "minLength": 6,
            "maxLength": 24,
         },
         "dob":{
            "format": "date",
            "require": true,
         },
         "phone":{
            "type": "string",
            "require": true,
            "length": 10
         },
     }
 };

 module.exports = user;