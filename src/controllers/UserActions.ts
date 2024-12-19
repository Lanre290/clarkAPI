import { Response } from "express";
import User from "../Models/Users";

interface userActions {
  getUser: Function;
}

const userActions: userActions = {
  getUser: async (req: Request | any, res: Response) => {
    const user = req.user;
    const user_id = user.id;
    console.log(user)

    if (!user || !user_id) {
      return res.status(401).json({ error: "Unauthorized access." });
    } else {
      let user = await User.findOne({ where: { id: user_id } });

      const { password, createdAt, updatedAt, ...userData } = user?.dataValues;

      return res.status(200).json({success: true, data: userData});
    }
  },
};

export default userActions;
