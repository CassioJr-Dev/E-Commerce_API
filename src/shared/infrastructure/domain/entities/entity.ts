import { v4 as uuidv4 } from 'uuid';

export abstract class Entity<Props = any> {
  public readonly _id: string;
  public readonly props: Props;
  public readonly created_at: Date;
  public readonly update_at: Date;

  constructor(props: Props, id?: string, created_at?: Date, update_at?: Date) {
    this.props = props;
    this._id = id || uuidv4();
    this.created_at = created_at || this.toDate();
    this.update_at = update_at || this.toDate()
  }

  get id() {
    return this._id;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }

  toDate(): Date {
    const newDate = new Date()
    newDate.setUTCHours(newDate.getUTCHours() - 3);

    return newDate;
  }
}
