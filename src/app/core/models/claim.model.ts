export interface Claim {
  _id: string;
  benefit: string;
  fullName: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
  workPhoneNumber: string;
  dependants: boolean;
  roleStartDate: string;
  providerId: string;
  userId: string;
  status: 'pending' | 'submitted' | 'review' | 'approved' | 'rejected';
  createdAt: string;
  comments: Comment[];
  isDeleted: boolean;
}

export interface Comment {
  name: string;
  message: string;
  createdAt: string;
} 