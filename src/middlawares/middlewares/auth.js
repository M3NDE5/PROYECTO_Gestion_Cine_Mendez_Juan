import jwt from 'jsonwebtoken';

export function authMiddleware(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'no se ha podido enviar el token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    return res.status(401).json({ message: 'el token es invalido o ha sido expirado' });
  }
}
