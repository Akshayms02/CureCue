import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import doctorModel, { IDoctor } from "../models/doctorModel";
import bcrypt from "bcrypt";

export class DoctorRepository implements IDoctorRepository {
  async existUser(email: string): Promise<IDoctor | null> {
    console.log("hello from DoctorRepository");
    return await doctorModel.findOne({ email });
  }

  async createUser(userData: IDoctor): Promise<IDoctor> {
    try {
      console.log("Creating new user with :", userData);
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
      const user = await doctorModel.findOne(
        { email },
        {
          _id: 0,
          doctorId: 1,
          name: 1,
          email: 1,
          phone: 1,
          password: 1,
          isBlocked: 1,
        }
      );

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
}
