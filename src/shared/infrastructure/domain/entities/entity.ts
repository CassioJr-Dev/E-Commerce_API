import { v4 as uuidv4 } from 'uuid';

export abstract class Entity<Props = any> {
  public readonly _id: string;
  public readonly props: Props;
  public readonly _created_at: Date;
  public readonly _update_at: Date;

  constructor(props: Props, id?: string, created_at?: Date, update_at?: Date) {
    this.props = props;
    this._id = id || uuidv4();
    this._created_at = created_at || this.toDate();
    this._update_at = update_at || this.toDate()
  }

  get id() {
    return this._id;
  }

  get created_at() {
    return this._created_at;
  }

  get update_at() {
    return this._update_at;
  }

  toJSON(): Required<{ id: string, created_at: Date, update_at: Date } & Props> {

    return {
      id: this._id,
      ...this.props,
      created_at: this._created_at,
      update_at: this._update_at
    } as Required<{ id: string, created_at: Date, update_at: Date } & Props>;

  }

  toDate(): Date {
    const newDate = new Date()
    newDate.setUTCHours(newDate.getUTCHours() - 3);

    return newDate;
  }
}
