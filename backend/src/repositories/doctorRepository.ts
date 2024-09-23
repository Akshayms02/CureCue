import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import doctorModel, { IDoctor } from "../models/doctorModel";
import doctorApplicationModel from "../models/doctorApplicationModel";
import bcrypt from "bcrypt";
import { DoctorData } from "../interfaces/doctorInterfaces";
import { docDetails } from "../controllers/doctorController";

export class DoctorRepository implements IDoctorRepository {
  async existUser(email: string): Promise<IDoctor | null> {
    return await doctorModel.findOne({ email });
  }

  async createUser(userData: IDoctor): Promise<IDoctor> {
    try {
      const newUser = new doctorModel(userData);
      return await newUser.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating a new user: ${error.message}`);
      } else {
        throw new Error("Unknown error has occured");
      }
    }
  }

  async userLoginValidate(email: string, password: string): Promise<IDoctor> {
    try {
      const user = await doctorModel
        .findOne(
          { email },
          {
            _id: 0,
            doctorId: 1,
            name: 1,
            email: 1,
            phone: 1,
            password: 1,
            isBlocked: 1,
            kycStatus: 1,
            DOB: 1,
            department: 1,
            fees: 1,
            gender: 1,
            image: 1,
          }
        )
        .populate("department");

      if (!user) {
        throw new Error("User doesnt Exist");
      }

      const PassCompare = await bcrypt.compare(password, user.password);
      if (!PassCompare) {
        throw new Error("Invalid Password");
      }

      if (user.isBlocked == true) {
        throw new Error("User is blocked");
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("Unknown Error from DoctorRepositary");
      }
    }
  }

  async uploadDoctorData(
    data: DoctorData,
    docDetails: docDetails
  ): Promise<any> {
    try {
      const doctorData = await doctorModel.findOneAndUpdate(
        { email: data.email },
        { kycStatus: "submitted" },
        {
          new: true,
        }
      );
      if (doctorData) {
        const details = {
          doctorId: doctorData._id,
          name: data.name,
          DOB: data.dob,
          department: data.department,
          gender: data.gender,
          image: docDetails.profileUrl,
          fees: data.fees,
          kycDetails: {
            certificateImage: docDetails.certificateUrl,
            qualificationImage: docDetails.qualificationUrl,
            adharFrontImage: docDetails.aadhaarFrontImageUrl,
            adharBackImage: docDetails.aadhaarBackImageUrl,
            adharNumber: data.aadhaarNumber,
          },
        };

        await doctorApplicationModel.create(details);

        return doctorData;
      } else {
        return false;
      }
    } catch (error: any) {
      throw new Error(`Something went wrong : ${error}`);
    }
  }
}
