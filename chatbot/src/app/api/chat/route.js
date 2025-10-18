import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    // Mock response
    const mockReply = `Đây là phản hồi mock từ Claude: "${message}"`;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      reply: mockReply 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}