import clientPromise from '../mongodb'
import { ObjectId } from 'mongodb'

export class Comment {
  static async getCollection() {
    const client = await clientPromise
    return client.db().collection('comments')
  }

  static async create(commentData) {
    const collection = await this.getCollection()
    const result = await collection.insertOne({
      ...commentData,
      upvotes: 0,
      created_at: new Date()
    })
    return result.insertedId
  }

  static async findById(id) {
    const collection = await this.getCollection()
    return collection.findOne({ _id: new ObjectId(id) })
  }

  static async findByParentId(parentId) {
    const collection = await this.getCollection()
    return collection.find({ parent_id: parentId }).toArray()
  }

  static async getTopLevel() {
    const collection = await this.getCollection()
    return collection.find({ parent_id: null }).sort({ created_at: -1 }).toArray()
  }

  static async updateUpvotes(id, increment) {
    const collection = await this.getCollection()
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { upvotes: increment } }
    )
  }

  static async delete(id) {
    const collection = await this.getCollection()
    return collection.deleteOne({ _id: new ObjectId(id) })
  }

  static async deleteWithReplies(id) {
    const collection = await this.getCollection()
    
    // Get all replies recursively
    const getAllReplies = async (parentId) => {
      const replies = await collection.find({ parent_id: parentId }).toArray()
      let allReplies = [...replies]
      
      for (const reply of replies) {
        const nestedReplies = await getAllReplies(reply._id.toString())
        allReplies = [...allReplies, ...nestedReplies]
      }
      
      return allReplies
    }

    const allReplies = await getAllReplies(id)
    const idsToDelete = [new ObjectId(id), ...allReplies.map(r => r._id)]
    
    return collection.deleteMany({ _id: { $in: idsToDelete } })
  }

  static async getAll() {
    const collection = await this.getCollection()
    return collection.find({}).toArray()
  }
}