export class CreateMessageDto {
  readonly sender_id: number;
  readonly receiver_id: number;
  readonly content: string;
}
