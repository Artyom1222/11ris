export interface IAdmin {
  id: string;
  login: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminDTO {
  login: string;
  password: string;
  isActive?: boolean;
}

export interface IAdminLoginDTO {
  login: string;
  password: string;
}

export interface ITokenPayload {
  id: string;
  login: string;
}

export interface ILoginResponse {
  token: string;
}
