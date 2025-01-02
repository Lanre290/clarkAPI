import { Response } from "express";
import User from "../Models/Users";

interface userActions {
  getUser: Function;
  updateUser: Function;
}

const userActions: userActions = {
  getUser: async (req: Request | any, res: Response) => {
    const user = req.user;
    const user_id = user.id;

    if (!user || !user_id) {
      return res.status(401).json({ error: "Unauthorized access." });
    } else {
      let user = await User.findOne({ where: { id: user_id } });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const { password, createdAt, updatedAt, ...userData } = user?.dataValues;

      const date = new Date();
      const today = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
      const lastActivity = userData.last_active_date;


      
      const diffDays = parseInt(today) - lastActivity;

      // increase streak if it is one day
      if(diffDays === 1){
        User.increment('streak_count', {
          by: 1,
          where: { id: user_id },
        })

        User.update({last_active_date: today}, {where: {id: user_id}});
        // return streak day + 1 if streak is continued
        userData.streak_count  = userData.streak_count + 1;
      }
      else{
        User.update({last_active_date: today}, {where: {id: user_id}});
      }

      return res.status(200).json({success: true, data: userData});
    }
  },

  updateUser: async (req: Request & any, res: Response) => {
    const user = req.user;
    const user_id = user.id;
    const { name } = req.body;

    if (!user || !user_id) 
      return res.status(401).json({ error: "Unauthorized access." });

    if(!name)
      return res.status(400).json({error: 'Bad request.'});

    let userInfo = await User.findOne({ where: { id: user_id } });

    if (!userInfo) {
      return res.status(404).json({ error: "User not found." });
    }

    User.update({name: name}, {where: {id: user_id}});

    return res.status(200).json({success: true}); 
  },
};

export default userActions;
