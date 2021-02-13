const User = require("../models/Users");

exports.registerUser = (async (req, res, next) => {
    try{
        let { email, password } = req.body;
        let user = await User.create({
        email,
        password
        });
        res.status(201).send({
            'msg': 'Registerd successfully..Please login'
        })
    }catch(err){
        console.log(err);
        if (err.code === 11000) {
            return res.status(409).send({
                success: false,
                message: 'User already exists',
              });
          }
          res.status(500).send({
            success: false,
            message: 'Internal server error',
          });

    }
  });

exports.login = (async (req, res, next) => {
    let { email, password } = req.body;
    if (!email ||  !password) {
      return res.status(401).send({
        'success': false,
        'message': 'email or password missing'
    })
    }
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).send({
        'success': false,
        'message': 'No user exists'
    })
    }
    let isUser = await user.matchPassword(password);
    if (!isUser) {
      return res.status(401).send({
          'message': 'Invalid Credentials'
      })
    }
    let token = user.getSignedJwtToken();
    res.status(200).json({ token });
  });

exports.getUser = (async (req, res, next) => {
try {
    let user = await User.findOne({id: req.params.id});
    if(!user){
      return res.status(401).send({
        success: false,
        message: "No user exists",
      });
    }
    res.status(200).send({
    success: true,
    data: user,
    });
} catch (error) {
    console.log(error);
}
});

exports.deleteUser = (async (req, res, next) => {
  if(req.params.id){
    let user = await User.findOne({id: req.params.id});
    if(!user){
      return res.status(401).send({
        success: false,
        message: "No user exists",
      });
    }
    user.remove();
    return res.status(200).send({
      success: true,
      message: "User remvoed",
    });
  }else{
    return res.status(401).send({
      success: false,
      message: "user id missing",
    });
  }   
});


exports.getUsers = (async (req, res, next) => {
  let query = User.find()

  //pagination
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 100;
  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;
  let total = await User.countDocuments();
  query = query.skip(startIndex).limit(limit);

  //pagination result
  let pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  // console.log(query);
  let users = await query;
  res.status(200).send({
    success: true,
    count: users.length,
    pagination,
    data: users,
  });
});

exports.createUser = (async (req, res, next) => {
  try {
    await User.create(req.body);
  return res.status(200).send({
    success: true,
    message: 'User added'
  }); 
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send({
          success: false,
          message: 'User already exists',
        });
    }
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
});
