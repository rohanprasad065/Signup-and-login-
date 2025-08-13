const mongoose = require('mongoose');

// 1️⃣ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 2️⃣ Define a Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  email: { type: String, unique: true }
});

// 3️⃣ Create a Model
const User = mongoose.model('User', userSchema);

// 4️⃣ Test: Insert a document
async function testInsert() {
  try {
    const newUser = new User({
      name: 'John Doe',
      age: 25,
      email: 'johndoe@example.com'
    });

    const savedUser = await newUser.save();
    console.log('📌 User saved:', savedUser);
  } catch (err) {
    console.error('❌ Error saving user:', err.message);
  }
}

// 5️⃣ Test: Find all users
async function testFind() {
  try {
    const users = await User.find();
    console.log('📌 All users:', users);
  } catch (err) {
    console.error('❌ Error finding users:', err.message);
  }
}

// Run tests after connection
mongoose.connection.once('open', async () => {
  await testInsert();
  await testFind();
});
