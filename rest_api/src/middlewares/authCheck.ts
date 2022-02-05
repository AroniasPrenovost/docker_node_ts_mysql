const jwt = require('jsonwebtoken');

export const authCheck = (req: any, res: any, next: any) => {
    try {
      let token: string; 
      if (req && req.headers && req.headers['authorization']) {
        token = req.headers['authorization'].split(' ')[1];
      }

      if (token == null) {
        res.status(404).send('Missing Authorization header.');
      } else {
        jwt.verify(token, process.env.JWT_KEY, (err: string, data: any) => {
          if (err) {
            res.status(404).send('Authentication failed.');
          } else {
            req.user = data;
            next(); 
          }
        })
      }
  } catch (error) {
      next(error);
  }
};
