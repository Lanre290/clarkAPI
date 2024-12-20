import { Response } from "express";
import User from "../Models/Users";

interface userActions {
  getUser: Function;
}

const userActions: userActions = {
  getUser: async (req: Request | any, res: Response) => {
    const user = req.user;
    const user_id = user.id;
    const today = new Date().toISOString().split('T')[0];

    if (!user || !user_id) {
      return res.status(401).json({ error: "Unauthorized access." });
    } else {
      let user = await User.findOne({ where: { id: user_id } });

      const { password, createdAt, updatedAt, ...userData } = user?.dataValues;

      const lastActivity = new Date(userData.last_active_date);
      const diffDays = Math.floor(((new Date(today) as any) - (lastActivity as any)) / (1000 * 60 * 60 * 24));


      // increase streak if it is one day
      if(diffDays == 1){
        User.increment('streak_count', {
          by: 1,
          where: { id: user_id },
        })
      }

      return res.status(200).json({success: true, data: userData});
    }
  },
};

export default userActions;
