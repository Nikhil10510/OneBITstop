import mongoose from 'mongoose';

const carpoolSchema = new mongoose.Schema({
  pickupLocation: {
    type: String,
    required: true
  },
  dropLocation: {
    type: String,
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  departureTime: {
    type: String,
    required: true // HH:mm format
  },
  seatsAvailable: {
    type: Number,
    required: true,
    min: 1
  },
  additionalNotes: {
    type: String
  },
  contactNumber: {
    type: String,
    required: true,
    match: [/^[0-9]{10,15}$/, 'Please enter a valid contact number']
  },
  email: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Carpool = mongoose.model('Carpool', carpoolSchema);

export default Carpool;
