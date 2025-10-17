import clientPromise from '../mongodb'
import { ObjectId } from 'mongodb'

export class User {
  static async getCollection() {
    const client = await clientPromise
    return client.db().collection('users')
  }

  static async create(userData) {
    const collection = await this.getCollection()
    const result = await collection.insertOne({
      ...userData,
      created_at: new Date(),
      isAdmin: false
    })
    return result.insertedId
  }

  static async findByEmail(email) {
    const collection = await this.getCollection()
    return collection.findOne({ email })
  }

  static async findById(id) {
    const collection = await this.getCollection()
    return collection.findOne({ _id: new ObjectId(id) })
  }

  static async getAll() {
    const collection = await this.getCollection()
    return collection.find({}).toArray()
  }
}