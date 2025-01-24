import { account, ID } from "./init";

export const createUserAccount = async (email: string, password: string) => {
  const result = await account.create(ID.unique(), email, password);
  console.log(result);
};
