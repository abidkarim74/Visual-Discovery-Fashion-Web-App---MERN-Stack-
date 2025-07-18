import bcrypt from 'bcrypt';


export const hashPasswordFunc = async (plainPassword: String) => {
  const saltRounds = 10;
  const converted = String(plainPassword);
  const hashedPassword = await bcrypt.hash(converted, saltRounds);

  return hashedPassword;
}