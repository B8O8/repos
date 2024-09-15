import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../utils/database";
import { UserGetDTO, UserInsertDTO, UserUpdateDTO } from "../utils/types/TUser";
import { USER_GET_FIELDS } from "../utils/constants";

class UserDTO {
  constructor() {}

  async findAll(
    queryText: string,
    args: (string | number)[]
  ): Promise<UserGetDTO[]> {
    const [rows] = await pool.query<RowDataPacket[]>(queryText, args);
    return rows as UserGetDTO[];
  }

  async findFirst(
    queryText: string,
    args: (string | number)[]
  ): Promise<UserGetDTO> {
    const [rows] = await pool.query<RowDataPacket[]>(queryText, args);
    return rows[0] as UserGetDTO;
  }

  async getAll(): Promise<UserGetDTO[]> {
    const queryString = `SELECT * FROM users`;
    return await this.findAll(queryString, []);
  }

  async getAllInfoById(id: number): Promise<UserGetDTO> {
    const queryString = `SELECT * FROM users WHERE id = ?`;
    return await this.findFirst(queryString, [id]);
  }

  async getAllInfoByEmail(email: string): Promise<UserGetDTO> {
    const queryString = `SELECT * FROM users WHERE email = ?`;
    return await this.findFirst(queryString, [email]);
  }

  async getById(id: number): Promise<UserGetDTO> {
    const queryString = `SELECT ${USER_GET_FIELDS} FROM users WHERE id = ?`;
    return await this.findFirst(queryString, [id]);
  }

  async getByEmail(email: string): Promise<UserGetDTO> {
    const queryString = `SELECT ${USER_GET_FIELDS} FROM users WHERE email = ?`;
    return await this.findFirst(queryString, [email]);
  }

  constructUpdateParams(updateArgs: Partial<UserUpdateDTO>): string {
    let str = ``;
    for (const [key, value] of Object.entries(updateArgs)) {
      str += `${key}='${value}',`;
    }
    str = str.slice(0, -1);
    return str;
  }

  async updateById(
    id: number,
    updateArgs: Partial<UserUpdateDTO>
  ): Promise<UserGetDTO> {
    const queryString = `
            UPDATE users
            SET ${this.constructUpdateParams(updateArgs)}
            WHERE id = ?
        `;
    await pool.query<ResultSetHeader>(queryString, [id]);
    return this.getById(id);
  }

  async checkIdAndPassword(id: number, password: string): Promise<boolean> {
    const queryString = "SELECT * FROM users WHERE id = ? AND password = ?";
    const exists = await this.findFirst(queryString, [id, password]);
    if (exists) return true;
    return false;
  }

  async checkEmailAndPassword(
    email: string,
    password: string
  ): Promise<boolean> {
    const queryString = "SELECT * FROM users WHERE email = ? AND password = ?";
    const exists = await this.findFirst(queryString, [email, password]);
    if (exists) return true;
    return false;
  }

  async checkEmail(email: string): Promise<boolean> {
    const queryString = "SELECT * FROM users WHERE email = ?";
    const exists = await this.findFirst(queryString, [email]);
    if (exists) return true;
    return false;
  }

  async updatePassword(id: number, password: string): Promise<boolean> {
    const queryString = `
        UPDATE users
        SET password = ?
        WHERE id = ?
        `;
    await pool.query<ResultSetHeader>(queryString, [password, id]);
    const exists = await this.checkIdAndPassword(id, password);
    if (exists) return true;
    return false;
  }

  async insert(args: UserInsertDTO): Promise<UserGetDTO> {
    const queryString = `INSERT INTO users 
            (email, username, password, firstName, lastName, phoneNumber, md5Id, charged, dispensed) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
        `;
    await pool.query<ResultSetHeader>(queryString, [
      args.email,
      args.username,
      args.password,
      args.firstName,
      args.lastName,
      args.phoneNumber,
      args.md5Id,
      args.charged,
      args.charged, // Setting dispensed equal to charged
    ]);
    return await this.getByEmail(args.email);
  }

  async deleteById(id: number): Promise<boolean> {
    const queryString = `
            DELETE FROM users
            WHERE id = ?
        `;
    await pool.query<ResultSetHeader>(queryString, [id]);
    const exists = await this.getById(id);
    if (!exists) return true;
    return false;
  }
}

export default new UserDTO();
