import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const host = process.env.NEXT_PUBLIC_SERVER;

export async function GET(req: NextRequest) {
  
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  console.log('привет')
  try {
    const response = await axios.get(`${host}/email/verify`,
      { params: {
        token
      } }
    );
    console.log('поймал токен')
    return NextResponse.json({ message: response.data.message }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Verification failed' }, { status: 500 });
  }
}