import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const backendUrl =
    process.env.NODE_ENV === "development"
      ? "http://nginx/me"
      : "http://nginx/me";
  const cookieHeader = req.headers.cookie || "";
  const apiRes = await fetch(backendUrl, {
    method: "GET",
    headers:{
      "Cookie": cookieHeader,
    },
    credentials: "include",
  });

  const data = await apiRes.json();
  res.status(apiRes.status).json(data);
}
