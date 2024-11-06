const User = require("../models/user");
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
  try {
    // 1) get field data
    const { name, username, password } = req.body;
    // 2) -check password length
    if (password.length > 30 || password.length < 8) {
      res.status(400).json({message: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل ولا تزيد عن 30 حرفًا'})
      return;
    }
    //3) add new user
    const user = new User({ name, username, password });
    await user.save();
    res.status(201).json({message: true, data: user.signJWT()})
  } catch(e){
    //3) --check if data is valid with schema rolls
    if(e.name === 'ValidationError')
      res.status(400).json({message: Object.values(e.errors)[0].message })
    //3) ---check if user is exist
    else if (e.code === 11000) 
      res.status(400).json({message: 'اسم المستخدم موجود بالفعل'});
    else 
      res.status(400).json({message: 'حدث خطأ. يرجى المحاولة مرة أخرى.'})
  }
};

exports.login = async (req, res) => {
  try {
    const {username, password} = req.body
    const user = await User.findOne({username});
    if( user && user.checkPassword(password) ) {
      res.status(200).json({message: true, data: user.signJWT()})
    } else {
      res.status(500).json({message: 'الرجاء التحقق من اسم المستخدم وكلمة المرور'})
    }

  } catch (e) {
    res.status(500).json({ message: 'حدث خطأ. يرجى المحاولة مرة أخرى.' });
  }
}