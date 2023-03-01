import { customAlphabet } from "nanoid";
import connection from "../databases/db.js";

export async function createShortUrl(req, res) {
  const { url } = req.body;
  const user = res.locals.user;
  const idGenerator = customAlphabet("1234567890abcdef", 8);
  const nanoidUrl = idGenerator();

  const checkNanoidExists = await connection.query(
    `select "shortUrl" from urls where "shortUrl"=$1`,
    [nanoidUrl]
  );
  if (checkNanoidExists.rowCount > 0)
    return res.status(404).send("this shortUrl already exists");

  try {
    await connection.query(
      `
    INSERT INTO urls(url, "shortUrl", "userId", views) 
    VALUES ($1, $2, $3, $4);
    `,
      [url, nanoidUrl, user.id, 0]
    );

    const shortenUrl = await connection.query(
      `
    select * from urls where "shortUrl"=$1`,
      [nanoidUrl]
    );

    const { id, shortUrl } = shortenUrl.rows[0];

    res.status(201).send({ id, shortUrl });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getUrlById(req, res) {
  const { id } = req.params;

  try {
    const urlData = await connection.query(
      `SELECT id, "shortUrl", url FROM urls WHERE id=$1`,
      [id]
    );

    if (urlData.rowCount === 0) return res.sendStatus(404);

    res.send(urlData.rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getOpenShorten(req, res) {
  const { shortUrl } = req.params;

  try {
    const checkUrl = await connection.query(
      'SELECT * FROM urls WHERE "shortUrl"=$1',
      [shortUrl]
    );

    if (checkUrl.rowCount === 0) return res.sendStatus(404);

    const { url, views } = checkUrl.rows[0];

    await connection.query(
      `
    UPDATE urls SET views =$1  WHERE "shortUrl"=$2;
    `,
      [views + 1, shortUrl]
    );
    res.redirect(url);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function deleteUrl(req, res) {
  const user = res.locals.user;
  const { id } = req.params;

  try {
    const checkUser = await connection.query(
      'SELECT * FROM urls WHERE "userId"=$1',
      [user.id]
    );

    if (checkUser.rowCount === 0) return res.status(401).send("user not found");

    const checkUrl = await connection.query("SELECT * FROM urls WHERE id=$1", [
      id,
    ]);
    console.log(checkUrl.rows);
    if (checkUrl.rowCount === 0) return res.status(404).send("url not found");

    await connection.query("DELETE FROM urls WHERE id=$1", [id]);

    res.status(204).send("url deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getUserHistory(req, res) {
  const user = res.locals.user;
  try {
    const userMainData = await connection.query(
      `select sum(urls.views) as "visitCount" 
      from urls
      where "userId"=$1;
      `,
      [user.id]
    );

    const userLinksData = await connection.query(
      `
    select id, "shortUrl", url, views as "visitCount"
    from urls
    where "userId"=$1;`,
      [user.id]
    );

    const combinedArr = {
      id: user.id,
      name: user.name,
      visitCount: userMainData.rows[0].visitCount,
      shortenedUrls: userLinksData.rows,
    };

    res.send(combinedArr);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function listRanking(req, res) {
  try {
    const results = await connection.query(
      `select users.id, users.name, count(urls.url) as "linksCount", sum(urls.views) as "visitCount" 
     from users 
     left join urls 
     on users.id = urls."userId" 
     where urls.url is not null
     group by users.id, users.name 
     order by "visitCount" desc
     limit 10;`
    );

    res.send(results.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
