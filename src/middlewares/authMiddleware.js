import bcrypt from "bcrypt";
import connection from "../databases/db.js";

export function validateSchema(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return res.status(422).send(errorMessages);
    }
    next();
  };
}

// export async function signInBodyValidation(req, res, next) {
//   const { email, password } = req.body;

//   try {
//     const checkUser = await connection.query(
//       "SELECT * FROM users WHERE email=$1",
//       [email]
//     );

//     if (checkUser.rowCount === 0) return res.status(401).send("Não autorizado");

//     const passwordIsOk = bcrypt.compareSync(
//       password,
//       checkUser.rows[0].password
//     );
//     if (!passwordIsOk) return res.status(401).send("Não autorizado");

//     const user = checkUser.rows[0];
//     res.locals.user = user;
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Houve um problema no servidor");
//   }

//   next();
// }

export async function authRoutesValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).send("Não autorizado");

  try {
    const checksession = await connection.query(
      "SELECT * FROM sessions WHERE token=$1",
      [token]
    );
    if (!checksession) return res.status(401).send("Não autorizado");

    const checkUser = await connection.query(
      "SELECT * FROM users WHERE id=$1",
      [checksession.rows[0].userId]
    );
    if (!checkUser) return res.status(401).send("Não autorizado");

    const user = checkUser.rows[0];
    console.log(user);
    res.locals.user = user;
  } catch (error) {
    console.erro(error);
    res.status(500).send("Houve um problema no servidor");
  }

  next();
}
