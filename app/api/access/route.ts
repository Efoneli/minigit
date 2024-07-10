import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";


const GET = withApiAuthRequired(async (req, res) => {
  const { accessToken } = await getAccessToken();
  return NextResponse.json({accessToken});
});


export { GET };