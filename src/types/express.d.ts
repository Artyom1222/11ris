import { ITokenPayload } from '../../interfaces/admin.interface';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends ITokenPayload {}
  }
}
