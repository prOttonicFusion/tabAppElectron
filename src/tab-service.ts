import TabDB from "./tab-database";
import { getFormattedDate } from "./date-formatter";

class TabService {
  tabDB: TabDB;

  constructor(tabDB: TabDB) {
    this.tabDB = tabDB;
  }

  async addTransaction(user: string, transaction: number): Promise<boolean> {
    const userBalance = await this.tabDB.getBalanceOfUser(user);
    const newBalance = userBalance + transaction;
    const timeStamp = getFormattedDate();

    return (
      this.tabDB.updateUser(user, newBalance) &&
      this.tabDB.updateHistory(user, timeStamp, transaction)
    );
  }
}

export default TabService;
