const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
},
dateOfBirth: { 
    type: Date, 
    required: true 
},
gender: { 
    type: String, 
    required: true 
},
maritalStatus: { 
    type: String, 
    required: true 
},
nationality: { 
    type: String 
},
contactNumber: { 
    type: String, 
    required: true 
},
emailAddress: { 
    type: String 
},
address: { 
    type: String, 
    required: true 
},
employeeID: { 
    type: String, 
    required: true 
},
department: { 
    type: String, 
    required: true 
},
designation: { 
    type: String, 
    required: true 
},
pondNumber: { 
    type: String 
},
dateOfJoining: { 
    type: Date, 
    required: true 
},
employmentType: { 
    type: String

},
netSalary: { 
    type: Number, 
    required: true 
},
Status: { 
    type: String, 
    required: true 
},
education: { 
    type: String, 
    required: true 
},
  photo: { 
    type: String
    
    },
  nidPhoto: {
    type: String
    
   },
  certificateCopy: {
    type: String
   },
});

module.exports = mongoose.model('Employee', employeeSchema);
