export interface Event {
  eventId: number;    // Уникальный идентификатор события
  eventType: string;  // Тип события, например, 'create' или 'update'
  userId: number;     // Идентификатор пользователя, связанного с событием
  eventTime: Date;    // Время, когда событие произошло
}