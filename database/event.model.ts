import mongoose, { Document, Schema, Model } from 'mongoose';

// TypeScript interface for Event document
interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-');         // Replace multiple hyphens with single
}

// Helper function to normalize date to ISO format (YYYY-MM-DD)
function normalizeDate(date: string): string {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date format');
  }
  return parsedDate.toISOString().split('T')[0];
}

// Helper function to validate and return time in HH:MM or HH:MM:SS format
function normalizeTime(time: string): string {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  if (!timeRegex.test(time)) {
    throw new Error('Time must be in HH:MM or HH:MM:SS format');
  }
  return time;
}

// Event Schema definition with validation
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // Allow null values for new documents before slug generation
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
    },
    image: {
      type: String,
      required: [true, 'Event image is required'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    mode: {
      type: String,
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Event mode must be online, offline, or hybrid',
      },
      required: [true, 'Event mode is required'],
    },
    audience: {
      type: String,
      required: [true, 'Target audience is required'],
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: (val: string[]) => val.length > 0,
        message: 'Agenda must have at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer name is required'],
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (val: string[]) => val.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  { timestamps: true }
);

// Pre-save hook: generate slug and normalize date/time
eventSchema.pre<IEvent>('save', async function () {
  try {
    // Generate slug only if title is modified or document is new
    if (this.isModified('title') || this.isNew) {
      this.slug = generateSlug(this.title);
    }

    // Normalize date to ISO format if modified
    if (this.isModified('date')) {
      this.date = normalizeDate(this.date);
    }

    // Validate and normalize time if modified
    if (this.isModified('time')) {
      this.time = normalizeTime(this.time);
    }
  } catch (error) {
    throw error;
  }
});

// Create or retrieve the Event model
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
export type { IEvent };
