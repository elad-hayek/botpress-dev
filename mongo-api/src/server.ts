import express, { Request, Response } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://root:example@localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for your MongoDB entries
interface User extends Document {
  id: string;
  conversationId: string;
  remindAt: string | null;
  [key: string]: any; // Allow any additional properties
}

const userSchema = new Schema<User>({
  id: String,
  conversationId: String,
  remindAt: String,
});

const UserModel = mongoose.model<User>('User', userSchema);

app.use(bodyParser.json());

// API endpoints
app.get('/states', async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/states', async (req: Request, res: Response) => {
  const { id, conversationId, remindAt } = req.body;

  try {
    const newUser = new UserModel({ id, conversationId, remindAt });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
