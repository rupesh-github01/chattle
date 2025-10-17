import {MongoClient} from 'mongodb'
import bcrypt from 'bcryptjs'


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nested-comments'

const users = [
  { name: 'Demo User', email: 'demo@example.com', password: 'demo123' },
  { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
  { name: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123', isAdmin: true }
]

const sampleComments = [
  { text: 'This is an amazing nested commenting system! The UI is so clean and intuitive.', upvotes: 15 },
  { text: 'I love how easy it is to follow conversations with the visual indentation.', upvotes: 8 },
  { text: 'Great work on implementing the collapse feature. It really helps with long threads!', upvotes: 12 },
  { text: 'The upvote system is a nice touch. Makes it easy to see popular comments.', upvotes: 6 }
]

async function seed() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    
    // Clear existing data
    await db.collection('users').deleteMany({})
    await db.collection('comments').deleteMany({})
    console.log('Cleared existing data')

    // Insert users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
        avatar: `https://i.pravatar.cc/150?u=${user.email}`,
        isAdmin: user.isAdmin || false,
        created_at: new Date()
      }))
    )

    const userResult = await db.collection('users').insertMany(hashedUsers)
    const userIds = Object.values(userResult.insertedIds)
    console.log(`Inserted ${userIds.length} users`)

    // Insert comments
    const comments = []
    
    // Top-level comments
    for (let i = 0; i < sampleComments.length; i++) {
      const comment = {
        text: sampleComments[i].text,
        upvotes: sampleComments[i].upvotes,
        user_id: userIds[i % userIds.length].toString(),
        parent_id: null,
        created_at: new Date(Date.now() - (sampleComments.length - i) * 3600000)
      }
      comments.push(comment)
    }

    const commentResult = await db.collection('comments').insertMany(comments)
    const commentIds = Object.values(commentResult.insertedIds)
    console.log(`Inserted ${commentIds.length} top-level comments`)

    // Add some replies
    const replies = [
      {
        text: 'I completely agree! The design is very modern.',
        upvotes: 3,
        user_id: userIds[1].toString(),
        parent_id: commentIds[0].toString(),
        created_at: new Date(Date.now() - 2 * 3600000)
      },
      {
        text: 'Thanks! We put a lot of effort into the UX.',
        upvotes: 5,
        user_id: userIds[0].toString(),
        parent_id: commentIds[0].toString(),
        created_at: new Date(Date.now() - 1 * 3600000)
      },
      {
        text: 'The mobile responsiveness is impressive too!',
        upvotes: 2,
        user_id: userIds[2].toString(),
        parent_id: commentIds[1].toString(),
        created_at: new Date(Date.now() - 1.5 * 3600000)
      }
    ]

    await db.collection('comments').insertMany(replies)
    console.log(`Inserted ${replies.length} replies`)

    console.log('\n✅ Database seeded successfully!')
    console.log('\nDemo credentials:')
    console.log('Email: demo@example.com')
    console.log('Password: demo123')
    console.log('\nAdmin credentials:')
    console.log('Email: admin@example.com')
    console.log('Password: admin123')

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await client.close()
  }
}

seed()