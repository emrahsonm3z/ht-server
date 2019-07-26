import { Entity, ObjectIdColumn, Column, BaseEntity, ObjectID } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Column("text") password: string;
}
