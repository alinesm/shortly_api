import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import connection from "../databases/db.js";

export async function signUp(req, res) {
  const { name, email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);

  const checkUser = await connection.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  if (checkUser.rowCount > 0)
    return res.status(409).send("Esse usuário já existe");

  try {
    await connection.query(
      `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3);
    `,
      [name, email, passwordHash]
    );
    res.status(201).send("Usuário cadastrado com sucesso");
  } catch (error) {
    console.log(error);
    res.status(500).send("Deu um problema no servidor!");
  }
}

export async function signIn(req, res) {
  const user = res.locals.user;
  console.log(user.id);
  const token = uuidV4();

  try {
    await connection.query(
      `
    INSERT INTO sessions ("userId", token) 
    VALUES ($1, $2);
    `,
      [user.id, token]
    );

    res.send({ token: token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Deu problema no servidor");
  }
}