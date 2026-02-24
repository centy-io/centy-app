import type { DescMessage, MessageShape } from '@bufbuild/protobuf'

export type GrpcHandler<Req extends DescMessage, Res extends DescMessage> = (
  request: MessageShape<Req>
) => MessageShape<Res> | Promise<MessageShape<Res>>

export interface HandlerConfig {
  requestSchema: DescMessage
  responseSchema: DescMessage
  handler(
    request: MessageShape<DescMessage>
  ): MessageShape<DescMessage> | Promise<MessageShape<DescMessage>>
}
