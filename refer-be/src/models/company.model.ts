import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  domain: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model<ICompany>('Company', CompanySchema);
export default Company;
