import { verifyToken } from '../../lib/token';

export default function verify({ token }: any) {
  return verifyToken(token);
}
