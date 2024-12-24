import { Schema, models, model } from "mongoose";


const ChoralCompetitionSchema = new Schema({
  schoolName: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  musicDirector: {
    type: String,
    required: true,
  },
  supervisoryStaff: {
    type: String,
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Register = models.Register || model("Register", ChoralCompetitionSchema);
export default Register;