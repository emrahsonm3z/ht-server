import {
  Entity,
  ObjectIdColumn,
  Column,
  BaseEntity,
  ObjectID,
  BeforeInsert
} from "typeorm";

import * as bcrypt from "bcryptjs";

@Entity("users")
export class User extends BaseEntity {
  @ObjectIdColumn({ name: "_id" })
  id: ObjectID;

  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Column("text")
  password: string;

  @Column("boolean")
  confirmed: boolean;

  @Column("boolean")
  forgotPasswordLocked: boolean;

  @BeforeInsert()
  async beforeInsertActions() {
    this.confirmed = this.confirmed === undefined ? false : this.confirmed;
    this.forgotPasswordLocked =
      this.forgotPasswordLocked === undefined
        ? false
        : this.forgotPasswordLocked;
    this.password = await bcrypt.hash(this.password, 10);
  }
}
