import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: any, Response: { json: (arg0: { accessToken: any; }) => any; }) {
// const code = "85ea6374c5ed2e9d1c87"
const client_id =  'Ov23liBWDEp78taeUgZO'
console.log(client_id, "this the client id")

const searchParams = req.nextUrl.searchParams
const code = searchParams.get('code')

  const options = {
    method: "POST",
    url: `https://github.com/login/oauth/access_token?client_id=Ov23liBWDEp78taeUgZO&client_secret=3ab403608e7c98008d56307e041d33cbe0c0e2dc&code=${code}&redirect_uri=http://localhost:3000/integrations/github`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  console.log(code, 'res code here')
  const response = await axios(options);

  console.log(response.data, 'access res here')

  // Return the access token as a JSON response
  return NextResponse.json({ accessToken: response.data });
}