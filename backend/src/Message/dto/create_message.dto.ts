export class CreateMessageDto {
  readonly id: number;
  readonly sender_id: number;
  readonly receiver_id: number;
  readonly content: string;
  readonly created_at: number;
}
