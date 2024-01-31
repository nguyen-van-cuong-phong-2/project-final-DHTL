export class CreateMessageDto {
  readonly sender_id: number;
  readonly receiver_id: number;
  readonly content: string;
  readonly image?: string;
  readonly video?: string;
  readonly id_story?: number;
  readonly like?: number;
}
