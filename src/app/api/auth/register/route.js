import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { User } from '@/lib/models/User'
import { generateToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const existingUser = await User.findByEmail(email)

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userId = await User.create({
      email,
      password: hashedPassword,
      name,
      avatar: `https://i.pravatar.cc/150?u=${email}`
    })

    const token = generateToken(userId.toString())

    return NextResponse.json({
      token,
      user: {
        id: userId.toString(),
        name,
        email,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        isAdmin: false
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}