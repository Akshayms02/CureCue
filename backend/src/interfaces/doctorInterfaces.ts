export type doctorType = {
  doctorId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  kycStatus: string;
};

export interface Doctor {
  doctorId: string;
  name: string;
  phone: string;
  email: string;
  isBlocked: boolean;
}

export interface DoctorState {
  doctorInfo: Doctor | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface DoctorData {
  email: string;
  name: string;
  gender: string;
  dob: Date;
  department: string;
  fees: number;
  aadhaarNumber: number;
}
export interface FileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: any;
  size: number;
}

export interface DoctorFiles {
  image?: FileData[];
  aadhaarFrontImage?: FileData[];
  aadhaarBackImage?: FileData[];
  certificateImage?: FileData[];
  qualificationImage?: FileData[];
}
export interface docDetails {
  profileUrl: {
    type: string;
    url: string;
  };
  aadhaarFrontImageUrl: {
    type: string;
    url: string;
  };
  aadhaarBackImageUrl: {
    type: string;
    url: string;
  };
  certificateUrl: {
    type: string;
    url: string;
  };
  qualificationUrl: {
    type: string;
    url: string;
  };
}
