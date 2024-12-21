import { Response } from "express";
import User from "../Models/Users";

interface userActions {
  getUser: Function;
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

      const today = new Date(); // Current date and time
      const lastActivity = new Date(userData.last_active_date);

      // Use the start of the day in local time for both dates
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfLastActivity = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());

    const diffDays = Math.floor(((startOfToday as any) - (startOfLastActivity as any)) / (1000 * 60 * 60 * 24));



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
