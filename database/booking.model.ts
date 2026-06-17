import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to validate email format
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Booking Schema definition with validation
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) => validateEmail(email),
        message: 'Invalid email format',
      },
    },
  },
  { timestamps: true }
);

// Create index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

// Pre-save hook: verify referenced event exists
bookingSchema.pre<IBooking>('save', async function () {
  try {
    // Only validate eventId if it's modified or new
    if (this.isModified('eventId') || this.isNew) {
      const eventExists = await Event.exists({ _id: this.eventId });
      if (!eventExists) {
        throw new Error(`Event with ID ${this.eventId} does not exist`);
      }
    }
  } catch (error) {
    throw error;
  }
});

// Create or retrieve the Booking model
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
export type { IBooking };
