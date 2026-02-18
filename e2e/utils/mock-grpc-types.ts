import type { DescMessage, MessageShape } from '@bufbuild/protobuf'

export type GrpcHandler<Req extends DescMessage, Res extends DescMessage> = (
  request: MessageShape<Req>
) => MessageShape<Res> | Promise<MessageShape<Res>>

export interface HandlerConfig {
  requestSchema: DescMessage
  responseSchema: DescMessage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (request: any) => any
}
