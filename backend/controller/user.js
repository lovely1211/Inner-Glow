const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerUser = async(req, res) => {
    try{
        const {name, email, age, password} = req.body;
        const existingUser = await User.findOne({email})
        if(existingUser){
            res.status(400).json({message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            age,
            password: hashedPassword
        })

        await newUser.save()

        res.status(201).json({ message: 'User registered successfully.', user: newUser });

    } catch(err){
        res.status(500).json({message: "server error"})
    }
    

}

exports.loginUser = async(req, res) => {
    try{

        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: "user not found"})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({message: "Invalid credentials"})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '10d'})

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age
            }
        })

    }catch(err){
        res.status(500).json({message: "server error"});
    }
}

// Update User (including payment details)
exports.updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, age } = req.body;
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user details
      const updatedUser = await User.findByIdAndUpdate(userId, {
        name,
        email,
        age,
      }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'Failed to update user' });
      }
  
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error' });
    }
};